package com.example.lifeline360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.lifeline360.entity.Ambulance;
import com.example.lifeline360.repository.AmbulanceRepository;

@Service
public class AmbulanceService {

    private final AmbulanceRepository ambulanceRepository;

    public AmbulanceService(AmbulanceRepository ambulanceRepository) {
        this.ambulanceRepository = ambulanceRepository;
    }

    public Ambulance addAmbulance(Ambulance ambulance) {

        if (ambulance.getStatus() == null ||
                ambulance.getStatus().isEmpty()) {

            ambulance.setStatus("AVAILABLE");
        }

        return ambulanceRepository.save(ambulance);
    }

    public List<Ambulance> getAllAmbulances() {
        return ambulanceRepository.findAll();
    }

    public Ambulance updateStatus(Long id, String status) {

        Ambulance ambulance =
                ambulanceRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Ambulance not found"));

        ambulance.setStatus(status);

        return ambulanceRepository.save(ambulance);
    }
}