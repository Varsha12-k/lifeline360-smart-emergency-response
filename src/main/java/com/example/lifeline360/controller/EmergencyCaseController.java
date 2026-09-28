package com.example.lifeline360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.lifeline360.entity.EmergencyCase;
import com.example.lifeline360.service.EmergencyCaseService;

@RestController
@RequestMapping("/emergencies")
public class EmergencyCaseController {

    private final EmergencyCaseService emergencyCaseService;

    public EmergencyCaseController(
            EmergencyCaseService emergencyCaseService) {

        this.emergencyCaseService =
                emergencyCaseService;
    }

    @PostMapping
    public EmergencyCase addEmergencyCase(
            @RequestBody EmergencyCase emergencyCase) {

        return emergencyCaseService
                .addEmergencyCase(emergencyCase);
    }

    @GetMapping
    public List<EmergencyCase> getAllEmergencyCases() {

        return emergencyCaseService
                .getAllEmergencyCases();
    }

    @PutMapping("/{id}/status")
    public EmergencyCase updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        status = status.replace("\"", "").trim();

        return emergencyCaseService
                .updateStatus(id, status);
    }
}