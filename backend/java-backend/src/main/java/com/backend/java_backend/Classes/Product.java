package com.backend.java_backend.Classes;

import jakarta.persistence.*;

import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private String category;
    private String SKU;
    private int unit;
    private float cost;
    private float retail;
    private String SupplierInfo;
    private int minimumStockThreshold;
    private Date expiry;
    private Date createdAt;
    private Date updatedAt;
    private String description;

    public Product(int id, String name, String category, String SKU, int unit, float cost, float retail, String supplierInfo, int minimumStockThreshold, Date expiry, Date createdAt, Date updatedAt, String description) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.SKU = SKU;
        this.unit = unit;
        this.cost = cost;
        this.retail = retail;
        SupplierInfo = supplierInfo;
        this.minimumStockThreshold = minimumStockThreshold;
        this.expiry = expiry;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.description = description;
    }
    public Product() {

    }

    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getCategory() {
        return category;
    }

    public String getSKU() {
        return SKU;
    }

    public int getUnit() {
        return unit;
    }

    public float getCost() {
        return cost;
    }

    public float getRetail() {
        return retail;
    }

    public String getSupplierInfo() {
        return SupplierInfo;
    }

    public int getMinimumStockThreshold() {
        return minimumStockThreshold;
    }

    public Date getExpiry() {
        return expiry;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getUpdatedAt() {
        return updatedAt;
    }

    public String getDescription() {
        return description;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setSKU(String SKU) {
        this.SKU = SKU;
    }

    public void setUnit(int unit) {
        this.unit = unit;
    }

    public void setCost(float cost) {
        this.cost = cost;
    }

    public void setRetail(float retail) {
        this.retail = retail;
    }

    public void setSupplierInfo(String supplierInfo) {
        SupplierInfo = supplierInfo;
    }

    public void setMinimumStockThreshold(int minimumStockThreshold) {
        this.minimumStockThreshold = minimumStockThreshold;
    }

    public void setExpiry(Date expiry) {
        this.expiry = expiry;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = updatedAt;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Product product = (Product) o;
        return id == product.id && unit == product.unit && Float.compare(cost, product.cost) == 0 && Float.compare(retail, product.retail) == 0 && minimumStockThreshold == product.minimumStockThreshold && Objects.equals(name, product.name) && Objects.equals(category, product.category) && Objects.equals(SKU, product.SKU) && Objects.equals(SupplierInfo, product.SupplierInfo) && Objects.equals(expiry, product.expiry) && Objects.equals(createdAt, product.createdAt) && Objects.equals(updatedAt, product.updatedAt) && Objects.equals(description, product.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, category, SKU, unit, cost, retail, SupplierInfo, minimumStockThreshold, expiry, createdAt, updatedAt, description);
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", category='" + category + '\'' +
                ", SKU='" + SKU + '\'' +
                ", unit=" + unit +
                ", cost=" + cost +
                ", retail=" + retail +
                ", SupplierInfo='" + SupplierInfo + '\'' +
                ", minimumStockThreshold=" + minimumStockThreshold +
                ", expiry=" + expiry +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", description='" + description + '\'' +
                '}';
    }
}
