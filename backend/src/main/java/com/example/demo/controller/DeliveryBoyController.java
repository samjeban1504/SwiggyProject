package com.example.demo.controller;

import com.example.demo.entity.DeliveryBoy;
import com.example.demo.service.DeliveryBoyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/delivery-boys")
@CrossOrigin(origins = "*")
public class DeliveryBoyController {

    @Autowired
    private DeliveryBoyService deliveryBoyService;

    @PostMapping
    public ResponseEntity<DeliveryBoy> register(@RequestBody DeliveryBoy deliveryBoy) {
        return ResponseEntity.ok(deliveryBoyService.register(deliveryBoy));
    }

    @GetMapping
    public ResponseEntity<List<DeliveryBoy>> getAll() {
        return ResponseEntity.ok(deliveryBoyService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryBoy> getById(@PathVariable Long id) {
        return deliveryBoyService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String phone = body.get("phone");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("Phone number is required.");
        }
        return deliveryBoyService.login(phone)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDeliveryBoy(@PathVariable Long id) {
        deliveryBoyService.deleteDeliveryBoy(id);
        return ResponseEntity.ok("Delivery boy deleted successfully");
    }
}
