-- ClothHub Database Schema
-- Import this SQL file into phpMyAdmin

-- Create Database
CREATE DATABASE IF NOT EXISTS clothhub;
USE clothhub;

-- Create Clothes Table
CREATE TABLE clothes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    size VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image LONGBLOB,
    sold INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_brand (brand)
);

-- Create Sales Table
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cloth_id VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cloth_id (cloth_id),
    INDEX idx_timestamp (timestamp)
);

-- Create Reviews Table
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cloth_id VARCHAR(100) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    user_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cloth_id (cloth_id),
    INDEX idx_rating (rating)
);

-- Create Wishlist Table
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cloth_id VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cloth_id (cloth_id)
);

-- Create Users Table (for future authentication)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE,
    role VARCHAR(20) DEFAULT 'customer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample data (optional)
INSERT INTO clothes (brand, color, size, category, stock, price, description) VALUES
('Nike', 'Red', 'M', 'tops', 15, 49.99, 'Premium red t-shirt'),
('Adidas', 'Blue', 'L', 'bottoms', 20, 59.99, 'Comfortable blue jeans'),
('Puma', 'Black', 'M', 'shoes', 10, 79.99, 'Running shoes'),
('Gucci', 'White', 'S', 'tops', 8, 89.99, 'Designer white shirt');

-- Admin user for owner login (password: admin123)
INSERT INTO users (username, password, email, role) VALUES
('admin', '$2y$10$mocked_bcrypt_hash_admin123', 'admin@clothhub.com', 'owner');
