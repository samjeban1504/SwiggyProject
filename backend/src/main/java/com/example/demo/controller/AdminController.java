package com.example.demo.controller;

import com.example.demo.entity.Admin;
import com.example.demo.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Admin admin) {
        // Check if username already exists
        if (adminService.getByUsername(admin.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username already exists"));
        }
        // Check if email already exists
        if (adminService.getByEmail(admin.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        Admin createdAdmin = adminService.createAdmin(admin);
        return ResponseEntity.ok(createdAdmin);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        if (username == null || username.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username and password are required"));
        }

        return adminService.login(username, password)
                .map(admin -> ResponseEntity.ok(Map.of(
                        "id", admin.getId(),
                        "username", admin.getUsername(),
                        "email", admin.getEmail(),
                        "role", admin.getRole(),
                        "phone", admin.getPhone()
                )))
                .orElse(ResponseEntity.badRequest().body(Map.of("error", "Invalid username or password")));
    }

    @GetMapping
    public ResponseEntity<List<Admin>> getAllAdmins() {
        return ResponseEntity.ok(adminService.getAllAdmins());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        return adminService.getAdminById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAdmin(@PathVariable Long id, @RequestBody Admin adminDetails) {
        Admin updatedAdmin = adminService.updateAdmin(id, adminDetails);
        if (updatedAdmin == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedAdmin);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Long id) {
        adminService.deleteAdmin(id);
        return ResponseEntity.ok(Map.of("message", "Admin deleted successfully"));
    }
}
