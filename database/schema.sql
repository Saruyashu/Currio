-- =======================================================================
-- CURIO COLLECTIBLE MARKETPLACE - RELATIONAL DATABASE SCHEMA (MySQL 8.0+)
-- Database: curio_marketplace
-- =======================================================================

CREATE DATABASE IF NOT EXISTS curio_marketplace 
    CHARACTER SET utf8mb4 
    COLLATE utf8mb4_unicode_ci;

USE curio_marketplace;

-- Disable foreign key checks for clean teardown/rebuild
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS watchlist;
DROP TABLE IF EXISTS bids;
DROP TABLE IF EXISTS auctions;
DROP TABLE IF EXISTS product_images;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- -----------------------------------------------------------------------
-- 1. USERS TABLE
-- -----------------------------------------------------------------------
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    profile_image VARCHAR(500) DEFAULT NULL,
    role ENUM('GUEST', 'USER', 'ADMIN') NOT NULL DEFAULT 'USER',
    rating DECIMAL(3, 2) DEFAULT 5.00,
    status ENUM('ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 2. CATEGORIES TABLE (Hierarchical)
-- -----------------------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_category_parent (parent_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 3. PRODUCTS TABLE
-- -----------------------------------------------------------------------
CREATE TABLE products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    seller_id BIGINT NOT NULL,
    category_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    brand VARCHAR(100) DEFAULT NULL,
    model VARCHAR(100) DEFAULT NULL,
    year INT DEFAULT NULL,
    item_condition ENUM('MINT', 'NEAR_MINT', 'EXCELLENT', 'VERY_GOOD', 'GOOD', 'FAIR') NOT NULL DEFAULT 'EXCELLENT',
    location VARCHAR(100) NOT NULL DEFAULT 'London, UK',
    tags VARCHAR(255) DEFAULT NULL,
    status ENUM('PENDING', 'ACTIVE', 'SOLD', 'REMOVED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_products_seller (seller_id),
    INDEX idx_products_category (category_id),
    INDEX idx_products_status (status),
    INDEX idx_products_created (created_at),
    FULLTEXT INDEX idx_products_fulltext (title, description, brand, model, tags)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 4. PRODUCT IMAGES TABLE
-- -----------------------------------------------------------------------
CREATE TABLE product_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_prod_images (product_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 5. AUCTIONS TABLE
-- -----------------------------------------------------------------------
CREATE TABLE auctions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_id BIGINT NOT NULL UNIQUE,
    seller_id BIGINT NOT NULL,
    starting_price DECIMAL(12, 2) NOT NULL,
    reserve_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    current_price DECIMAL(12, 2) NOT NULL,
    bid_increment DECIMAL(10, 2) NOT NULL DEFAULT 50.00,
    buy_now_price DECIMAL(12, 2) DEFAULT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    current_winner_id BIGINT DEFAULT NULL,
    total_bids INT DEFAULT 0,
    status ENUM('DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'SOLD', 'UNSOLD', 'CANCELLED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (current_winner_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_auction_status (status),
    INDEX idx_auction_end_time (end_time),
    INDEX idx_auction_seller (seller_id),
    INDEX idx_auction_current_price (current_price),
    INDEX idx_auction_active_expiry (status, end_time)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 6. BIDS TABLE (Anti-tamper & Permanent ledger)
-- -----------------------------------------------------------------------
CREATE TABLE bids (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    auction_id BIGINT NOT NULL,
    bidder_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE CASCADE,
    FOREIGN KEY (bidder_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_bids_auction (auction_id, created_at DESC),
    INDEX idx_bids_bidder (bidder_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 7. WATCHLIST TABLE
-- -----------------------------------------------------------------------
CREATE TABLE watchlist (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_user_product (user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_watchlist_user (user_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 8. ORDERS TABLE (Post-Auction / Buy-Now transactions)
-- -----------------------------------------------------------------------
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    auction_id BIGINT DEFAULT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    seller_amount DECIMAL(12, 2) NOT NULL,
    shipping_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'ESCROW_VAULT',
    payment_status ENUM('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    order_status ENUM('PROCESSING', 'AUTHENTICATED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PROCESSING',
    shipping_address TEXT NOT NULL,
    tracking_number VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    FOREIGN KEY (auction_id) REFERENCES auctions(id) ON DELETE SET NULL,
    INDEX idx_orders_buyer (buyer_id),
    INDEX idx_orders_seller (seller_id),
    INDEX idx_orders_status (order_status)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 9. NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    related_product_id BIGINT DEFAULT NULL,
    related_auction_id BIGINT DEFAULT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (related_product_id) REFERENCES products(id) ON DELETE SET NULL,
    FOREIGN KEY (related_auction_id) REFERENCES auctions(id) ON DELETE SET NULL,
    INDEX idx_notifications_user_read (user_id, is_read)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 10. REVIEWS TABLE
-- -----------------------------------------------------------------------
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reviewer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    order_id BIGINT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_reviews_seller (seller_id)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------
-- 11. REPORTS TABLE (Moderation)
-- -----------------------------------------------------------------------
CREATE TABLE reports (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    reporter_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    reason VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    status ENUM('PENDING', 'REVIEWED', 'RESOLVED', 'DISMISSED') NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_reports_status (status)
) ENGINE=InnoDB;
