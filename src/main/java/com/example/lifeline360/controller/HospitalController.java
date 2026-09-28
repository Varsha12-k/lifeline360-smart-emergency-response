package com.example.lifeline360.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.lifeline360.service.HospitalResult;
import com.example.lifeline360.service.HospitalSearchService;

@RestController
@RequestMapping("/hospitals")
public class HospitalController {

    private final HospitalSearchService hospitalSearchService;

    public HospitalController(HospitalSearchService hospitalSearchService) {
        this.hospitalSearchService = hospitalSearchService;
    }

    @GetMapping("/search")
    public List<HospitalResult> searchHospitals(
            @RequestParam String location) {

        return hospitalSearchService.searchHospitals(location);
    }
}