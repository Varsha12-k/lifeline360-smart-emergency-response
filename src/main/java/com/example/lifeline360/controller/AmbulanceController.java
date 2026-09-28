package com.example.lifeline360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lifeline360.entity.Ambulance;
import com.example.lifeline360.service.AmbulanceService;

@RestController
@RequestMapping("/ambulances")
public class AmbulanceController {

    private final AmbulanceService ambulanceService;

    public AmbulanceController(AmbulanceService ambulanceService) {
        this.ambulanceService = ambulanceService;
    }

    @PostMapping
    public Ambulance addAmbulance(
            @RequestBody Ambulance ambulance) {

        return ambulanceService.addAmbulance(ambulance);
    }

    @GetMapping
    public List<Ambulance> getAllAmbulances() {

        return ambulanceService.getAllAmbulances();
    }

    @PutMapping("/{id}/status")
    public Ambulance updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        status = status.replace("\"", "").trim();

        return ambulanceService.updateStatus(id, status);
    }
}