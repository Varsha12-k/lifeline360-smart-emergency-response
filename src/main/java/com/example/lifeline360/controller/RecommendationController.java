package com.example.lifeline360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.lifeline360.entity.Ambulance;
import com.example.lifeline360.repository.AmbulanceRepository;
import com.example.lifeline360.service.HospitalResult;
import com.example.lifeline360.service.HospitalSearchService;

@RestController
public class RecommendationController {

    private final AmbulanceRepository ambulanceRepository;
    private final HospitalSearchService hospitalSearchService;

    public RecommendationController(
            AmbulanceRepository ambulanceRepository,
            HospitalSearchService hospitalSearchService) {

        this.ambulanceRepository = ambulanceRepository;
        this.hospitalSearchService = hospitalSearchService;
    }

    @GetMapping("/recommend")
    public String recommend(
            @RequestParam String severity,
            @RequestParam String location) {

        // Find available ambulance near the emergency location
        List<Ambulance> ambulances =
                ambulanceRepository
                        .findByLocationContainingIgnoreCaseAndStatusIgnoreCase(
                                location, "AVAILABLE");

        // Find nearby hospitals using OpenStreetMap
        List<HospitalResult> hospitals =
                hospitalSearchService.searchHospitals(location);

        // Select first available ambulance
        Ambulance selectedAmbulance = null;

        if (!ambulances.isEmpty()) {
            selectedAmbulance = ambulances.get(0);
        }

        // Select hospital
        HospitalResult selectedHospital = null;

        if (!hospitals.isEmpty()) {

            // For critical emergencies, prefer hospitals
            // marked as providing emergency services
            if ("CRITICAL".equalsIgnoreCase(severity)) {

                for (HospitalResult hospital : hospitals) {

                    if ("yes".equalsIgnoreCase(hospital.getEmergency())) {
                        selectedHospital = hospital;
                        break;
                    }
                }
            }

            // If no emergency hospital was found,
            // select the first available hospital
            if (selectedHospital == null) {
                selectedHospital = hospitals.get(0);
            }
        }

        // No ambulance
        if (selectedAmbulance == null) {
            return "No available ambulance found near " + location + ".";
        }

        // No hospital
        if (selectedHospital == null) {
            return "No nearby hospital found near " + location + ".";
        }

        return "SMART RECOMMENDATION"
                + " || EMERGENCY: " + severity
                + " || LOCATION: " + location

                + " || AMBULANCE: "
                + selectedAmbulance.getAmbulanceNumber()
                + " | DRIVER: "
                + selectedAmbulance.getDriverName()
                + " | AMBULANCE LOCATION: "
                + selectedAmbulance.getLocation()

                + " || HOSPITAL: "
                + selectedHospital.getName()
                + " | ADDRESS: "
                + selectedHospital.getAddress()
                + " | LATITUDE: "
                + selectedHospital.getLatitude()
                + " | LONGITUDE: "
                + selectedHospital.getLongitude()
                + " | EMERGENCY: "
                + selectedHospital.getEmergency()
                + " | SPECIALITY: "
                + selectedHospital.getSpeciality();
    }
}