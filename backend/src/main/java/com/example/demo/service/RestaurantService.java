package com.example.demo.service;

import com.example.demo.entity.Restaurant;
import com.example.demo.repository.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    public Restaurant saveRestaurant(Restaurant restaurant) {
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> getAllRestaurants() {
        return restaurantRepository.findAll();
    }

    public Optional<Restaurant> getRestaurantById(Long id) {
        return restaurantRepository.findById(id);
    }

    public Restaurant updateRestaurant(Long id, Restaurant details) {
        return restaurantRepository.findById(id).map(existing -> {
            existing.setRestaurantName(details.getRestaurantName());
            existing.setOwnerName(details.getOwnerName());
            existing.setPhone(details.getPhone());
            existing.setEmail(details.getEmail());
            existing.setAddress(details.getAddress());
            return restaurantRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Restaurant not found with id " + id));
    }

    public void deleteRestaurant(Long id) {
        restaurantRepository.deleteById(id);
    }
}
