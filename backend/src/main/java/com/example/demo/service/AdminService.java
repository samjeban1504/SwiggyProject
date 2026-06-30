package com.example.demo.service;

import com.example.demo.entity.Admin;
import com.example.demo.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private org.springframework.jdbc.core.JdbcTemplate jdbcTemplate;

    @jakarta.annotation.PostConstruct
    public void cleanupDuplicates() {
        try {
            List<Admin> admins = adminRepository.findAll();
            java.util.Set<String> seenUsernames = new java.util.HashSet<>();
            for (Admin admin : admins) {
                if (seenUsernames.contains(admin.getUsername())) {
                    adminRepository.delete(admin);
                    System.out.println("Deleted duplicate admin record: " + admin.getUsername() + " (ID: " + admin.getId() + ")");
                } else {
                    // Fix null active field — ensure the kept record is active
                    if (admin.getActive() == null) {
                        admin.setActive(true);
                        admin.setCreatedAt(System.currentTimeMillis());
                        admin.setUpdatedAt(System.currentTimeMillis());
                        adminRepository.save(admin);
                        System.out.println("Fixed null active field for admin: " + admin.getUsername());
                    }
                    seenUsernames.add(admin.getUsername());
                }
            }

            // Apply unique constraints if they don't exist
            try {
                jdbcTemplate.execute("ALTER TABLE admins ADD UNIQUE INDEX unique_username (username)");
                System.out.println("Successfully added unique index unique_username to admins table");
            } catch (Exception e) {
                // Ignore if index already exists
            }
            try {
                jdbcTemplate.execute("ALTER TABLE admins ADD UNIQUE INDEX unique_email (email)");
                System.out.println("Successfully added unique index unique_email to admins table");
            } catch (Exception e) {
                // Ignore if index already exists
            }
        } catch (Exception e) {
            System.err.println("Error cleaning up duplicate admin records: " + e.getMessage());
        }
    }

    public Admin createAdmin(Admin admin) {
        admin.setCreatedAt(System.currentTimeMillis());
        admin.setUpdatedAt(System.currentTimeMillis());
        if (admin.getActive() == null) {
            admin.setActive(true);
        }
        return adminRepository.save(admin);
    }

    public List<Admin> getAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> getAdminById(Long id) {
        return adminRepository.findById(id);
    }

    public Admin updateAdmin(Long id, Admin adminDetails) {
        return adminRepository.findById(id).map(admin -> {
            if (adminDetails.getUsername() != null) {
                admin.setUsername(adminDetails.getUsername());
            }
            if (adminDetails.getEmail() != null) {
                admin.setEmail(adminDetails.getEmail());
            }
            if (adminDetails.getPassword() != null) {
                admin.setPassword(adminDetails.getPassword());
            }
            if (adminDetails.getPhone() != null) {
                admin.setPhone(adminDetails.getPhone());
            }
            if (adminDetails.getRole() != null) {
                admin.setRole(adminDetails.getRole());
            }
            if (adminDetails.getActive() != null) {
                admin.setActive(adminDetails.getActive());
            }
            admin.setUpdatedAt(System.currentTimeMillis());
            return adminRepository.save(admin);
        }).orElse(null);
    }

    public void deleteAdmin(Long id) {
        adminRepository.deleteById(id);
    }

    public Optional<Admin> login(String username, String password) {
        return adminRepository.findByUsername(username).filter(admin ->
            admin.getPassword().equals(password) && Boolean.TRUE.equals(admin.getActive())
        );
    }

    public Optional<Admin> getByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Optional<Admin> getByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
}
