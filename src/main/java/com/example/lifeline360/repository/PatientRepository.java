package com.example.lifeline360.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lifeline360.entity.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {

}