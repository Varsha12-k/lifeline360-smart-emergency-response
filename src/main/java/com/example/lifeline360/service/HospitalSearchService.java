package com.example.lifeline360.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.lifeline360.entity.Hospital;
import com.example.lifeline360.repository.HospitalRepository;

@Service
public class HospitalSearchService {

    private final HospitalRepository hospitalRepository;

    public HospitalSearchService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<HospitalResult> searchHospitals(String location) {

        List<Hospital> hospitals =
                hospitalRepository
                        .findByLocationContainingIgnoreCaseAndStatusIgnoreCase(
                                location, "AVAILABLE");

        List<HospitalResult> results = new ArrayList<>();

        for (Hospital hospital : hospitals) {

            String facilities = hospital.getFacilities();

            String emergency = "no";

            if (facilities != null &&
                    facilities.toLowerCase().contains("emergency")) {
                emergency = "yes";
            }

            results.add(
                    new HospitalResult(
                            hospital.getHospitalName(),
                            hospital.getLocation(),
                            hospital.getLatitude(),
                            hospital.getLongitude(),
                            emergency,
                            facilities
                    )
            );
        }

        return results;
    }
}