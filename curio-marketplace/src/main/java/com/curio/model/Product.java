package com.curio.model;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

public class Product implements Serializable {
    private static final long serialVersionUID = 1L;

    private Long id;
    private Long sellerId;
    private Integer categoryId;
    private String title;
    private String description;
    private String brand;
    private String model;
    private Integer year;
    private String itemCondition; // MINT, NEAR_MINT, EXCELLENT, VERY_GOOD, GOOD, FAIR
    private String location;
    private String tags;
    private String status; // PENDING, ACTIVE, SOLD, REMOVED
    private Timestamp createdAt;
    private Timestamp updatedAt;

    // Joined / helper fields
    private String primaryImageUrl;
    private List<String> imageUrls = new ArrayList<>();
    private String sellerUsername;
    private String categoryName;

    public Product() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getSellerId() { return sellerId; }
    public void setSellerId(Long sellerId) { this.sellerId = sellerId; }

    public Integer getCategoryId() { return categoryId; }
    public void setCategoryId(Integer categoryId) { this.categoryId = categoryId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public String getItemCondition() { return itemCondition; }
    public void setItemCondition(String itemCondition) { this.itemCondition = itemCondition; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }

    public Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public String getPrimaryImageUrl() { return primaryImageUrl; }
    public void setPrimaryImageUrl(String primaryImageUrl) { this.primaryImageUrl = primaryImageUrl; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public String getSellerUsername() { return sellerUsername; }
    public void setSellerUsername(String sellerUsername) { this.sellerUsername = sellerUsername; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
}
