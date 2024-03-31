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