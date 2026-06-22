-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    phone VARCHAR(20),
    active BOOLEAN DEFAULT TRUE,
    created_at BIGINT,
    updated_at BIGINT,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Insert default admin user
INSERT INTO admins (username, password, email, role, phone, active, created_at, updated_at) 
VALUES ('admin', 'admin123', 'admin@swiggy.com', 'ADMIN', '9876543210', true, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000)
ON DUPLICATE KEY UPDATE updated_at = UNIX_TIMESTAMP() * 1000;
