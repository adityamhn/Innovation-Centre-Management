CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    reg_no VARCHAR(10),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
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
    status startup_status NOT NULL DEFAULT 'pending',
    public_profile BOOLEAN DEFAULT FALSE
);

CREATE TABLE startup_members (
    startup_id INT REFERENCES startups(id),
    user_id INT REFERENCES users(id),
    role TEXT NOT NULL,
    PRIMARY KEY (startup_id, user_id)
);

CREATE TABLE workspaces (
    workspace_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    size VARCHAR(100),
    amenities TEXT[],
    available BOOLEAN DEFAULT TRUE,
    description TEXT
);

CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected');


CREATE TABLE workspace_allocations (
    allocation_id SERIAL,
    workspace_id INT REFERENCES workspaces(workspace_id),
    start_date DATE NOT NULL,
    user_id INT REFERENCES users(id),
    startup_id INT REFERENCES startups(id),
    end_date DATE,
    PRIMARY KEY (workspace_id, user_id)
);


CREATE TABLE workspace_requests (
    request_id SERIAL PRIMARY KEY,
    workspace_type VARCHAR(100) NOT NULL,
    requester_id INT REFERENCES users(id),
    reason TEXT NOT NULL,
    members_count INT NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    status request_status DEFAULT 'pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE startup_updates (
    update_id SERIAL PRIMARY KEY,
    startup_id INT REFERENCES startups(id),
    content TEXT NOT NULL,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE update_comments (
    comment_id SERIAL PRIMARY KEY,
    update_id INT REFERENCES startup_updates(update_id),
    commenter_id INT REFERENCES users(id),
    comment TEXT NOT NULL,
    commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mentorship_requests (
    request_id SERIAL PRIMARY KEY,
    startup_id INT REFERENCES startups(id),
    mentor_id INT REFERENCES users(id),
    request_details TEXT,
    status request_status DEFAULT 'pending',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mentorship_sessions (
    session_id SERIAL PRIMARY KEY,
    request_id INT REFERENCES mentorship_requests(request_id),
    session_date TIMESTAMP NOT NULL,
    session_notes TEXT
);


CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date TIMESTAMP,
    location VARCHAR(255),
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE news (
    news_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    posted_by INT REFERENCES users(id),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE investment_opportunities (
    opportunity_id SERIAL PRIMARY KEY,
    opportunity_details TEXT NOT NULL,
    visibility BOOLEAN DEFAULT TRUE,
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
