-- Insert default admin user
INSERT IGNORE INTO admins (username, password, email, role, phone, active, created_at, updated_at) 
VALUES ('admin', 'admin123', 'admin@swiggy.com', 'ADMIN', '9876543210', true, UNIX_TIMESTAMP() * 1000, UNIX_TIMESTAMP() * 1000);

-- Insert sample restaurants
INSERT IGNORE INTO restaurant (restaurant_name, owner_name, phone, email, address) 
VALUES 
('Pizza Hut', 'John ', '9876543210', 'pizza@gmail.com', 'chennai'),
('Burger King', 'Smith', '9876543211', 'burger@gmail.com', 'chennai'),
('SS Biryani ', 'Ahmed Khan', '9876543212', 'ssbiryani@gmail.com', 'chennai'),
('Ammul', 'Vinoth', '7628918278', 'ammul@gmail.com', 'Chennai'),
('Toco Bell', 'David', '9876543213', 'tocobell@gmail.com', 'chennai'),
('KFC', 'Tony', '9876543214', 'kfc@gmail.com', 'Chennai');
