package com.curio.model;

import java.io.Serializable;
import java.sql.Timestamp;

public class Category implements Serializable {
    private static final long serialVersionUID = 1L;

    private Integer id;
    private String name;
    private String slug;
    private String description;
    private Integer parentId;
    private Timestamp createdAt;

    public Category() {}

    public Category(Integer id, String name, String slug, String description, Integer parentId, Timestamp createdAt) {
        this.id = id;
        this.name = name;
        this.slug = slug;
        this.description = description;
        this.parentId = parentId;
        this.createdAt = createdAt;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getParentId() { return parentId; }
    public void setParentId(Integer parentId) { this.parentId = parentId; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
