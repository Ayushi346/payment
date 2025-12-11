-- Payment Collection Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS payment_collection;
USE payment_collection;

-- Customers Table
CREATE TABLE IF NOT EXISTS Customers (
    account_number VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    mobile VARCHAR(15) NOT NULL,
    emi_due INT DEFAULT 0,
    emi_amount DECIMAL(10, 2) NOT NULL,
    interest_rate DECIMAL(5, 2) NOT NULL,
    issue_date DATE NOT NULL,
    tenure INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_mobile (mobile)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS Payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_account_number VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE NOT NULL,
    status ENUM('pending', 'completed', 'partial', 'failed') DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_account_number) REFERENCES Customers(account_number) ON DELETE CASCADE,
    INDEX idx_customer_account (customer_account_number),
    INDEX idx_payment_date (payment_date)
);

-- Insert sample data for testing
INSERT INTO Customers (account_number, name, mobile, emi_due, emi_amount, interest_rate, issue_date, tenure) VALUES
('ACC001', 'John Doe', '9876543210', 5, 5000.00, 12.5, '2024-01-15', 12),
('ACC002', 'Jane Smith', '9876543211', 3, 7500.00, 10.0, '2024-02-01', 10),
('ACC003', 'Bob Johnson', '9876543212', 8, 3000.00, 15.0, '2023-12-10', 15);

-- Insert sample payment data
INSERT INTO Payments (customer_account_number, amount, payment_date, status) VALUES
('ACC001', 5000.00, '2024-01-15', 'completed'),
('ACC001', 5000.00, '2024-02-15', 'completed'),
('ACC002', 7500.00, '2024-02-01', 'completed'),
('ACC003', 3000.00, '2023-12-10', 'completed'),
('ACC003', 2000.00, '2024-01-10', 'partial');

