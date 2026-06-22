package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_boys")
public class DeliveryBoy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String phone;
    private String email;

    @Column(name = "vehicle_number")
    private String vehicleNumber;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    // Constructors
    public DeliveryBoy() {}

    public DeliveryBoy(Long id, String name, String phone, String email, String vehicleNumber, Boolean isAvailable) {
        this.id = id;
        this.name = name;
        this.phone = phone;
        this.email = email;
        this.vehicleNumber = vehicleNumber;
        this.isAvailable = isAvailable;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }
}
