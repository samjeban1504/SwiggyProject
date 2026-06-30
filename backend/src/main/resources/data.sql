-- Clean up any existing duplicate restaurants (keeps the one with the smallest ID)
DELETE FROM restaurant a USING (
    SELECT MIN(id) as id, restaurant_name
    FROM restaurant 
    GROUP BY restaurant_name 
) b
WHERE a.restaurant_name = b.restaurant_name AND a.id <> b.id;

-- Insert sample restaurants safely without creating duplicates
INSERT INTO restaurant (restaurant_name, owner_name, phone, email, address)
SELECT 'Pizza Hut', 'John', '9876543210', 'pizza@gmail.com', 'Chennai'
WHERE NOT EXISTS (SELECT 1 FROM restaurant WHERE restaurant_name = 'Pizza Hut');

INSERT INTO restaurant (restaurant_name, owner_name, phone, email, address)
SELECT 'Burger King', 'Smith', '9876543211', 'burger@gmail.com', 'Chennai'
WHERE NOT EXISTS (SELECT 1 FROM restaurant WHERE restaurant_name = 'Burger King');

INSERT INTO restaurant (restaurant_name, owner_name, phone, email, address)
SELECT 'SS Biryani', 'Ahmed Khan', '9876543212', 'ssbiryani@gmail.com', 'Chennai'
WHERE NOT EXISTS (SELECT 1 FROM restaurant WHERE restaurant_name = 'SS Biryani');

INSERT INTO restaurant (restaurant_name, owner_name, phone, email, address)
SELECT 'Ammul', 'Vinoth', '7628918278', 'ammul@gmail.com', 'Chennai'
WHERE NOT EXISTS (SELECT 1 FROM restaurant WHERE restaurant_name = 'Ammul');

INSERT INTO restaurant (restaurant_name, owner_name, phone, email, address)
SELECT 'Toco Bell', 'David', '9876543213', 'tocobell@gmail.com', 'Chennai'
WHERE NOT EXISTS (SELECT 1 FROM restaurant WHERE restaurant_name = 'Toco Bell');

INSERT INTO restaurant (restaurant_name, owner_name, phone, email, address)
SELECT 'KFC', 'Tony', '9876543214', 'kfc@gmail.com', 'Chennai'
WHERE NOT EXISTS (SELECT 1 FROM restaurant WHERE restaurant_name = 'KFC');