package com.curio.dao;

import com.curio.model.Bid;
import com.curio.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class BidDAO {

    public Long insertBid(Connection conn, Bid bid) throws SQLException {
        String sql = "INSERT INTO bids (auction_id, bidder_id, amount) VALUES (?, ?, ?)";
        try (PreparedStatement stmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {
            stmt.setLong(1, bid.getAuctionId());
            stmt.setLong(2, bid.getBidderId());
            stmt.setBigDecimal(3, bid.getAmount());
            stmt.executeUpdate();

            try (ResultSet keys = stmt.getGeneratedKeys()) {
                if (keys.next()) {
                    return keys.getLong(1);
                }
            }
        }
        return null;
    }

    public List<Bid> getBidsByAuctionId(Long auctionId) throws SQLException {
        List<Bid> bids = new ArrayList<>();
        String sql = "SELECT b.*, u.username as bidder_username " +
                     "FROM bids b " +
                     "JOIN users u ON b.bidder_id = u.id " +
                     "WHERE b.auction_id = ? " +
                     "ORDER BY b.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, auctionId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Bid b = new Bid();
                    b.setId(rs.getLong("id"));
                    b.setAuctionId(rs.getLong("auction_id"));
                    b.setBidderId(rs.getLong("bidder_id"));
                    b.setAmount(rs.getBigDecimal("amount"));
                    b.setCreatedAt(rs.getTimestamp("created_at"));
                    b.setBidderUsername(rs.getString("bidder_username"));
                    bids.add(b);
                }
            }
        }
        return bids;
    }

    public List<Bid> getUserBids(Long userId) throws SQLException {
        List<Bid> bids = new ArrayList<>();
        String sql = "SELECT b.*, u.username as bidder_username " +
                     "FROM bids b " +
                     "JOIN users u ON b.bidder_id = u.id " +
                     "WHERE b.bidder_id = ? " +
                     "ORDER BY b.created_at DESC";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setLong(1, userId);
            try (ResultSet rs = stmt.executeQuery()) {
                while (rs.next()) {
                    Bid b = new Bid();
                    b.setId(rs.getLong("id"));
                    b.setAuctionId(rs.getLong("auction_id"));
                    b.setBidderId(rs.getLong("bidder_id"));
                    b.setAmount(rs.getBigDecimal("amount"));
                    b.setCreatedAt(rs.getTimestamp("created_at"));
                    b.setBidderUsername(rs.getString("bidder_username"));
                    bids.add(b);
                }
            }
        }
        return bids;
    }
}
