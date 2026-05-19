package com.retail.auth.dto;

public class OrderRequest {

    private String customerName;
    private String productName;
    private Integer quantity;
    private Double totalAmount;

    public OrderRequest() {
    }

    public OrderRequest(String customerName, String productName, Integer quantity, Double totalAmount) {
        this.customerName = customerName;
        this.productName = productName;
        this.quantity = quantity;
        this.totalAmount = totalAmount;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}