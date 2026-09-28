package com.example.lifeline360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.lifeline360.entity.Hospital;
import com.example.lifeline360.repository.HospitalRepository;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public Hospital addHospital(Hospital hospital) {

        if (hospital.getStatus() == null || hospital.getStatus().isEmpty()) {
            hospital.setStatus("AVAILABLE");
        }

        return hospitalRepository.save(hospital);
    }

    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }
}