-- =======================================================================
-- CURIO COLLECTIBLE MARKETPLACE - SEED DATA (MySQL 8.0+)
-- Database: curio_marketplace
-- =======================================================================

USE curio_marketplace;

-- -----------------------------------------------------------------------
-- 1. SEED USERS
-- Password for all default accounts is: password123
-- BCrypt Hash: $2a$12$K1rS2Q5uE7vG9wY1X3Z5e.t9B2a4c6e8g0i2k4m6o8q0s2u4w6y8u
-- -----------------------------------------------------------------------
INSERT INTO users (id, username, email, password_hash, first_name, last_name, phone, role, rating, status) VALUES
(1, 'admin_curio', 'admin@curio.art', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Alistair', 'Vance', '+14155550100', 'ADMIN', 5.00, 'ACTIVE'),
(2, 'sarvesh_collector', 'sarvesh@curio.art', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Sarvesh', 'Sawant', '+14155550102', 'USER', 4.95, 'ACTIVE'),
(3, 'geneva_horology', 'geneva@swisswatches.com', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Henri', 'Dumond', '+41228190000', 'USER', 4.98, 'ACTIVE'),
(4, 'card_connoisseur', 'marcus@cardvault.io', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Marcus', 'Sterling', '+13125550144', 'USER', 4.90, 'ACTIVE'),
(5, 'athens_antiquities', 'eleni@athenscoins.gr', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Eleni', 'Papadopoulos', '+302103210000', 'USER', 4.97, 'ACTIVE'),
(6, 'brian_bidder', 'brian@investor.com', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Brian', 'O\'Connor', '+12125550188', 'USER', 4.85, 'ACTIVE');

-- -----------------------------------------------------------------------
-- 2. SEED CATEGORIES
-- -----------------------------------------------------------------------
INSERT INTO categories (id, name, slug, description, parent_id) VALUES
(1, 'Fine Horology & Watches', 'watches', 'Vintage timepieces, mechanical chronographs, and rare pocket watches.', NULL),
(2, 'Trading Cards & TCG', 'trading-cards', 'Graded Pokémon, Magic The Gathering, and sports rookie cards.', NULL),
(3, 'Ancient Coins & Numismatics', 'coins', 'Classical Greco-Roman coinage, historical bullion, and currency.', NULL),
(4, 'Vintage Optics & Cameras', 'cameras', 'Historic mechanical rangefinders, rare glass lenses, and analog icons.', NULL),
(5, 'Sports Memorabilia', 'sports-memorabilia', 'Game-worn jerseys, signed championship gear, and authentic awards.', NULL),
(6, 'Historical Manuscripts & Art', 'historical-art', 'Rare first-edition folios, illuminated pages, and museum artifacts.', NULL);

-- -----------------------------------------------------------------------
-- 3. SEED PRODUCTS
-- -----------------------------------------------------------------------
INSERT INTO products (id, seller_id, category_id, title, description, brand, model, year, item_condition, location, tags, status) VALUES
(1, 3, 1, '1968 Rolex Submariner Ref. 5513 "Meters First"', 'Exceptional condition vintage Rolex Submariner Reference 5513 featuring the celebrated "Meters First" matte dial. Pristine domed acrylic crystal, perfectly aged pumpkin tritium plots, original folded-link Oyster 9315 bracelet. Movement serviced by Geneva specialist in 2024. Complete with archive papers.', 'Rolex', 'Submariner 5513', 1968, 'EXCELLENT', 'Geneva, Switzerland', 'rolex,submariner,meters-first,vintage,horology', 'ACTIVE'),

(2, 4, 2, '1999 Pokémon Base Set 1st Edition Charizard Holo #4/102 PSA Gem Mint 10', 'The holy grail of modern pop culture collectibles. 1999 Wizards of the Coast Base Set 1st Edition Shadowless Charizard holographic card graded a flawless PSA Gem Mint 10. Crystal clear centering, spotless holographic foil field, razor-sharp corners.', 'Wizards of the Coast', 'Base Set 1st Edition #4', 1999, 'MINT', 'New York, USA', 'pokemon,charizard,psa10,1st-edition,tcg,grail', 'ACTIVE'),

(3, 5, 3, 'Athens Attica Silver Owl Tetradrachm (c. 454–404 BC)', 'Classical Greek archaic silver Tetradrachm minted during the golden age of Pericles in Athens. Obverse exhibits the helmeted head of Athena with crest; reverse features the iconic sacred Owl of Athena standing right with olive sprig, crescent moon, and clear "AΘE" ethnic inscription. High-relief strike on full flan.', 'Classical Athens', 'Silver Tetradrachm', -440, 'VERY_GOOD', 'Athens, Greece', 'ancient,coin,owl,athens,greece,silver', 'ACTIVE'),

(4, 3, 4, '1957 Leica M3 Double-Stroke Rangefinder with 50mm Summicron f/2', 'Early double-stroke serial 881xxx Leica M3 rangefinder camera paired with rigid chrome collapsible Summicron 50mm f/2 lens. Vulcanite skin 100% intact with zero chipping. Rangefinder prism clean, contrasty, and calibrated. Includes original leather strap and Leitz metal cap.', 'Leica', 'M3 Double Stroke', 1957, 'EXCELLENT', 'Munich, Germany', 'leica,m3,summicron,rangefinder,analog,vintage', 'ACTIVE'),

(5, 4, 5, '1986 Fleer Michael Jordan #57 Rookie Card BGS 9.5 Gem Mint', 'Iconic basketball rookie card of Michael Jordan from the 1986-87 Fleer premier set. Graded BGS 9.5 Gem Mint with subgrades: Centering 9.5, Edges 9.5, Corners 9.0, Surface 10. True centerpiece for basketball historians.', 'Fleer', 'Premier #57', 1986, 'MINT', 'Chicago, USA', 'jordan,nba,fleer,rookie,bgs,basketball', 'ACTIVE'),

(6, 5, 3, '1794 Flowing Hair Silver Dollar - NGC Fine Details', 'First dollar coin issued by the United States Federal Government. Flowing Hair design engraved by Robert Scot. Distinctive Liberty head with cascading locks, eagle with wreath on reverse. Extremely rare surviving national treasure.', 'US Mint', 'Flowing Hair Dollar', 1794, 'GOOD', 'Philadelphia, USA', 'us-mint,1794,dollar,flowing-hair,silver,rare', 'ACTIVE');

-- -----------------------------------------------------------------------
-- 4. SEED PRODUCT IMAGES
-- -----------------------------------------------------------------------
INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES
(1, 1, '/src/assets/images/curio_item_rolex_1791467020069.jpg', TRUE, 1),
(2, 2, '/src/assets/images/curio_item_charizard_1791467039645.jpg', TRUE, 1),
(3, 3, '/src/assets/images/curio_item_coin_1791467051484.jpg', TRUE, 1),
(4, 4, '/src/assets/images/curio_item_camera_1791467068473.jpg', TRUE, 1),
(5, 5, '/src/assets/images/curio_item_charizard_1791467039645.jpg', TRUE, 1),
(6, 6, '/src/assets/images/curio_item_coin_1791467051484.jpg', TRUE, 1);

-- -----------------------------------------------------------------------
-- 5. SEED AUCTIONS
-- -----------------------------------------------------------------------
INSERT INTO auctions (id, product_id, seller_id, starting_price, reserve_price, current_price, bid_increment, buy_now_price, start_time, end_time, current_winner_id, total_bids, status) VALUES
(1, 1, 3, 8500.00, 12000.00, 14250.00, 250.00, 18500.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 3 HOUR), 2, 9, 'ACTIVE'),
(2, 2, 4, 15000.00, 25000.00, 28500.00, 500.00, 36000.00, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 14 HOUR), 6, 14, 'ACTIVE'),
(3, 3, 5, 1200.00, 2000.00, 2400.00, 100.00, 3200.00, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY), 2, 6, 'ACTIVE'),
(4, 4, 3, 1800.00, 2200.00, 2650.00, 50.00, 3100.00, DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_ADD(NOW(), INTERVAL 2 DAY), 6, 8, 'ACTIVE'),
(5, 5, 4, 20000.00, 35000.00, 20000.00, 1000.00, 48000.00, DATE_SUB(NOW(), INTERVAL 6 HOUR), DATE_ADD(NOW(), INTERVAL 3 DAY), NULL, 0, 'ACTIVE'),
(6, 6, 5, 45000.00, 60000.00, 52000.00, 2000.00, NULL, DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_ADD(NOW(), INTERVAL 4 DAY), 2, 4, 'ACTIVE');

-- -----------------------------------------------------------------------
-- 6. SEED BIDS (Transparent Audit Ledger)
-- -----------------------------------------------------------------------
INSERT INTO bids (id, auction_id, bidder_id, amount, created_at) VALUES
-- Auction 1 (Rolex)
(1, 1, 6, 8500.00, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(2, 1, 2, 9000.00, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(3, 1, 6, 10500.00, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(4, 1, 2, 11500.00, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(5, 1, 6, 12500.00, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(6, 1, 2, 13000.00, DATE_SUB(NOW(), INTERVAL 10 HOUR)),
(7, 1, 6, 13750.00, DATE_SUB(NOW(), INTERVAL 5 HOUR)),
(8, 1, 2, 14250.00, DATE_SUB(NOW(), INTERVAL 45 MINUTE)),

-- Auction 2 (Charizard)
(9, 2, 2, 15000.00, DATE_SUB(NOW(), INTERVAL 70 HOUR)),
(10, 2, 6, 18000.00, DATE_SUB(NOW(), INTERVAL 55 HOUR)),
(11, 2, 2, 22000.00, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(12, 2, 6, 26000.00, DATE_SUB(NOW(), INTERVAL 24 HOUR)),
(13, 2, 2, 27500.00, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
(14, 2, 6, 28500.00, DATE_SUB(NOW(), INTERVAL 2 HOUR)),

-- Auction 3 (Athena Coin)
(15, 3, 6, 1200.00, DATE_SUB(NOW(), INTERVAL 20 HOUR)),
(16, 3, 2, 1500.00, DATE_SUB(NOW(), INTERVAL 15 HOUR)),
(17, 3, 6, 2000.00, DATE_SUB(NOW(), INTERVAL 8 HOUR)),
(18, 3, 2, 2400.00, DATE_SUB(NOW(), INTERVAL 3 HOUR));

-- -----------------------------------------------------------------------
-- 7. SEED WATCHLIST
-- -----------------------------------------------------------------------
INSERT INTO watchlist (user_id, product_id) VALUES
(2, 1),
(2, 2),
(2, 4),
(6, 1),
(6, 3);

-- -----------------------------------------------------------------------
-- 8. SEED ORDERS (Completed Historical Transactions)
-- -----------------------------------------------------------------------
INSERT INTO orders (id, order_number, buyer_id, seller_id, product_id, auction_id, amount, platform_fee, seller_amount, shipping_fee, payment_method, payment_status, order_status, shipping_address, tracking_number) VALUES
(1, 'CURIO-ORD-2026-9021', 2, 3, 4, 4, 2650.00, 132.50, 2517.50, 45.00, 'ESCROW_VAULT', 'SUCCESS', 'DELIVERED', '742 Evergreen Terrace, Springfield, IL 62704', 'FEDEX-EX-99281726');

-- -----------------------------------------------------------------------
-- 9. SEED NOTIFICATIONS
-- -----------------------------------------------------------------------
INSERT INTO notifications (user_id, type, title, message, related_product_id, related_auction_id, is_read) VALUES
(2, 'OUTBID', 'You were outbid on Charizard PSA 10', 'Another collector placed a higher bid of $28,500. Place a counter-bid to reclaim leading position.', 2, 2, FALSE),
(2, 'HIGHEST_BIDDER', 'You are currently leading the 1968 Rolex Submariner', 'Your bid of $14,250 is the highest valid bid. Auction ends in under 3 hours.', 1, 1, FALSE),
(2, 'ORDER_DELIVERED', 'Order Delivered: 1957 Leica M3', 'Your insured collector package has been delivered and signed for. Inspection window is 48 hours.', 4, 4, TRUE);

-- -----------------------------------------------------------------------
-- 10. SEED REVIEWS
-- -----------------------------------------------------------------------
INSERT INTO reviews (reviewer_id, seller_id, order_id, rating, comment) VALUES
(2, 3, 1, 5, 'Impeccable packaging and fast armored courier shipment. The Leica M3 mechanics are like brand new. Highest recommendation for Henri!');
