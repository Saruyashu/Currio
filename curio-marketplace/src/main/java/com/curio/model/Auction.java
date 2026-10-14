package com.curio.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

public class Auction implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long productId;
    private Long sellerId;
    private BigDecimal startingPrice;
    private BigDecimal reservePrice;
    private BigDecimal currentPrice;
    private BigDecimal bidIncrement;
    private BigDecimal buyNowPrice;
    private Timestamp startTime;
    private Timestamp endTime;
    private Long currentWinnerId;
    private Integer totalBids;
    private String status; // DRAFT, SCHEDULED, ACTIVE, ENDED, SOLD, UNSOLD, CANCELLED
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Joined Product / User details for direct display
    private Product product;
    private String currentWinnerUsername;
    private String sellerUsername;
    private BigDecimal sellerRating;

    public Auction() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public BigDecimal getStartingPrice() { return startingPrice; }
    public void setStartingPrice(BigDecimal startingPrice) { this.startingPrice = startingPrice; }

    public BigDecimal getReservePrice() { return reservePrice; }
    public void setReservePrice(BigDecimal reservePrice) { this.reservePrice = reservePrice; }

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getBidIncrement() { return bidIncrement; }
    public void setBidIncrement(BigDecimal bidIncrement) { this.bidIncrement = bidIncrement; }

    public BigDecimal getBuyNowPrice() { return buyNowPrice; }
    public void setBuyNowPrice(BigDecimal buyNowPrice) { this.buyNowPrice = buyNowPrice; }

    public Timestamp getStartTime() { return startTime; }
    public void setStartTime(Timestamp startTime) { this.startTime = startTime; }

    public Timestamp getEndTime() { return endTime; }
    public void setEndTime(Timestamp endTime) { this.endTime = endTime; }

    public Long getCurrentWinnerId() { return currentWinnerId; }
    public void setCurrentWinnerId(Long currentWinnerId) { this.currentWinnerId = currentWinnerId; }

    public Integer getTotalBids() { return totalBids != null ? totalBids : 0; }
    public void setTotalBids(Integer totalBids) { this.totalBids = totalBids; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public String getCurrentWinnerUsername() { return currentWinnerUsername; }
    public void setCurrentWinnerUsername(String currentWinnerUsername) { this.currentWinnerUsername = currentWinnerUsername; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }

    public BigDecimal getSellerRating() { return sellerRating; }
    public void setSellerRating(BigDecimal sellerRating) { this.sellerRating = sellerRating; }

    public BigDecimal getMinimumNextBid() {
        if (currentPrice == null) return startingPrice;
        if (totalBids != null && totalBids > 0) {
            BigDecimal inc = (bidIncrement != null) ? bidIncrement : new BigDecimal("50.00");
            return currentPrice.add(inc);
        }
        return startingPrice;
    }

    public boolean isReserveMet() {
        if (reservePrice == null || reservePrice.compareTo(BigDecimal.ZERO) == 0) {
            return true;
        }
        return currentPrice != null && currentPrice.compareTo(reservePrice) >= 0;
    }
}
