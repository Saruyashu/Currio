USE curio_marketplace;

INSERT INTO users (id, username, email, password_hash, first_name, last_name, role, rating, status) VALUES
(1, 'admin_curio', 'admin@curio.art', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Alistair', 'Vance', 'ADMIN', 5.00, 'ACTIVE'),
(2, 'sarvesh_collector', 'sarvesh@curio.art', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Sarvesh', 'Sawant', 'USER', 4.95, 'ACTIVE'),
(3, 'geneva_horology', 'geneva@swisswatches.com', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Henri', 'Dumond', 'USER', 4.98, 'ACTIVE'),
(4, 'card_connoisseur', 'marcus@cardvault.io', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Marcus', 'Sterling', 'USER', 4.90, 'ACTIVE'),
(5, 'athens_antiquities', 'eleni@athenscoins.gr', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Eleni', 'Papadopoulos', 'USER', 4.97, 'ACTIVE'),
(6, 'brian_bidder', 'brian@investor.com', '$2a$12$e8Y6lYJkP0kO9p3zQp7pueeG4bN6XvA1Pq/uI9vLh4K2Y5Q1K7q6y', 'Brian', 'O\'Connor', 'USER', 4.85, 'ACTIVE');

INSERT INTO categories (id, name, slug, description) VALUES
(1, 'Fine Horology & Watches', 'watches', 'Vintage timepieces, mechanical chronographs, and rare pocket watches.'),
(2, 'Trading Cards & TCG', 'trading-cards', 'Graded Pokémon, Magic The Gathering, and sports rookie cards.'),
(3, 'Ancient Coins & Numismatics', 'coins', 'Classical Greco-Roman coinage, historical bullion, and currency.'),
(4, 'Vintage Optics & Cameras', 'cameras', 'Historic mechanical rangefinders, rare glass lenses, and analog icons.'),
(5, 'Sports Memorabilia', 'sports-memorabilia', 'Game-worn jerseys, signed championship gear, and authentic awards.'),
(6, 'Historical Manuscripts & Art', 'historical-art', 'Rare first-edition folios, illuminated pages, and museum artifacts.');

INSERT INTO products (id, seller_id, category_id, title, description, brand, model, year, item_condition, location, tags, status) VALUES
(1, 3, 1, '1968 Rolex Submariner Ref. 5513 "Meters First"', 'Exceptional condition vintage Rolex Submariner Reference 5513 featuring the celebrated "Meters First" matte dial. Complete with archive extract.', 'Rolex', 'Submariner 5513', 1968, 'EXCELLENT', 'Geneva, Switzerland', 'rolex,submariner,meters-first', 'ACTIVE'),
(2, 4, 2, '1999 Pokémon Base Set 1st Edition Charizard Holo #4/102 PSA Gem Mint 10', 'The holy grail of modern pop culture collectibles. Graded a flawless PSA Gem Mint 10.', 'Wizards of the Coast', 'Base Set 1st Edition #4', 1999, 'MINT', 'New York, USA', 'pokemon,charizard,psa10', 'ACTIVE'),
(3, 5, 3, 'Athens Attica Silver Owl Tetradrachm (c. 454–404 BC)', 'Classical Greek archaic silver Tetradrachm minted during the golden age of Pericles in Athens.', 'Classical Athens', 'Silver Tetradrachm', -440, 'VERY_GOOD', 'Athens, Greece', 'ancient,coin,owl,athens', 'ACTIVE');

INSERT INTO product_images (id, product_id, image_url, is_primary, display_order) VALUES
(1, 1, '/src/assets/images/curio_item_rolex_1791467020069.jpg', TRUE, 1),
(2, 2, '/src/assets/images/curio_item_charizard_1791467039645.jpg', TRUE, 1),
(3, 3, '/src/assets/images/curio_item_coin_1791467051484.jpg', TRUE, 1);

INSERT INTO auctions (id, product_id, seller_id, starting_price, reserve_price, current_price, bid_increment, buy_now_price, start_time, end_time, current_winner_id, total_bids, status) VALUES
(1, 1, 3, 8500.00, 12000.00, 14250.00, 250.00, 18500.00, DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_ADD(NOW(), INTERVAL 3 HOUR), 2, 9, 'ACTIVE'),
(2, 2, 4, 15000.00, 25000.00, 28500.00, 500.00, 36000.00, DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_ADD(NOW(), INTERVAL 14 HOUR), 6, 14, 'ACTIVE'),
(3, 3, 5, 1200.00, 2000.00, 2400.00, 100.00, 3200.00, DATE_SUB(NOW(), INTERVAL 1 DAY), DATE_ADD(NOW(), INTERVAL 1 DAY), 2, 6, 'ACTIVE');

INSERT INTO bids (id, auction_id, bidder_id, amount, created_at) VALUES
(1, 1, 6, 8500.00, DATE_SUB(NOW(), INTERVAL 40 HOUR)),
(2, 1, 2, 9500.00, DATE_SUB(NOW(), INTERVAL 36 HOUR)),
(3, 1, 6, 11000.00, DATE_SUB(NOW(), INTERVAL 28 HOUR)),
(4, 1, 2, 12500.00, DATE_SUB(NOW(), INTERVAL 22 HOUR)),
(5, 1, 6, 13500.00, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
(6, 1, 2, 14250.00, DATE_SUB(NOW(), INTERVAL 45 MINUTE));
