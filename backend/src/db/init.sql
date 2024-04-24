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
    website_url VARCHAR(100),
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
    area_of_interest TEXT NOT NULL,
    available_days TEXT NOT NULL,
    request_details TEXT,
    user_id INT REFERENCES users(id),
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
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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


CREATE OR REPLACE FUNCTION get_startup_stats()
RETURNS TABLE(
    total_users INT,
    total_approved_startups INT,
    total_alumni_startups INT,
    total_workspaces INT,
    total_pending_startups INT,
    total_invalid_startups INT,
    total_pending_workspace_requests INT,
    total_pending_mentorship_requests INT
) AS $$
BEGIN
    -- Count total users
    SELECT COUNT(*) INTO total_users FROM users;

    -- Count total approved startups
    SELECT COUNT(*) INTO total_approved_startups FROM startups
    WHERE status = 'approved';

    -- Count total alumni startups
    SELECT COUNT(*) INTO total_alumni_startups FROM startups
    WHERE status = 'alumni';

    -- Count total workspaces
    SELECT COUNT(*) INTO total_workspaces FROM workspaces;

    -- Count total pending startups
    SELECT COUNT(*) INTO total_pending_startups FROM startups
    WHERE status = 'pending';

    -- Count total invalid startups
    SELECT COUNT(*) INTO total_invalid_startups FROM startups
    WHERE status = 'invalid';

    -- Count total pending workspace requests
    SELECT COUNT(*) INTO total_pending_workspace_requests FROM workspace_requests
    WHERE status = 'pending';

    -- Count total pending mentorship requests
    SELECT COUNT(*) INTO total_pending_mentorship_requests FROM mentorship_requests
    WHERE status = 'pending';

    -- Return all counts
    RETURN QUERY SELECT total_users, total_approved_startups, total_alumni_startups, total_workspaces,
                    total_pending_startups, total_invalid_startups, total_pending_workspace_requests,
                    total_pending_mentorship_requests;
END;
$$ LANGUAGE plpgsql;
