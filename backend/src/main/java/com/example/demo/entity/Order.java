package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    private Integer quantity;

    @Column(name = "total_amount")
    private Double totalAmount;

    @Column(name = "food_process")
    private Boolean foodProcess;

    @Column(name = "food_picked")
    private Boolean foodPicked;

    @Column(name = "food_ready")
    private Boolean foodReady;

    @Column(name = "food_delivered")
    private Boolean foodDelivered;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "restaurant_id")
    private Long restaurantId;

    @Column(name = "food_id")
    private Long foodId;

    @Column(name = "delivery_boy_id")
    private Long deliveryBoyId;

    @Column(name = "payment_method")
    private String paymentMethod;   // CARD, UPI, COD

    @Column(name = "payment_status")
    private String paymentStatus;   // PENDING, PAID

    // Constructors
    public Order() {}

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }

    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public Boolean getFoodProcess() { return foodProcess; }
    public void setFoodProcess(Boolean foodProcess) { this.foodProcess = foodProcess; }

    public Boolean getFoodPicked() { return foodPicked; }
    public void setFoodPicked(Boolean foodPicked) { this.foodPicked = foodPicked; }

    public Boolean getFoodReady() { return foodReady; }
    public void setFoodReady(Boolean foodReady) { this.foodReady = foodReady; }

    public Boolean getFoodDelivered() { return foodDelivered; }
    public void setFoodDelivered(Boolean foodDelivered) { this.foodDelivered = foodDelivered; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getRestaurantId() { return restaurantId; }
    public void setRestaurantId(Long restaurantId) { this.restaurantId = restaurantId; }

    public Long getFoodId() { return foodId; }
    public void setFoodId(Long foodId) { this.foodId = foodId; }

    public Long getDeliveryBoyId() { return deliveryBoyId; }
    public void setDeliveryBoyId(Long deliveryBoyId) { this.deliveryBoyId = deliveryBoyId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
}
