package com.curio.dao;

import com.curio.model.Auction;
import com.curio.model.Product;
import com.curio.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AuctionDAO {

    /**
     * Finds auction by ID with standard read.
     */
    public Auction findById(Long id) throws SQLException {
        try (Connection conn = DBConnection.getConnection()) {
            return findById(conn, id);
        }
    }

    public Auction findById(Connection conn, Long id) throws SQLException {
        String sql = "SELECT a.*, " +
                     "p.title, p.description, p.brand, p.model, p.year, p.item_condition, p.location, p.tags, p.category_id, " +
                     "u.username as seller_username, u.rating as seller_rating, " +
                     "w.username as winner_username, c.name as category_name " +
                     "FROM auctions a " +
                     "JOIN products p ON a.product_id = p.id " +
                     "JOIN users u ON a.seller_id = u.id " +
                     "LEFT JOIN users w ON a.current_winner_id = w.id " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE a.id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Auction a = mapRow(rs);
                    ProductDAO pdao = new ProductDAO();
                    a.getProduct().setImageUrls(pdao.findImagesByProductId(conn, a.getProductId()));
                    if (!a.getProduct().getImageUrls().isEmpty()) {
                        a.getProduct().setPrimaryImageUrl(a.getProduct().getImageUrls().get(0));
                    }
                    return a;
                }
            }
        }
        return null;
    }

    /**
     * CRITICAL ANTI-RACE CONDITION LOCK:
     * Obtains an exclusive write lock (SELECT ... FOR UPDATE) on the auction row
     * inside the calling transaction to prevent concurrent bid collision.
     */
    public Auction findByIdForUpdate(Connection conn, Long id) throws SQLException {
        String sql = "SELECT a.*, " +
                     "p.title, p.description, p.brand, p.model, p.year, p.item_condition, p.location, p.tags, p.category_id, " +
                     "u.username as seller_username, u.rating as seller_rating, " +
                     "w.username as winner_username, c.name as category_name " +
                     "FROM auctions a " +
                     "JOIN products p ON a.product_id = p.id " +
                     "JOIN users u ON a.seller_id = u.id " +
                     "LEFT JOIN users w ON a.current_winner_id = w.id " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE a.id = ? FOR UPDATE";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        }
        return null;
    }

    public Long create(Connection conn, Auction auction) throws SQLException {
        String sql = "INSERT INTO auctions (product_id, seller_id, starting_price, reserve_price, current_price, " +
                     "bid_increment, buy_now_price, start_time, end_time, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, auction.getProductId());
            stmt.setLong(2, auction.getSellerId());
            stmt.setBigDecimal(3, auction.getStartingPrice());
            stmt.setBigDecimal(4, auction.getReservePrice() != null ? auction.getReservePrice() : BigDecimal.ZERO);
            stmt.setBigDecimal(5, auction.getStartingPrice());
            stmt.setBigDecimal(6, auction.getBidIncrement() != null ? auction.getBidIncrement() : new BigDecimal("50.00"));
            if (auction.getBuyNowPrice() != null) {
                stmt.setBigDecimal(7, auction.getBuyNowPrice());
            } else {
                stmt.setNull(7, Types.DECIMAL);
            }
            stmt.setTimestamp(8, auction.getStartTime());
            stmt.setTimestamp(9, auction.getEndTime());
            stmt.setString(10, auction.getStatus() != null ? auction.getStatus() : "ACTIVE");

            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getLong(1);
                }
            }
        }
        return null;
    }

    public void updateCurrentBid(Connection conn, Long auctionId, BigDecimal newPrice, Long winnerId) throws SQLException {
        String sql = "UPDATE auctions SET current_price = ?, current_winner_id = ?, total_bids = total_bids + 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setBigDecimal(1, newPrice);
            stmt.setLong(2, winnerId);
            stmt.setLong(3, auctionId);
            stmt.executeUpdate();
        }
    }

    public void updateStatusAndWinner(Connection conn, Long auctionId, String status, Long winnerId) throws SQLException {
        String sql = "UPDATE auctions SET status = ?, current_winner_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            if (winnerId != null) {
                stmt.setLong(2, winnerId);
            } else {
                stmt.setNull(2, Types.BIGINT);
            }
            stmt.setLong(3, auctionId);
            stmt.executeUpdate();
        }
    }

    public List<Auction> findActiveAuctions(String search, Integer categoryId, String condition,
                                           BigDecimal minPrice, BigDecimal maxPrice, String sort,
                                           int offset, int limit) throws SQLException {
        List<Auction> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(
            "SELECT a.*, " +
            "p.title, p.description, p.brand, p.model, p.year, p.item_condition, p.location, p.tags, p.category_id, " +
            "u.username as seller_username, u.rating as seller_rating, " +
            "w.username as winner_username, c.name as category_name " +
            "FROM auctions a " +
            "JOIN products p ON a.product_id = p.id " +
            "JOIN users u ON a.seller_id = u.id " +
            "LEFT JOIN users w ON a.current_winner_id = w.id " +
            "JOIN categories c ON p.category_id = c.id " +
            "WHERE a.status = 'ACTIVE' "
        );

        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            sql.append("AND (p.title LIKE ? OR p.description LIKE ? OR p.brand LIKE ? OR p.tags LIKE ?) ");
            String term = "%" + search.trim() + "%";
            params.add(term);
            params.add(term);
            params.add(term);
            params.add(term);
        }

        if (categoryId != null && categoryId > 0) {
            sql.append("AND p.category_id = ? ");
            params.add(categoryId);
        }

        if (condition != null && !condition.trim().isEmpty() && !condition.equalsIgnoreCase("ALL")) {
            sql.append("AND p.item_condition = ? ");
            params.add(condition.trim());
        }

        if (minPrice != null) {
            sql.append("AND a.current_price >= ? ");
            params.add(minPrice);
        }

        if (maxPrice != null) {
            sql.append("AND a.current_price <= ? ");
            params.add(maxPrice);
        }

        // Sorting
        if ("ending_soon".equalsIgnoreCase(sort)) {
            sql.append("ORDER BY a.end_time ASC ");
        } else if ("newest".equalsIgnoreCase(sort)) {
            sql.append("ORDER BY a.created_at DESC ");
        } else if ("most_bids".equalsIgnoreCase(sort)) {
            sql.append("ORDER BY a.total_bids DESC ");
        } else if ("price_high".equalsIgnoreCase(sort)) {
            sql.append("ORDER BY a.current_price DESC ");
        } else if ("price_low".equalsIgnoreCase(sort)) {
            sql.append("ORDER BY a.current_price ASC ");
        } else {
            sql.append("ORDER BY a.end_time ASC ");
        }

        sql.append("LIMIT ? OFFSET ?");
        params.add(limit);
        params.add(offset);

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql.toString())) {
            for (int i = 0; i < params.size(); i++) {
                stmt.setObject(i + 1, params.get(i));
            }
            try (ResultSet rs = stmt.executeQuery()) {
                ProductDAO pdao = new ProductDAO();
                while (rs.next()) {
                    Auction a = mapRow(rs);
                    a.getProduct().setImageUrls(pdao.findImagesByProductId(conn, a.getProductId()));
                    if (!a.getProduct().getImageUrls().isEmpty()) {
                        a.getProduct().setPrimaryImageUrl(a.getProduct().getImageUrls().get(0));
                    }
                    list.add(a);
                }
            }
        }
        return list;
    }

    public List<Auction> findExpiredActiveAuctions(Connection conn) throws SQLException {
        List<Auction> list = new ArrayList<>();
        String sql = "SELECT id, product_id, seller_id, reserve_price, current_price, current_winner_id, total_bids " +
                     "FROM auctions WHERE status = 'ACTIVE' AND end_time <= CURRENT_TIMESTAMP";
        try (PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Auction a = new Auction();
                a.setId(rs.getLong("id"));
                a.setProductId(rs.getLong("product_id"));
                a.setSellerId(rs.getLong("seller_id"));
                a.setReservePrice(rs.getBigDecimal("reserve_price"));
                a.setCurrentPrice(rs.getBigDecimal("current_price"));
                long winId = rs.getLong("current_winner_id");
                if (!rs.wasNull()) a.setCurrentWinnerId(winId);
                a.setTotalBids(rs.getInt("total_bids"));
                list.add(a);
            }
        }
        return list;
    }

    private Auction mapRow(ResultSet rs) throws SQLException {
        Auction a = new Auction();
        a.setId(rs.getLong("id"));
        a.setProductId(rs.getLong("product_id"));
        a.setSellerId(rs.getLong("seller_id"));
        a.setStartingPrice(rs.getBigDecimal("starting_price"));
        a.setReservePrice(rs.getBigDecimal("reserve_price"));
        a.setCurrentPrice(rs.getBigDecimal("current_price"));
        a.setBidIncrement(rs.getBigDecimal("bid_increment"));
        a.setBuyNowPrice(rs.getBigDecimal("buy_now_price"));
        a.setStartTime(rs.getTimestamp("start_time"));
        a.setEndTime(rs.getTimestamp("end_time"));
        long winnerId = rs.getLong("current_winner_id");
        if (!rs.wasNull()) a.setCurrentWinnerId(winnerId);
        a.setTotalBids(rs.getInt("total_bids"));
        a.setStatus(rs.getString("status"));
        a.setCreatedAt(rs.getTimestamp("created_at"));
        a.setUpdatedAt(rs.getTimestamp("updated_at"));

        try {
            a.setSellerUsername(rs.getString("seller_username"));
            a.setSellerRating(rs.getBigDecimal("seller_rating"));
            a.setCurrentWinnerUsername(rs.getString("winner_username"));

            Product p = new Product();
            p.setId(a.getProductId());
            p.setSellerId(a.getSellerId());
            p.setTitle(rs.getString("title"));
            p.setDescription(rs.getString("description"));
            p.setBrand(rs.getString("brand"));
            p.setModel(rs.getString("model"));
            int yr = rs.getInt("year");
            if (!rs.wasNull()) p.setYear(yr);
            p.setItemCondition(rs.getString("item_condition"));
            p.setLocation(rs.getString("location"));
            p.setTags(rs.getString("tags"));
            p.setCategoryId(rs.getInt("category_id"));
            p.setCategoryName(rs.getString("category_name"));
            a.setProduct(p);
        } catch (SQLException ignored) {}

        return a;
    }
}
