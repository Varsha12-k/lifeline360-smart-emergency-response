package com.example.lifeline360.service;

public class HospitalResult {

    private String name;
    private String address;
    private double latitude;
    private double longitude;
    private String emergency;
    private String speciality;

    public HospitalResult() {
    }

    public HospitalResult(String name, String address,
                          double latitude, double longitude,
                          String emergency, String speciality) {
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
        this.emergency = emergency;
        this.speciality = speciality;
    }

    public String getName() {
        return name;
    }

    public String getAddress() {
        return address;
    }

    public double getLatitude() {
        return latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public String getEmergency() {
        return emergency;
    }

    public String getSpeciality() {
        return speciality;
    }
}