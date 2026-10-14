package com.curio.dao;

import com.curio.model.Product;
import com.curio.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ProductDAO {

    public Product findById(Long id) throws SQLException {
        String sql = "SELECT p.*, u.username as seller_username, c.name as category_name " +
                     "FROM products p " +
                     "JOIN users u ON p.seller_id = u.id " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, id);
            try (ResultSet rs = stmt.executeQuery()) {
                if (rs.next()) {
                    Product p = mapRow(rs);
                    p.setImageUrls(findImagesByProductId(conn, p.getId()));
                    if (!p.getImageUrls().isEmpty()) {
                        p.setPrimaryImageUrl(p.getImageUrls().get(0));
                    }
                    return p;
                }
            }
        }
        return null;
    }

    public Long create(Connection conn, Product product) throws SQLException {
        String sql = "INSERT INTO products (seller_id, category_id, title, description, brand, model, year, item_condition, location, tags, status) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, product.getSellerId());
            stmt.setInt(2, product.getCategoryId());
            stmt.setString(3, product.getTitle());
            stmt.setString(4, product.getDescription());
            stmt.setString(5, product.getBrand());
            stmt.setString(6, product.getModel());
            if (product.getYear() != null) stmt.setInt(7, product.getYear()); else stmt.setNull(7, Types.INTEGER);
            stmt.setString(8, product.getItemCondition());
            stmt.setString(9, product.getLocation() != null ? product.getLocation() : "London, UK");
            stmt.setString(10, product.getTags());
            stmt.setString(11, product.getStatus() != null ? product.getStatus() : "ACTIVE");

            stmt.executeUpdate();
            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getLong(1);
                }
            }
        }
        return null;
    }

    public void addImage(Connection conn, Long productId, String imageUrl, boolean isPrimary, int order) throws SQLException {
        String sql = "INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES (?, ?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, productId);
            stmt.setString(2, imageUrl);
            stmt.setBoolean(3, isPrimary);
            stmt.setInt(4, order);
            stmt.executeUpdate();
        }
    }

    public List<String> findImagesByProductId(Connection conn, Long productId) throws SQLException {
        List<String> list = new ArrayList<>();
        String sql = "SELECT image_url FROM product_images WHERE product_id = ? ORDER BY is_primary DESC, display_order ASC";
        try (PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, productId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    list.add(rs.getString("image_url"));
                }
            }
        }
        return list;
    }

    public List<Product> findBySellerId(Long sellerId) throws SQLException {
        List<Product> products = new ArrayList<>();
        String sql = "SELECT p.*, u.username as seller_username, c.name as category_name " +
                     "FROM products p " +
                     "JOIN users u ON p.seller_id = u.id " +
                     "JOIN categories c ON p.category_id = c.id " +
                     "WHERE p.seller_id = ? ORDER BY p.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, sellerId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Product p = mapRow(rs);
                    p.setImageUrls(findImagesByProductId(conn, p.getId()));
                    if (!p.getImageUrls().isEmpty()) {
                        p.setPrimaryImageUrl(p.getImageUrls().get(0));
                    }
                    products.add(p);
                }
            }
        }
        return products;
    }

    public boolean updateStatus(Long productId, String status) throws SQLException {
        String sql = "UPDATE products SET status = ? WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, status);
            stmt.setLong(2, productId);
            return stmt.executeUpdate() > 0;
        }
    }

    private Product mapRow(ResultSet rs) throws SQLException {
        Product p = new Product();
        p.setId(rs.getLong("id"));
        p.setSellerId(rs.getLong("seller_id"));
        p.setCategoryId(rs.getInt("category_id"));
        p.setTitle(rs.getString("title"));
        p.setDescription(rs.getString("description"));
        p.setBrand(rs.getString("brand"));
        p.setModel(rs.getString("model"));
        int year = rs.getInt("year");
        if (!rs.wasNull()) p.setYear(year);
        p.setItemCondition(rs.getString("item_condition"));
        p.setLocation(rs.getString("location"));
        p.setTags(rs.getString("tags"));
        p.setStatus(rs.getString("status"));
        p.setCreatedAt(rs.getTimestamp("created_at"));
        p.setUpdatedAt(rs.getTimestamp("updated_at"));
        try {
            p.setSellerUsername(rs.getString("seller_username"));
            p.setCategoryName(rs.getString("category_name"));
        } catch (SQLException ignored) {}
        return p;
    }
}
