package com.example.demo.service;

import com.example.demo.entity.Food;
import com.example.demo.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public Food saveFood(Food food) {
        return foodRepository.save(food);
    }

    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public List<Food> getFoodsByRestaurantId(Long restaurantId) {
        return foodRepository.findByRestaurantId(restaurantId);
    }

    public Optional<Food> getFoodById(Long id) {
        return foodRepository.findById(id);
    }

    public Food updateFood(Long id, Food details) {
        return foodRepository.findById(id).map(existing -> {
            existing.setFoodName(details.getFoodName());
            existing.setDescription(details.getDescription());
            existing.setPrice(details.getPrice());
            existing.setImageUrl(details.getImageUrl());
            existing.setAvailable(details.getAvailable());
            existing.setRestaurantId(details.getRestaurantId());
            return foodRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Food not found with id " + id));
    }

    public void deleteFood(Long id) {
        foodRepository.deleteById(id);
    }
}
