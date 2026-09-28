package com.example.lifeline360.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.example.lifeline360.entity.Ambulance;

public interface AmbulanceRepository extends JpaRepository<Ambulance, Long> {

    List<Ambulance> findByLocationContainingIgnoreCaseAndStatusIgnoreCase(
            String location, String status);
}