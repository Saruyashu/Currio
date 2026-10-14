package com.curio.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

public class Bid implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long auctionId;
    private Long bidderId;
    private BigDecimal amount;
    private Timestamp createdAt;

    // Display fields
    private String bidderUsername;
    private String maskedUsername;

    public Bid() {}

    public Bid(Long id, Long auctionId, Long bidderId, BigDecimal amount, Timestamp createdAt) {
        this.id = id;
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.amount = amount;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public Long getBidderId() { return bidderId; }
    public void setBidderId(Long bidderId) { this.bidderId = bidderId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public String getBidderUsername() { return bidderUsername; }
    public void setBidderUsername(String bidderUsername) {
        this.bidderUsername = bidderUsername;
        if (bidderUsername != null && bidderUsername.length() > 3) {
            this.maskedUsername = bidderUsername.charAt(0) + "***" + bidderUsername.charAt(bidderUsername.length() - 1);
        } else {
            this.maskedUsername = "Collector***";
        }
    }

    public String getMaskedUsername() {
        if (maskedUsername == null && bidderUsername != null) {
            setBidderUsername(bidderUsername);
        }
        return maskedUsername != null ? maskedUsername : "Collector***";
    }

    public void setMaskedUsername(String maskedUsername) {
        this.maskedUsername = maskedUsername;
    }
}
