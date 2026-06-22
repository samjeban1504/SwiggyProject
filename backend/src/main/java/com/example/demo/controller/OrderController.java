package com.example.demo.controller;

import com.example.demo.entity.Order;
import com.example.demo.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        return ResponseEntity.ok(orderService.createOrder(order));
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<List<Order>> getOrdersByUserId(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(id));
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<Order>> getOrdersByRestaurantId(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrdersByRestaurantId(id));
    }

    @GetMapping("/delivery/{deliveryBoyId}")
    public ResponseEntity<List<Order>> getOrdersByDeliveryBoyId(@PathVariable Long deliveryBoyId) {
        return ResponseEntity.ok(orderService.getOrdersByDeliveryBoyId(deliveryBoyId));
    }

    @PutMapping("/process/{id}")
    public ResponseEntity<Order> processOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.processOrder(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/assign/{id}")
    public ResponseEntity<Order> assignDeliveryBoy(@PathVariable Long id, @RequestParam Long deliveryBoyId) {
        try {
            return ResponseEntity.ok(orderService.assignDeliveryBoy(id, deliveryBoyId));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/picked/{id}")
    public ResponseEntity<Order> pickOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.pickOrder(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/delivered/{id}")
    public ResponseEntity<Order> deliverOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(orderService.deliverOrder(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
