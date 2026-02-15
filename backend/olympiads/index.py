"""API олимпиад: создание, поиск, фильтрация, управление результатами учеников"""
import json
import os
import hashlib
import hmac
import time
import base64
import psycopg2
import psycopg2.extras

CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Authorization',
    'Access-Control-Max-Age': '86400',
    'Content-Type': 'application/json'
}

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

def get_user(event):
    auth = event.get('headers', {}).get('X-Authorization', '') or event.get('headers', {}).get('x-authorization', '')
    token = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else auth
    if not token:
        return None
    return verify_jwt(token)

def resp(status, body):
    return {'statusCode': status, 'headers': CORS_HEADERS, 'body': json.dumps(body, ensure_ascii=False, default=str)}

LEVEL_MAP = {'school': 'Школьный', 'municipal': 'Муниципальный', 'regional': 'Региональный', 'national': 'Всероссийский'}

def handler(event, context):
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action', 'list')

    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    try:
        if method == 'GET' and action == 'list':
            return list_olympiads(conn, params)
        elif method == 'POST' and action == 'create':
            return create_olympiad(conn, event)
        elif method == 'POST' and action == 'result':
            return add_result(conn, event)
        elif method == 'GET' and action == 'my-results':
            return my_results(conn, event)
        elif method == 'GET' and action == 'students':
            return list_students(conn, event)
        elif method == 'GET' and action == 'stats':
            return get_stats(conn, event)
        elif method == 'POST' and action == 'approve':
            return approve_olympiad(conn, event)
        else:
            return resp(200, {'service': 'olympiads', 'actions': ['list', 'create', 'result', 'my-results', 'students', 'stats', 'approve']})
    finally:
        conn.close()

def list_olympiads(conn, params):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    query = "SELECT o.*, u.first_name || ' ' || u.last_name as created_by_name FROM olympiads o LEFT JOIN users u ON o.created_by = u.id WHERE 1=1"
    args = []

    if params.get('subject'):
        query += " AND o.subject ILIKE %s"
        args.append(f"%{params['subject']}%")
    if params.get('level'):
        query += " AND o.level = %s"
        args.append(params['level'])
    if params.get('approved_only') == 'true':
        query += " AND o.is_approved = TRUE"

    query += " ORDER BY o.event_date DESC LIMIT 50"
    cur.execute(query, args)
    rows = cur.fetchall()
    return resp(200, {'olympiads': [dict(r) for r in rows]})

def create_olympiad(conn, event):
    user = get_user(event)
    if not user or user.get('role') not in ('teacher', 'admin'):
        return resp(403, {'error': 'Только учителя могут создавать олимпиады'})

    body = json.loads(event.get('body', '{}'))
    title = body.get('title', '').strip()
    subject = body.get('subject', '').strip()
    level = body.get('level', '')
    event_date = body.get('event_date', '')
    description = body.get('description', '').strip()

    if not title or not subject or not level or not event_date:
        return resp(400, {'error': 'Заполните все обязательные поля'})
    if level not in ('school', 'municipal', 'regional', 'national'):
        return resp(400, {'error': 'Некорректный уровень олимпиады'})

    cur = conn.cursor()
    cur.execute(
        "INSERT INTO olympiads (title, subject, level, event_date, description, created_by, is_approved) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
        (title, subject, level, event_date, description, user['user_id'], user['role'] == 'admin')
    )
    oid = cur.fetchone()[0]
    conn.commit()
    return resp(200, {'id': oid, 'message': 'Олимпиада создана'})

def add_result(conn, event):
    user = get_user(event)
    if not user or user.get('role') not in ('teacher', 'admin'):
        return resp(403, {'error': 'Только учителя могут добавлять результаты'})

    body = json.loads(event.get('body', '{}'))
    student_id = body.get('student_id')
    olympiad_id = body.get('olympiad_id')
    place = body.get('place')
    year = body.get('year')

    if not student_id or not olympiad_id or not year:
        return resp(400, {'error': 'Заполните все обязательные поля'})

    cur = conn.cursor()
    try:
        cur.execute(
            "INSERT INTO results (student_id, olympiad_id, place, year, added_by) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (student_id, olympiad_id, place, year, user['user_id'])
        )
        rid = cur.fetchone()[0]
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return resp(400, {'error': 'Результат для этого ученика уже добавлен'})

    return resp(200, {'id': rid, 'message': 'Результат добавлен'})

def my_results(conn, event):
    user = get_user(event)
    if not user:
        return resp(401, {'error': 'Требуется авторизация'})

    params = event.get('queryStringParameters') or {}
    student_id = params.get('student_id', user['user_id'])

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT r.*, o.title as olympiad_title, o.subject, o.level, o.event_date
        FROM results r
        JOIN olympiads o ON r.olympiad_id = o.id
        WHERE r.student_id = %s
        ORDER BY r.year DESC, o.event_date DESC
    """, (student_id,))
    rows = cur.fetchall()
    return resp(200, {'results': [dict(r) for r in rows]})

def get_stats(conn, event):
    user = get_user(event)
    if not user:
        return resp(401, {'error': 'Требуется авторизация'})

    params = event.get('queryStringParameters') or {}
    student_id = params.get('student_id', user['user_id'])

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN r.place = 1 THEN 1 END) as wins,
            COUNT(CASE WHEN r.place IN (1,2,3) THEN 1 END) as prizes
        FROM results r WHERE r.student_id = %s
    """, (student_id,))
    stats = dict(cur.fetchone())
    return resp(200, {'stats': stats})

def list_students(conn, event):
    user = get_user(event)
    if not user or user.get('role') not in ('teacher', 'admin'):
        return resp(403, {'error': 'Доступ запрещён'})

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute("""
        SELECT id, email, first_name, last_name, grade, created_at
        FROM users WHERE role = 'student'
        ORDER BY last_name, first_name
    """)
    rows = cur.fetchall()
    return resp(200, {'students': [dict(r) for r in rows]})

def approve_olympiad(conn, event):
    user = get_user(event)
    if not user or user.get('role') != 'admin':
        return resp(403, {'error': 'Только администратор может подтверждать олимпиады'})

    body = json.loads(event.get('body', '{}'))
    olympiad_id = body.get('olympiad_id')
    if not olympiad_id:
        return resp(400, {'error': 'Укажите id олимпиады'})

    cur = conn.cursor()
    cur.execute("UPDATE olympiads SET is_approved = TRUE WHERE id = %s", (olympiad_id,))
    conn.commit()
    return resp(200, {'message': 'Олимпиада подтверждена'})