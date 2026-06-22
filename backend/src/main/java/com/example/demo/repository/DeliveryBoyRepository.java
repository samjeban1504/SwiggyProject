package com.example.demo.repository;

import com.example.demo.entity.DeliveryBoy;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DeliveryBoyRepository extends JpaRepository<DeliveryBoy, Long> {
    Optional<DeliveryBoy> findByPhone(String phone);
}
