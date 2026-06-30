-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at BIGINT,
    updated_at BIGINT
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_username ON admins(username);
CREATE INDEX IF NOT EXISTS idx_email ON admins(email);

-- Insert default admin user
INSERT INTO admins (
    username,
    password,
    email,
    role,
    phone,
    active,
    created_at,
    updated_at
)
VALUES (
    'admin',
    'admin123',
    'admin@swiggy.com',
    'ADMIN',
    '9876543210',
    TRUE,
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000,
    EXTRACT(EPOCH FROM NOW())::BIGINT * 1000
)
ON CONFLICT (username)
DO UPDATE SET
updated_at = EXTRACT(EPOCH FROM NOW())::BIGINT * 1000;