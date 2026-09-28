package com.example.lifeline360.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lifeline360.entity.EmergencyCase;

public interface EmergencyCaseRepository extends JpaRepository<EmergencyCase, Long> {

}