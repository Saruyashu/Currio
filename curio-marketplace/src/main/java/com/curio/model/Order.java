package com.curio.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.sql.Timestamp;

public class Order implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private String orderNumber;
    private Long buyerId;
    private Long sellerId;
    private Long productId;
    private Long auctionId;
    private BigDecimal amount;
    private BigDecimal platformFee;
    private BigDecimal sellerAmount;
    private BigDecimal shippingFee;
    private String paymentMethod;
    private String paymentStatus; // PENDING, SUCCESS, FAILED, REFUNDED
    private String orderStatus; // PROCESSING, AUTHENTICATED, SHIPPED, DELIVERED, COMPLETED, CANCELLED
    private String shippingAddress;
    private String trackingNumber;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Joined fields
    private String productTitle;
    private String productImageUrl;
    private String buyerUsername;
    private String sellerUsername;

    public Order() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }

    public Long getBuyerId() { return buyerId; }
    public void setBuyerId(Long buyerId) { this.buyerId = buyerId; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public Long getAuctionId() { return auctionId; }
    public void setAuctionId(Long auctionId) { this.auctionId = auctionId; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getPlatformFee() { return platformFee; }
    public void setPlatformFee(BigDecimal platformFee) { this.platformFee = platformFee; }

    public BigDecimal getSellerAmount() { return sellerAmount; }
    public void setSellerAmount(BigDecimal sellerAmount) { this.sellerAmount = sellerAmount; }

    public BigDecimal getShippingFee() { return shippingFee; }
    public void setShippingFee(BigDecimal shippingFee) { this.shippingFee = shippingFee; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public String getProductTitle() { return productTitle; }
    public void setProductTitle(String productTitle) { this.productTitle = productTitle; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public String getBuyerUsername() { return buyerUsername; }
    public void setBuyerUsername(String buyerUsername) { this.buyerUsername = buyerUsername; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }
}
