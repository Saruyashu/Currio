package com.curio.service;

import com.curio.dao.AuctionDAO;
import com.curio.dao.BidDAO;
import com.curio.dao.OrderDAO;
import com.curio.dao.ProductDAO;
import com.curio.model.Auction;
import com.curio.model.Bid;
import com.curio.model.Order;
import com.curio.model.Product;
import com.curio.util.DBConnection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class AuctionService {
    private static final Logger logger = LoggerFactory.getLogger(AuctionService.class);

    private final AuctionDAO auctionDAO = new AuctionDAO();
    private final BidDAO bidDAO = new BidDAO();
    private final OrderDAO orderDAO = new OrderDAO();
    private final ProductDAO productDAO = new ProductDAO();

    // Background daemon for automatic auction expiration checks
    private static final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public AuctionService() {
        startAuctionCompletionDaemon();
    }

    private void startAuctionCompletionDaemon() {
        scheduler.scheduleAtFixedRate(() -> {
            try {
                processExpiredAuctions();
            } catch (Exception e) {
                logger.error("Error running automatic auction completion daemon: {}", e.getMessage());
            }
        }, 15, 30, TimeUnit.SECONDS);
    }

    /**
     * SAFE ANTI-RACE CONDITION BIDDING ENGINE:
     * - Opens transactional isolation
     * - Obtains SELECT ... FOR UPDATE pessimistic row lock
     * - Validates server-side timestamp & bid increment
     * - Inserts permanent audit bid record
     * - Commits or rolls back on any constraint violation
     */
    public synchronized BidResult placeBid(Long auctionId, Long bidderId, BigDecimal bidAmount) {
        if (auctionId == null || bidderId == null || bidAmount == null) {
            return new BidResult(false, "Invalid bid parameters.", null);
        }

        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false); // Begin Transaction

            // 1. Lock the auction row exclusively
            Auction auction = auctionDAO.findByIdForUpdate(conn, auctionId);
            if (auction == null) {
                conn.rollback();
                return new BidResult(false, "Auction not found.", null);
            }

            // 2. Validate status
            if (!"ACTIVE".equalsIgnoreCase(auction.getStatus())) {
                conn.rollback();
                return new BidResult(false, "Auction is not active (Status: " + auction.getStatus() + ").", null);
            }

            // 3. Authoritative server-side time validation
            Instant now = Instant.now();
            if (now.isAfter(auction.getEndTime().toInstant())) {
                conn.rollback();
                return new BidResult(false, "This auction has already ended.", null);
            }
            if (now.isBefore(auction.getStartTime().toInstant())) {
                conn.rollback();
                return new BidResult(false, "This auction has not started yet.", null);
            }

            // 4. Disallow bidding on own listing
            if (bidderId.equals(auction.getSellerId())) {
                conn.rollback();
                return new BidResult(false, "Sellers cannot place bids on their own items.", null);
            }

            // 5. Enforce minimum bid price with increment
            BigDecimal minRequired;
            if (auction.getTotalBids() == 0) {
                minRequired = auction.getStartingPrice();
            } else {
                BigDecimal increment = auction.getBidIncrement() != null ? auction.getBidIncrement() : new BigDecimal("50.00");
                minRequired = auction.getCurrentPrice().add(increment);
            }

            if (bidAmount.compareTo(minRequired) < 0) {
                conn.rollback();
                return new BidResult(false, "Bid of $" + bidAmount + " is below minimum required bid of $" + minRequired, null);
            }

            // 6. Record immutable bid
            Bid bid = new Bid();
            bid.setAuctionId(auctionId);
            bid.setBidderId(bidderId);
            bid.setAmount(bidAmount);
            Long bidId = bidDAO.insertBid(conn, bid);
            bid.setId(bidId);

            // 7. Update current auction price & highest bidder
            auctionDAO.updateCurrentBid(conn, auctionId, bidAmount, bidderId);

            conn.commit(); // Transaction successful
            return new BidResult(true, "Bid placed successfully! You are now the highest bidder.", bid);

        } catch (SQLException e) {
            logger.error("Transaction error in placeBid: {}", e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            return new BidResult(false, "Database transaction failed: " + e.getMessage(), null);
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }
    }

    /**
     * Executes immediate Buy Now purchase with transactional safety.
     */
    public synchronized Order buyNow(Long auctionId, Long buyerId, String shippingAddress) {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            Auction auction = auctionDAO.findByIdForUpdate(conn, auctionId);
            if (auction == null || !"ACTIVE".equalsIgnoreCase(auction.getStatus()) || auction.getBuyNowPrice() == null) {
                conn.rollback();
                return null;
            }

            if (buyerId.equals(auction.getSellerId())) {
                conn.rollback();
                return null;
            }

            // End auction immediately as SOLD
            auctionDAO.updateStatusAndWinner(conn, auctionId, "SOLD", buyerId);
            productDAO.updateStatus(auction.getProductId(), "SOLD");

            // Calculate platform fee (5%)
            BigDecimal buyPrice = auction.getBuyNowPrice();
            BigDecimal platformFee = buyPrice.multiply(new BigDecimal("0.05")).setScale(2, BigDecimal.ROUND_HALF_UP);
            BigDecimal sellerAmount = buyPrice.subtract(platformFee);

            Order order = new Order();
            order.setOrderNumber("CURIO-BN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            order.setBuyerId(buyerId);
            order.setSellerId(auction.getSellerId());
            order.setProductId(auction.getProductId());
            order.setAuctionId(auctionId);
            order.setAmount(buyPrice);
            order.setPlatformFee(platformFee);
            order.setSellerAmount(sellerAmount);
            order.setShippingFee(new BigDecimal("35.00"));
            order.setPaymentMethod("ESCROW_VAULT");
            order.setPaymentStatus("SUCCESS");
            order.setOrderStatus("PROCESSING");
            order.setShippingAddress(shippingAddress != null ? shippingAddress : "742 Collector Way, Suite 100");
            order.setTrackingNumber("CURIO-EXP-" + System.currentTimeMillis());

            Long orderId = orderDAO.createOrder(conn, order);
            order.setId(orderId);

            conn.commit();
            return order;
        } catch (SQLException e) {
            logger.error("Buy now transaction failed: {}", e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
            return null;
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }
    }

    /**
     * Scheduled Idempotent Auction Finalizer:
     * Discovers all expired active auctions, locks them, verifies reserve price,
     * and automatically transitions them to SOLD or UNSOLD.
     */
    public synchronized void processExpiredAuctions() {
        Connection conn = null;
        try {
            conn = DBConnection.getConnection();
            conn.setAutoCommit(false);

            List<Auction> expiredList = auctionDAO.findExpiredActiveAuctions(conn);
            for (Auction a : expiredList) {
                Auction locked = auctionDAO.findByIdForUpdate(conn, a.getId());
                if (locked == null || !"ACTIVE".equalsIgnoreCase(locked.getStatus())) {
                    continue; // Skip already concluded
                }

                if (locked.getTotalBids() > 0 && locked.getCurrentWinnerId() != null) {
                    boolean reserveMet = locked.getReservePrice() == null ||
                                         locked.getCurrentPrice().compareTo(locked.getReservePrice()) >= 0;

                    if (reserveMet) {
                        auctionDAO.updateStatusAndWinner(conn, locked.getId(), "SOLD", locked.getCurrentWinnerId());
                        productDAO.updateStatus(locked.getProductId(), "SOLD");

                        // Auto-generate order
                        BigDecimal totalAmount = locked.getCurrentPrice();
                        BigDecimal fee = totalAmount.multiply(new BigDecimal("0.05")).setScale(2, BigDecimal.ROUND_HALF_UP);
                        BigDecimal sellerNet = totalAmount.subtract(fee);

                        Order order = new Order();
                        order.setOrderNumber("CURIO-WON-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
                        order.setBuyerId(locked.getCurrentWinnerId());
                        order.setSellerId(locked.getSellerId());
                        order.setProductId(locked.getProductId());
                        order.setAuctionId(locked.getId());
                        order.setAmount(totalAmount);
                        order.setPlatformFee(fee);
                        order.setSellerAmount(sellerNet);
                        order.setShippingFee(new BigDecimal("45.00"));
                        order.setPaymentMethod("ESCROW_VAULT");
                        order.setPaymentStatus("PENDING");
                        order.setOrderStatus("PROCESSING");
                        order.setShippingAddress("Registered Collector Vault Address");
                        orderDAO.createOrder(conn, order);
                    } else {
                        // Reserve not met
                        auctionDAO.updateStatusAndWinner(conn, locked.getId(), "UNSOLD", null);
                    }
                } else {
                    // No bids received
                    auctionDAO.updateStatusAndWinner(conn, locked.getId(), "UNSOLD", null);
                }
            }

            conn.commit();
        } catch (SQLException e) {
            logger.error("Error in processExpiredAuctions: {}", e.getMessage());
            if (conn != null) {
                try { conn.rollback(); } catch (SQLException ignored) {}
            }
        } finally {
            if (conn != null) {
                try { conn.setAutoCommit(true); conn.close(); } catch (SQLException ignored) {}
            }
        }
    }

    public List<Auction> searchAuctions(String search, Integer categoryId, String condition,
                                        BigDecimal minPrice, BigDecimal maxPrice, String sort,
                                        int page, int pageSize) throws SQLException {
        int offset = (page - 1) * pageSize;
        return auctionDAO.findActiveAuctions(search, categoryId, condition, minPrice, maxPrice, sort, offset, pageSize);
    }

    public Auction getAuctionById(Long id) throws SQLException {
        return auctionDAO.findById(id);
    }

    public static class BidResult {
        private final boolean success;
        private final String message;
        private final Bid bid;

        public BidResult(boolean success, String message, Bid bid) {
            this.success = success;
            this.message = message;
            this.bid = bid;
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
        public Bid getBid() { return bid; }
    }
}
