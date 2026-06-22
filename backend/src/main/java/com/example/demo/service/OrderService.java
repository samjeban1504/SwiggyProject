package com.example.demo.service;

import com.example.demo.entity.Order;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    public Order createOrder(Order order) {
        order.setOrderDate(LocalDateTime.now());
        order.setFoodProcess(false);
        order.setFoodPicked(false);
        order.setFoodReady(false);
        order.setFoodDelivered(false);
        if (order.getPaymentStatus() == null) {
            order.setPaymentStatus("PAID");
        }
        return orderRepository.save(order);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public void deleteOrdersByUserId(Long userId) {
        orderRepository.deleteByUserId(userId);
    }

    public List<Order> getOrdersByRestaurantId(Long restaurantId) {
        return orderRepository.findByRestaurantId(restaurantId);
    }

    public List<Order> getOrdersByDeliveryBoyId(Long deliveryBoyId) {
        return orderRepository.findByDeliveryBoyId(deliveryBoyId);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order processOrder(Long id) {
        return orderRepository.findById(id).map(order -> {
            order.setFoodProcess(true);
            order.setFoodReady(false);
            Order saved = orderRepository.save(order);
            scheduler.schedule(() -> markOrderReady(saved.getId()), 3, TimeUnit.SECONDS);
            return saved;
        }).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }

    private void markOrderReady(Long orderId) {
        orderRepository.findById(orderId).ifPresent(order -> {
            order.setFoodReady(true);
            orderRepository.save(order);
        });
    }

    public Order assignDeliveryBoy(Long orderId, Long deliveryBoyId) {
        return orderRepository.findById(orderId).map(order -> {
            if (order.getFoodReady() == null || !order.getFoodReady()) {
                throw new RuntimeException("Order is not ready for pickup yet.");
            }
            order.setDeliveryBoyId(deliveryBoyId);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id " + orderId));
    }

    public Order pickOrder(Long id) {
        return orderRepository.findById(id).map(order -> {
            order.setFoodPicked(true);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }

    public Order deliverOrder(Long id) {
        return orderRepository.findById(id).map(order -> {
            order.setFoodDelivered(true);
            return orderRepository.save(order);
        }).orElseThrow(() -> new RuntimeException("Order not found with id " + id));
    }
}
