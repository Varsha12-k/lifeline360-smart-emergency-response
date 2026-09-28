package com.example.lifeline360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.lifeline360.entity.EmergencyCase;
import com.example.lifeline360.repository.EmergencyCaseRepository;

@Service
public class EmergencyCaseService {

    private final EmergencyCaseRepository emergencyCaseRepository;

    public EmergencyCaseService(
            EmergencyCaseRepository emergencyCaseRepository) {

        this.emergencyCaseRepository =
                emergencyCaseRepository;
    }

    public EmergencyCase addEmergencyCase(
            EmergencyCase emergencyCase) {

        if (emergencyCase.getStatus() == null ||
                emergencyCase.getStatus().isEmpty()) {

            emergencyCase.setStatus("REPORTED");
        }

        return emergencyCaseRepository.save(emergencyCase);
    }

    public List<EmergencyCase> getAllEmergencyCases() {

        return emergencyCaseRepository.findAll();
    }

    public EmergencyCase updateStatus(
            Long id,
            String status) {

        EmergencyCase emergencyCase =
                emergencyCaseRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Emergency not found"));

        emergencyCase.setStatus(status);

        return emergencyCaseRepository.save(
                emergencyCase);
    }
}