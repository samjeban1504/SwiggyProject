package com.example.demo.controller;

import com.example.demo.entity.Food;
import com.example.demo.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/food")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @PostMapping
    public ResponseEntity<Food> createFood(@RequestBody Food food) {
        return ResponseEntity.ok(foodService.saveFood(food));
    }

    @GetMapping
    public ResponseEntity<List<Food>> getAllFoods() {
        return ResponseEntity.ok(foodService.getAllFoods());
    }

    @GetMapping("/restaurant/{id}")
    public ResponseEntity<List<Food>> getFoodsByRestaurantId(@PathVariable Long id) {
        return ResponseEntity.ok(foodService.getFoodsByRestaurantId(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Food> updateFood(@PathVariable Long id, @RequestBody Food food) {
        try {
            return ResponseEntity.ok(foodService.updateFood(id, food));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFood(@PathVariable Long id) {
        try {
            foodService.deleteFood(id);
            return ResponseEntity.ok("Food item deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error deleting food item: " + e.getMessage());
        }
    }
}
