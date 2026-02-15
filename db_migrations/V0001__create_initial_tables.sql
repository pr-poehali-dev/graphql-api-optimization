
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
    grade INTEGER CHECK (grade BETWEEN 1 AND 11),
    subject VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE olympiads (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    level VARCHAR(30) NOT NULL CHECK (level IN ('school', 'municipal', 'regional', 'national')),
    event_date DATE NOT NULL,
    description TEXT,
    created_by INTEGER REFERENCES users(id),
    is_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES users(id) NOT NULL,
    olympiad_id INTEGER REFERENCES olympiads(id) NOT NULL,
    place INTEGER,
    year INTEGER NOT NULL,
    added_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(student_id, olympiad_id, year)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_olympiads_subject ON olympiads(subject);
CREATE INDEX idx_olympiads_level ON olympiads(level);
CREATE INDEX idx_results_student ON results(student_id);
CREATE INDEX idx_results_olympiad ON results(olympiad_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);
