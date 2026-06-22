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
            admin.getPassword().equals(password) && admin.getActive()
        );
    }

    public Optional<Admin> getByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Optional<Admin> getByEmail(String email) {
        return adminRepository.findByEmail(email);
    }
}
