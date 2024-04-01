CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    reg_no VARCHAR(10),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_mahe BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    date_of_birth DATE,
    contact VARCHAR(10)
);

INSERT INTO users (name, email, password, is_admin, is_mahe) VALUES ('admin', 'admin_ic@manipal.edu', 'admin', TRUE, TRUE);

CREATE TYPE startup_status AS ENUM ('pending', 'approved', 'invalid', 'alumni');

CREATE TABLE startups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    pitch_deck_url VARCHAR(100),
    pitch_video_url VARCHAR(100),
    logo_url VARCHAR(100),
    startup_admin INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    industry VARCHAR[] NOT NULL,
    status startup_status NOT NULL DEFAULT 'pending'
);

CREATE TABLE startup_members (
    startup_id INT REFERENCES startups(id),
    user_id INT REFERENCES users(id),
    PRIMARY KEY (startup_id, user_id)
);