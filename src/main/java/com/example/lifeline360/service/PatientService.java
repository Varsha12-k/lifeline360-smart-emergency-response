package com.example.lifeline360.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.lifeline360.entity.Patient;
import com.example.lifeline360.repository.PatientRepository;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }
}