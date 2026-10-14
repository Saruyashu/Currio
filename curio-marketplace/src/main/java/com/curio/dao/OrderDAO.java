package com.curio.dao;

import com.curio.model.Order;
import com.curio.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class OrderDAO {

    public Long createOrder(Connection conn, Order order) throws SQLException {
        String sql = "INSERT INTO orders (order_number, buyer_id, seller_id, product_id, auction_id, " +
                     "amount, platform_fee, seller_amount, shipping_fee, payment_method, payment_status, " +
                     "order_status, shipping_address, tracking_number) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setString(1, order.getOrderNumber());
            stmt.setLong(2, order.getBuyerId());
            stmt.setLong(3, order.getSellerId());
            stmt.setLong(4, order.getProductId());
            if (order.getAuctionId() != null) stmt.setLong(5, order.getAuctionId()); else stmt.setNull(5, Types.BIGINT);
            stmt.setBigDecimal(6, order.getAmount());
            stmt.setBigDecimal(7, order.getPlatformFee());
            stmt.setBigDecimal(8, order.getSellerAmount());
            stmt.setBigDecimal(9, order.getShippingFee() != null ? order.getShippingFee() : BigDecimal.ZERO);
            stmt.setString(10, order.getPaymentMethod() != null ? order.getPaymentMethod() : "ESCROW_VAULT");
            stmt.setString(11, order.getPaymentStatus() != null ? order.getPaymentStatus() : "PENDING");
            stmt.setString(12, order.getOrderStatus() != null ? order.getOrderStatus() : "PROCESSING");
            stmt.setString(13, order.getShippingAddress() != null ? order.getShippingAddress() : "Standard Collector Vault Delivery");
            stmt.setString(14, order.getTrackingNumber());

            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getLong(1);
                }
            }
        }
        return null;
    }

    public List<Order> findByBuyerId(Long buyerId) throws SQLException {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, p.title as product_title, u.username as seller_username " +
                     "FROM orders o " +
                     "JOIN products p ON o.product_id = p.id " +
                     "JOIN users u ON o.seller_id = u.id " +
                     "WHERE o.buyer_id = ? ORDER BY o.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, buyerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public List<Order> findBySellerId(Long sellerId) throws SQLException {
        List<Order> list = new ArrayList<>();
        String sql = "SELECT o.*, p.title as product_title, u.username as buyer_username " +
                     "FROM orders o " +
                     "JOIN products p ON o.product_id = p.id " +
                     "JOIN users u ON o.buyer_id = u.id " +
                     "WHERE o.seller_id = ? ORDER BY o.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, sellerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        }
        return list;
    }

    public BigDecimal getTotalSalesVolume() throws SQLException {
        String sql = "SELECT COALESCE(SUM(amount), 0) FROM orders WHERE payment_status = 'SUCCESS'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return rs.getBigDecimal(1);
            }
        }
        return BigDecimal.ZERO;
    }

    public BigDecimal getTotalPlatformRevenue() throws SQLException {
        String sql = "SELECT COALESCE(SUM(platform_fee), 0) FROM orders WHERE payment_status = 'SUCCESS'";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            if (rs.next()) {
                return rs.getBigDecimal(1);
            }
        }
        return BigDecimal.ZERO;
    }

    private Order mapRow(ResultSet rs) throws SQLException {
        Order o = new Order();
        o.setId(rs.getLong("id"));
        o.setOrderNumber(rs.getString("order_number"));
        o.setBuyerId(rs.getLong("buyer_id"));
        o.setSellerId(rs.getLong("seller_id"));
        o.setProductId(rs.getLong("product_id"));
        long aid = rs.getLong("auction_id");
        if (!rs.wasNull()) o.setAuctionId(aid);
        o.setAmount(rs.getBigDecimal("amount"));
        o.setPlatformFee(rs.getBigDecimal("platform_fee"));
        o.setSellerAmount(rs.getBigDecimal("seller_amount"));
        o.setShippingFee(rs.getBigDecimal("shipping_fee"));
        o.setPaymentMethod(rs.getString("payment_method"));
        o.setPaymentStatus(rs.getString("payment_status"));
        o.setOrderStatus(rs.getString("order_status"));
        o.setShippingAddress(rs.getString("shipping_address"));
        o.setTrackingNumber(rs.getString("tracking_number"));
        o.setCreatedAt(rs.getTimestamp("created_at"));
        o.setUpdatedAt(rs.getTimestamp("updated_at"));
        try {
            o.setProductTitle(rs.getString("product_title"));
            o.setSellerUsername(rs.getString("seller_username"));
            o.setBuyerUsername(rs.getString("buyer_username"));
        } catch (SQLException ignored) {}
        return o;
    }
}
