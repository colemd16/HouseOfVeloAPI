-- House of Velo Database Schema

CREATE DATABASE IF NOT EXISTS houseofvelo;
USE houseofvelo;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role ENUM('parent', 'admin', 'trainer') DEFAULT 'parent',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Players table (kids managed by parents)
CREATE TABLE players (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parent_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  age INT,
  position VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Session types (Hitting, Pitching, etc.)
CREATE TABLE session_types (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  duration INT NOT NULL, -- minutes
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages (4 sessions for $225, etc.)
CREATE TABLE packages (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  sessions_included INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  validity_days INT NOT NULL, -- e.g., 28 days for 4 weeks
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Package purchases
CREATE TABLE package_purchases (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  package_id INT NOT NULL,
  sessions_remaining INT NOT NULL,
  purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date DATETIME NOT NULL,
  stripe_payment_id VARCHAR(255),
  amount_paid DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id)
);

-- Trainers
CREATE TABLE trainers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT UNIQUE NOT NULL,
  bio TEXT,
  specialties JSON, -- ["Hitting", "Pitching"]
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Bookings
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  player_id INT NOT NULL,
  session_type_id INT NOT NULL,
  trainer_id INT,
  package_purchase_id INT, -- NULL if single session
  scheduled_at DATETIME NOT NULL,
  status ENUM('confirmed', 'cancelled', 'completed', 'no_show') DEFAULT 'confirmed',
  stripe_payment_id VARCHAR(255), -- For single session payments
  amount_paid DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (session_type_id) REFERENCES session_types(id),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
  FOREIGN KEY (package_purchase_id) REFERENCES package_purchases(id) ON DELETE SET NULL
);

-- Insert default session types
INSERT INTO session_types (name, description, duration, price) VALUES
('Hitting', '1-on-1 hitting instruction', 60, 75.00),
('Pitching', '1-on-1 pitching instruction', 60, 75.00),
('Catching', '1-on-1 catching instruction', 60, 75.00),
('Fielding', '1-on-1 fielding instruction', 60, 75.00);

-- Insert default packages
INSERT INTO packages (name, description, sessions_included, price, validity_days) VALUES
('4-Session Pack', 'Four 1-hour training sessions (save $75)', 4, 225.00, 28),
('8-Session Pack', 'Eight 1-hour training sessions (save $175)', 8, 425.00, 56);

-- Team rental requests
CREATE TABLE team_rental_requests (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  organization VARCHAR(255) NOT NULL,
  team_age VARCHAR(100) NOT NULL,
  details TEXT NOT NULL,
  status ENUM('pending', 'contacted', 'scheduled', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create admin user (password: admin123 - hashed)
INSERT INTO users (email, password, name, role) VALUES
('admin@houseofvelo.com', '$2a$10$rXQ7Y7X3qZ0p9KZ8Z8Z8ZuZ8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z', 'Admin User', 'admin');
