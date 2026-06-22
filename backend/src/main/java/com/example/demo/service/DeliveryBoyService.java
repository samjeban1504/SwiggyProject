package com.example.demo.service;

import com.example.demo.entity.DeliveryBoy;
import com.example.demo.repository.DeliveryBoyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class DeliveryBoyService {

    @Autowired
    private DeliveryBoyRepository deliveryBoyRepository;

    public DeliveryBoy register(DeliveryBoy deliveryBoy) {
        deliveryBoy.setIsAvailable(true);
        return deliveryBoyRepository.save(deliveryBoy);
    }

    public Optional<DeliveryBoy> login(String phone) {
        return deliveryBoyRepository.findByPhone(phone);
    }

    public List<DeliveryBoy> getAll() {
        return deliveryBoyRepository.findAll();
    }

    public Optional<DeliveryBoy> getById(Long id) {
        return deliveryBoyRepository.findById(id);
    }

    public void deleteDeliveryBoy(Long id) {
        deliveryBoyRepository.deleteById(id);
    }
}
