"""Регистрация и авторизация пользователей платформы учёта олимпиад"""
import json
import os
import hashlib
import hmac
import time
import base64
import psycopg2

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
}

def make_jwt(payload):
    secret = os.environ['JWT_SECRET']
    header = base64.urlsafe_b64encode(json.dumps({"alg": "HS256", "typ": "JWT"}).encode()).rstrip(b'=').decode()
    payload['exp'] = int(time.time()) + 86400 * 7
    pay = base64.urlsafe_b64encode(json.dumps(payload).encode()).rstrip(b'=').decode()
    sig = hmac.new(secret.encode(), f"{header}.{pay}".encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b'=').decode()
    return f"{header}.{pay}.{sig_b64}"

def verify_jwt(token):
    secret = os.environ['JWT_SECRET']
    parts = token.split('.')
    if len(parts) != 3:
        return None
    sig = hmac.new(secret.encode(), f"{parts[0]}.{parts[1]}".encode(), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(sig).rstrip(b'=').decode()
    if sig_b64 != parts[2]:
        return None
    padding = 4 - len(parts[1]) % 4
    payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=' * padding))
    if payload.get('exp', 0) < time.time():
        return None
    return payload

def hash_password(password):
    salt = os.urandom(16).hex()
    h = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex()
    return f"{salt}:{h}"

def check_password(password, stored):
    salt, h = stored.split(':')
    return hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 100000).hex() == h

def resp(status, body):
    return {'statusCode': status, 'headers': CORS_HEADERS, 'body': json.dumps(body, ensure_ascii=False)}

def handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', '')
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        if method == 'POST' and action == 'register':
            return handle_register(conn, event)
        elif method == 'POST' and action == 'login':
            return handle_login(conn, event)
        elif method == 'GET' and action == 'me':
            return handle_me(conn, event)
        else:
            return resp(200, {'service': 'auth', 'actions': ['register', 'login', 'me']})
    finally:
        conn.close()

def handle_register(conn, event):
    body = json.loads(event.get('body', '{}'))
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')
    first_name = body.get('first_name', '').strip()
    last_name = body.get('last_name', '').strip()
    role = body.get('role', 'student')
    grade = body.get('grade')
    subject = body.get('subject', '').strip() or None

    if not email or not password or not first_name or not last_name:
        return resp(400, {'error': 'Заполните все обязательные поля'})
    if role not in ('student', 'teacher'):
        return resp(400, {'error': 'Некорректная роль'})
    if len(password) < 6:
        return resp(400, {'error': 'Пароль должен быть не менее 6 символов'})
    if role == 'student' and not grade:
        return resp(400, {'error': 'Укажите класс'})

    pw_hash = hash_password(password)
    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO users (email, password_hash, first_name, last_name, role, grade, subject) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (email, pw_hash, first_name, last_name, role, grade, subject)
        )
        user_id = cur.fetchone()[0]
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return resp(400, {'error': 'Пользователь с таким email уже существует'})

    token = make_jwt({'user_id': user_id, 'role': role})
    return resp(200, {
        'token': token,
        'user': {
            'id': user_id,
            'email': email,
            'first_name': first_name,
            'last_name': last_name,
            'role': role,
            'grade': grade,
            'subject': subject
        }
    })

def handle_login(conn, event):
    body = json.loads(event.get('body', '{}'))
    email = body.get('email', '').strip().lower()
    password = body.get('password', '')

    if not email or not password:
        return resp(400, {'error': 'Введите email и пароль'})

    cur = conn.cursor()
    cur.execute("SELECT id, email, password_hash, first_name, last_name, role, grade, subject FROM users WHERE email = %s", (email,))
    row = cur.fetchone()
    if not row or not check_password(password, row[2]):
        return resp(401, {'error': 'Неверный email или пароль'})

    token = make_jwt({'user_id': row[0], 'role': row[5]})
    return resp(200, {
        'token': token,
        'user': {
            'id': row[0],
            'email': row[1],
            'first_name': row[3],
            'last_name': row[4],
            'role': row[5],
            'grade': row[6],
            'subject': row[7]
        }
    })

def handle_me(conn, event):
    auth = event.get('headers', {}).get('X-Authorization', '') or event.get('headers', {}).get('x-authorization', '')
    token = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else auth
    if not token:
        return resp(401, {'error': 'Требуется авторизация'})

    payload = verify_jwt(token)
    if not payload:
        return resp(401, {'error': 'Токен недействителен'})

    cur = conn.cursor()
    cur.execute("SELECT id, email, first_name, last_name, role, grade, subject FROM users WHERE id = %s", (payload['user_id'],))
    row = cur.fetchone()
    if not row:
        return resp(404, {'error': 'Пользователь не найден'})

    return resp(200, {
        'user': {
            'id': row[0],
            'email': row[1],
            'first_name': row[2],
            'last_name': row[3],
            'role': row[4],
            'grade': row[5],
            'subject': row[6]
        }
    })