package com.example.lifeline360.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.lifeline360.entity.Hospital;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {

    List<Hospital> findByLocationContainingIgnoreCaseAndStatusIgnoreCase(
            String location, String status);
}