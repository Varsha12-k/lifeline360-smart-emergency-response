/* =========================================================
   LIFE LINE 360 - FRONTEND
   ========================================================= */

let responseMap = null;
let emergencyMarker = null;
let ambulanceMarker = null;
let hospitalMarker = null;
let routeLine = null;

let currentEmergency = null;
let selectedAmbulance = null;
let selectedHospital = null;


/* =========================================================
   START APPLICATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    setupNavigation();
    setupLogin();
    setupEmergencyForm();
    setupPatientForm();

    updateDate();
    setInterval(updateDate, 60000);

    if (sessionStorage.getItem("lifelineLoggedIn") === "true") {

        const loginScreen = document.getElementById("loginScreen");
        const app = document.getElementById("app");

        if (loginScreen) {
            loginScreen.style.display = "none";
        }

        if (app) {
            app.classList.remove("hidden");
            app.style.display = "flex";
        }
    }

});


/* =========================================================
   LOGIN
   ========================================================= */

function setupLogin() {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const username =
            document.getElementById("loginUsername").value.trim();

        const password =
            document.getElementById("loginPassword").value.trim();

        const error =
            document.getElementById("loginError");

        if (!username || !password) {

            error.textContent =
                "Please enter username and password.";

            return;
        }

        error.textContent = "";

        const loginScreen =
            document.getElementById("loginScreen");

        const app =
            document.getElementById("app");

        if (loginScreen) {
            loginScreen.style.display = "none";
        }

        if (app) {
            app.classList.remove("hidden");
            app.style.display = "flex";
        }

        sessionStorage.setItem(
            "lifelineLoggedIn",
            "true"
        );

    });


    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

}


function logout() {

    sessionStorage.removeItem("lifelineLoggedIn");

    const app =
        document.getElementById("app");

    const loginScreen =
        document.getElementById("loginScreen");

    const loginForm =
        document.getElementById("loginForm");

    if (app) {

        app.classList.add("hidden");
        app.style.display = "none";

    }

    if (loginScreen) {
        loginScreen.style.display = "flex";
    }

    if (loginForm) {
        loginForm.reset();
    }

}


/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const navigationItems =
        document.querySelectorAll(".nav-item");

    navigationItems.forEach(function (item) {

        item.addEventListener("click", function (event) {

            event.preventDefault();

            const screen =
                item.getAttribute("data-screen");

            if (screen) {
                showScreen(screen);
            }

        });

    });

}


function showScreen(screenName) {

    console.log("Opening:", screenName);

    const screens =
        document.querySelectorAll(".screen");

    screens.forEach(function (screen) {

        screen.classList.remove(
            "active-screen"
        );

    });


    const selectedScreen =
        document.getElementById(
            "screen-" + screenName
        );

    if (!selectedScreen) {

        console.error(
            "Screen not found: screen-" + screenName
        );

        return;
    }


    selectedScreen.classList.add(
        "active-screen"
    );


    /* Active sidebar button */

    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(function (item) {

        item.classList.remove("active");

        if (
            item.getAttribute("data-screen")
            === screenName
        ) {

            item.classList.add("active");

        }

    });


    updatePageTitle(screenName);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    /* Load screen data */

    if (screenName === "ambulances") {
        loadAmbulances();
    }

    if (screenName === "hospitals") {

        const input =
            document.getElementById(
                "hospitalSearchLocation"
            );

        if (input) {
            setTimeout(function () {
                input.focus();
            }, 200);
        }

    }

    if (screenName === "patients") {
        loadPatients();
    }

    if (screenName === "history") {
        loadEmergencyHistory();
    }

    if (screenName === "report") {
        prepareEmergencyReport();
    }

    if (screenName === "result") {

        setTimeout(function () {

            if (responseMap) {
                responseMap.invalidateSize(true);
            }

        }, 300);

    }

}


/* =========================================================
   PAGE TITLE
   ========================================================= */

function updatePageTitle(screenName) {

    const titles = {

        dashboard: "Dashboard",

        emergency: "Emergency Response",

        result: "Response Plan",

        history: "Emergency History",

        ambulances: "Ambulance Network",

        hospitals: "Hospital Network",

        patients: "Patients",

        report: "Emergency Report"

    };


    const pageTitle =
        document.getElementById(
            "pageTitle"
        );

    if (pageTitle) {

        pageTitle.textContent =
            titles[screenName]
            || "LifeLine 360";

    }

}


/* =========================================================
   DATE
   ========================================================= */

function updateDate() {

    const dateElement =
        document.getElementById(
            "currentDate"
        );

    if (!dateElement) return;

    dateElement.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}


/* =========================================================
   EMERGENCY FORM
   ========================================================= */

function setupEmergencyForm() {

    const form =
        document.getElementById(
            "emergencyForm"
        );

    if (!form) return;

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            handleEmergencySubmit();

        }
    );

}


/* =========================================================
   EMERGENCY SUBMIT
   ========================================================= */

async function handleEmergencySubmit() {

    const type =
        document.getElementById(
            "emergencyType"
        ).value;

    const severity =
        document.getElementById(
            "severity"
        ).value;

    const location =
        document.getElementById(
            "emergencyLocation"
        ).value.trim();

    const description =
        document.getElementById(
            "emergencyDescription"
        ).value.trim();


    if (!type) {

        showToast(
            "Please select Emergency Type.",
            "error"
        );

        showScreen("emergency");

        return;
    }


    if (!severity) {

        showToast(
            "Please select Severity.",
            "error"
        );

        showScreen("emergency");

        return;
    }


    if (!location) {

        showToast(
            "Please enter Emergency Location.",
            "error"
        );

        showScreen("emergency");

        return;
    }


    currentEmergency = {

        type: type,

        severity: severity,

        location: location,

        description: description,

        id: null,

        caseId:
            "EMG-" +
            String(
                Math.floor(
                    100 + Math.random() * 900
                )
            ),

        status: "REPORTED",

        createdAt:
            new Date().toLocaleString("en-IN")

    };


    selectedAmbulance = null;
    selectedHospital = null;


    prepareResultScreen();

    showScreen("result");


    setTimeout(function () {

        initializeResponseMap();

        addEmergencyMarker();

    }, 300);


    /* Save emergency */

    try {

        const savedEmergency =
            await saveEmergency(
                currentEmergency
            );


        if (
            savedEmergency &&
            savedEmergency.id
        ) {

            currentEmergency.id =
                savedEmergency.id;

            currentEmergency.caseId =
                "EMG-" +
                String(
                    savedEmergency.id
                ).padStart(3, "0");


            const caseId =
                document.getElementById(
                    "resultCaseId"
                );

            if (caseId) {
                caseId.textContent =
                    currentEmergency.caseId;
            }

        }

    } catch (error) {

        console.error(
            "Emergency save error:",
            error
        );

        showToast(
            "Emergency could not be saved.",
            "error"
        );

    }


    /* Find ambulance and hospital */

    loadResponseResources();

}


/* =========================================================
   SAVE EMERGENCY
   ========================================================= */

async function saveEmergency(data) {

    const response =
        await fetch(
            "/emergencies",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body:
                    JSON.stringify({
                        emergencyType:
                            data.type,

                        severity:
                            data.severity,

                        location:
                            data.location,

                        description:
                            data.description
                    })
            }
        );


    if (!response.ok) {

        throw new Error(
            "Emergency API failed"
        );

    }


    return await response.json();

}


/* =========================================================
   PREPARE RESULT
   ========================================================= */

function prepareResultScreen() {

    setText(
        "resultCaseId",
        currentEmergency.caseId
    );

    setText(
        "resultType",
        currentEmergency.type
    );

    setText(
        "resultSeverity",
        currentEmergency.severity
    );

    setText(
        "resultLocation",
        currentEmergency.location
    );


    setText(
        "resultAmbulanceNumber",
        "Finding ambulance..."
    );

    setText(
        "resultDriver",
        "Matching resource..."
    );

    setText(
        "resultAmbulanceLocation",
        "Searching..."
    );

    setText(
        "resultAmbulanceType",
        "Emergency Ambulance"
    );


    setText(
        "resultHospital",
        "Finding hospital..."
    );

    setText(
        "resultHospitalAddress",
        "Searching..."
    );

    setText(
        "resultHospitalEmergency",
        "Checking..."
    );

    setText(
        "resultHospitalSpeciality",
        "Checking..."
    );


    const mapButton =
        document.getElementById(
            "openHospitalMap"
        );

    if (mapButton) {

        mapButton.disabled = true;
        mapButton.onclick = null;

    }


    updateEmergencyStatusUI(
        "REPORTED"
    );

}


/* =========================================================
   RESPONSE RESOURCES
   ========================================================= */

function loadResponseResources() {

    loadMatchingAmbulance();

    loadMatchingHospital();

}


/* =========================================================
   AMBULANCE MATCHING
   ========================================================= */

async function loadMatchingAmbulance() {

    try {

        const response =
            await fetch(
                "/ambulances"
            );


        if (!response.ok) {

            throw new Error(
                "Ambulance API failed"
            );

        }


        const ambulances =
            await response.json();


        const location =
            normalize(
                currentEmergency.location
            );


        /* First try same location */

        let available =
            ambulances.filter(
                function (ambulance) {

                    const ambulanceLocation =
                        normalize(
                            ambulance.location
                        );

                    const status =
                        normalize(
                            ambulance.status
                        );

                    return (

                        status === "available"

                        &&

                        (
                            ambulanceLocation.includes(
                                location
                            )

                            ||

                            location.includes(
                                ambulanceLocation
                            )
                        )

                    );

                }
            );


        /* If none, use any available ambulance */

        if (available.length === 0) {

            available =
                ambulances.filter(
                    function (ambulance) {

                        return normalize(
                            ambulance.status
                        ) === "available";

                    }
                );

        }


        if (available.length === 0) {

            setText(
                "resultAmbulanceNumber",
                "No ambulance available"
            );

            setText(
                "resultDriver",
                "No available resource"
            );

            setText(
                "resultAmbulanceLocation",
                "Unavailable"
            );

            return;

        }


        selectedAmbulance =
            available[0];


        setText(
            "resultAmbulanceNumber",
            selectedAmbulance.ambulanceNumber
            || "Ambulance"
        );


        setText(
            "resultDriver",
            selectedAmbulance.driverName
            || "Assigned driver"
        );


        setText(
            "resultAmbulanceLocation",
            selectedAmbulance.location
            || currentEmergency.location
        );


        setText(
            "resultAmbulanceType",
            selectedAmbulance.ambulanceType
            || "Emergency Ambulance"
        );


        /* Add ambulance marker */

        if (selectedAmbulance.location) {

            const coordinates =
                await geocodeLocation(
                    selectedAmbulance.location
                );


            if (coordinates) {

                addAmbulanceMarker(
                    coordinates.lat,
                    coordinates.lon,
                    selectedAmbulance
                );

            }

        }


        /* Update assignment section */

        const assignmentButton =
            document.getElementById(
                "assignAmbulanceButton"
            );

        if (assignmentButton) {

            assignmentButton.disabled = false;

            assignmentButton.textContent =
                "Assign Ambulance";

        }


        tryStartRoute();

    } catch (error) {

        console.error(
            "Ambulance error:",
            error
        );

        setText(
            "resultAmbulanceNumber",
            "Unable to load"
        );

    }

}


/* =========================================================
   HOSPITAL MATCHING
   ========================================================= */

async function loadMatchingHospital() {

    try {

        const response =
            await fetch(
                "/hospitals/search?location=" +
                encodeURIComponent(
                    currentEmergency.location
                )
            );


        if (!response.ok) {

            throw new Error(
                "Hospital API failed"
            );

        }


        const hospitals =
            await response.json();


        if (
            !hospitals ||
            hospitals.length === 0
        ) {

            setText(
                "resultHospital",
                "No hospital found"
            );

            setText(
                "resultHospitalAddress",
                "Try another location"
            );

            return;

        }


        /* Critical cases prefer emergency hospitals */

        if (
            normalize(
                currentEmergency.severity
            ) === "critical"
        ) {

            selectedHospital =
                hospitals.find(
                    function (hospital) {

                        return normalize(
                            hospital.emergency
                        ) === "yes";

                    }
                );

        }


        if (!selectedHospital) {

            selectedHospital =
                hospitals[0];

        }


        displayHospital(
            selectedHospital
        );


        tryStartRoute();

    } catch (error) {

        console.error(
            "Hospital error:",
            error
        );

        setText(
            "resultHospital",
            "Hospital search failed"
        );

        setText(
            "resultHospitalAddress",
            "Try again or use another location"
        );

    }

}


/* =========================================================
   DISPLAY HOSPITAL
   ========================================================= */

function displayHospital(hospital) {

    setText(
        "resultHospital",
        hospital.name || "Hospital"
    );


    setText(
        "resultHospitalAddress",
        hospital.address
        || "Location available"
    );


    setText(
        "resultHospitalEmergency",
        hospital.emergency
        || "Available"
    );


    setText(
        "resultHospitalSpeciality",
        hospital.speciality
        || "General"
    );


    /* Optional extra hospital information */

    setText(
        "resultHospitalPhone",
        hospital.phone || "Not available"
    );

    setText(
        "resultHospitalBeds",
        hospital.availableBeds != null
            ? hospital.availableBeds
            : "Not available"
    );


    const button =
        document.getElementById(
            "openHospitalMap"
        );


    if (
        button &&
        hospital.latitude != null &&
        hospital.longitude != null
    ) {

        button.disabled = false;


        button.onclick =
            function () {

                const url =
                    "https://www.openstreetmap.org/" +
                    "?mlat=" +
                    hospital.latitude +
                    "&mlon=" +
                    hospital.longitude +
                    "#map=17/" +
                    hospital.latitude +
                    "/" +
                    hospital.longitude;


                window.open(
                    url,
                    "_blank"
                );

            };


        addHospitalMarker(
            hospital.latitude,
            hospital.longitude,
            hospital
        );

    }

}


/* =========================================================
   TRY START ROUTE
   ========================================================= */

function tryStartRoute() {

    if (
        !selectedAmbulance ||
        !selectedHospital
    ) {
        return;
    }


    if (
        selectedHospital.latitude == null ||
        selectedHospital.longitude == null
    ) {
        return;
    }


    if (!responseMap) {
        return;
    }


    calculateAmbulanceHospitalRoute(
        selectedAmbulance.location,
        selectedHospital.latitude,
        selectedHospital.longitude,
        selectedHospital.name
    );

}


/* =========================================================
   AMBULANCE → HOSPITAL ROUTE
   ========================================================= */
   async function calculateAmbulanceHospitalRoute(
       ambulanceLocation,
       hospitalLatitude,
       hospitalLongitude,
       hospitalName
   ) {
       try {

           setText("routeAmbulanceLocation", ambulanceLocation);
           setText("routeHospitalName", hospitalName);
           setText("routeDistance", "Calculating...");
           setText("routeDuration", "Calculating...");

           // Convert ambulance location into coordinates
           const ambulanceCoords = await geocodeLocation(ambulanceLocation);

           if (!ambulanceCoords) {
               throw new Error("Ambulance location could not be found");
           }

           const ambulanceLat = parseFloat(ambulanceCoords.lat);
           const ambulanceLon = parseFloat(ambulanceCoords.lon);

           const hospitalLat = parseFloat(hospitalLatitude);
           const hospitalLon = parseFloat(hospitalLongitude);

           if (
               isNaN(ambulanceLat) ||
               isNaN(ambulanceLon) ||
               isNaN(hospitalLat) ||
               isNaN(hospitalLon)
           ) {
               throw new Error("Invalid coordinates");
           }

           // OSRM route URL
           // IMPORTANT: longitude,latitude
           const url =
               "https://router.project-osrm.org/route/v1/driving/" +
               ambulanceLon +
               "," +
               ambulanceLat +
               ";" +
               hospitalLon +
               "," +
               hospitalLat +
               "?overview=full&geometries=geojson";

           console.log("Route URL:", url);

           const response = await fetch(url);

           if (!response.ok) {
               throw new Error("Route service unavailable");
           }

           const data = await response.json();

           if (
               data.code !== "Ok" ||
               !data.routes ||
               data.routes.length === 0
           ) {
               throw new Error("No route found");
           }

           const route = data.routes[0];

           // Distance
           const distanceKm =
               (route.distance / 1000).toFixed(1);

           // Estimated time
           const durationMinutes =
               Math.ceil(route.duration / 60);

           setText(
               "routeDistance",
               distanceKm + " km"
           );

           setText(
               "routeDuration",
               durationMinutes + " min"
           );

           // Remove old route
           if (routeLine && responseMap) {
               responseMap.removeLayer(routeLine);
           }

           // Draw new route
           if (responseMap && route.geometry) {

               routeLine = L.geoJSON(
                   route.geometry,
                   {
                       style: {
                           weight: 5,
                           opacity: 0.85
                       }
                   }
               ).addTo(responseMap);
           }

           // Remove old ambulance marker
           if (ambulanceMarker && responseMap) {
               responseMap.removeLayer(ambulanceMarker);
           }

           // Add ambulance marker
           if (responseMap) {

               ambulanceMarker = L.marker([
                   ambulanceLat,
                   ambulanceLon
               ])
               .addTo(responseMap)
               .bindPopup(
                   "<strong>🚑 Ambulance</strong><br>" +
                   escapeHtml(ambulanceLocation)
               );
           }

           // Remove old hospital marker
           if (hospitalMarker && responseMap) {
               responseMap.removeLayer(hospitalMarker);
           }

           // Add hospital marker
           if (responseMap) {

               hospitalMarker = L.marker([
                   hospitalLat,
                   hospitalLon
               ])
               .addTo(responseMap)
               .bindPopup(
                   "<strong>🏥 " +
                   escapeHtml(hospitalName) +
                   "</strong>"
               );
           }

           // Fit map to route
           if (routeLine && responseMap) {

               responseMap.fitBounds(
                   routeLine.getBounds(),
                   {
                       padding: [40, 40]
                   }
               );
           }

           console.log("Route calculated successfully.");
           console.log("Distance:", distanceKm + " km");
           console.log("Duration:", durationMinutes + " min");

       } catch (error) {

           console.error(
               "Route calculation error:",
               error
           );

           setText(
               "routeDistance",
               "Not available"
           );

           setText(
               "routeDuration",
               "Not available"
           );
       }
   }
/* =========================================================
   MAP
   ========================================================= */

function initializeResponseMap() {

    const mapElement =
        document.getElementById(
            "responseMap"
        );


    if (!mapElement) return;


    if (
        typeof L === "undefined"
    ) {

        console.error(
            "Leaflet is not loaded."
        );

        return;

    }


    if (responseMap) {

        responseMap.remove();
        responseMap = null;

    }


    emergencyMarker = null;
    ambulanceMarker = null;
    hospitalMarker = null;
    routeLine = null;


    responseMap =
        L.map(
            "responseMap"
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            maxZoom: 19,

            attribution:
                "&copy; OpenStreetMap contributors"
        }
    ).addTo(responseMap);


    responseMap.setView(
        [12.9716, 77.5946],
        11
    );


    setTimeout(function () {

        responseMap.invalidateSize(
            true
        );

    }, 500);

}


/* =========================================================
   EMERGENCY MARKER
   ========================================================= */

function addEmergencyMarker() {

    if (
        !currentEmergency ||
        !responseMap
    ) {
        return;
    }


    geocodeLocation(
        currentEmergency.location
    )
    .then(
        function (coordinates) {

            if (
                !coordinates ||
                !responseMap
            ) {
                return;
            }


            emergencyMarker =
                L.marker(
                    [
                        coordinates.lat,
                        coordinates.lon
                    ]
                )
                .addTo(responseMap)
                .bindPopup(
                    "<strong>🚨 Emergency</strong><br>" +
                    escapeHtml(
                        currentEmergency.location
                    )
                );


            fitMapToMarkers();

        }
    );

}


/* =========================================================
   AMBULANCE MARKER
   ========================================================= */

function addAmbulanceMarker(

    latitude,
    longitude,
    ambulance

) {

    if (!responseMap) return;


    ambulanceMarker =
        L.marker(
            [
                latitude,
                longitude
            ]
        )
        .addTo(responseMap)
        .bindPopup(
            "<strong>🚑 " +
            escapeHtml(
                ambulance.ambulanceNumber ||
                "Ambulance"
            ) +
            "</strong><br>" +
            escapeHtml(
                ambulance.location || ""
            )
        );


    fitMapToMarkers();

}


/* =========================================================
   HOSPITAL MARKER
   ========================================================= */

function addHospitalMarker(

    latitude,
    longitude,
    hospital

) {

    if (!responseMap) return;


    hospitalMarker =
        L.marker(
            [
                latitude,
                longitude
            ]
        )
        .addTo(responseMap)
        .bindPopup(
            "<strong>🏥 " +
            escapeHtml(
                hospital.name ||
                "Hospital"
            ) +
            "</strong>"
        );


    fitMapToMarkers();

}


/* =========================================================
   FIT MAP TO MARKERS
   ========================================================= */

function fitMapToMarkers() {

    if (!responseMap) return;


    const markers = [];


    if (emergencyMarker) {
        markers.push(
            emergencyMarker
        );
    }


    if (ambulanceMarker) {
        markers.push(
            ambulanceMarker
        );
    }


    if (hospitalMarker) {
        markers.push(
            hospitalMarker
        );
    }


    if (markers.length === 0) {
        return;
    }


    const group =
        L.featureGroup(
            markers
        );


    responseMap.fitBounds(
        group.getBounds(),
        {
            padding: [40, 40],
            maxZoom: 15
        }
    );

}


/* =========================================================
   GEOCODING
   ========================================================= */

async function geocodeLocation(location) {

    try {

        const url =
            "https://nominatim.openstreetmap.org/search" +

            "?format=json" +

            "&limit=1" +

            "&q=" +

            encodeURIComponent(
                location + ", Bengaluru"
            );


        const response =
            await fetch(url);


        if (!response.ok) {
            return null;
        }


        const results =
            await response.json();


        if (
            !results ||
            results.length === 0
        ) {
            return null;
        }


        return {

            lat:
                parseFloat(
                    results[0].lat
                ),

            lon:
                parseFloat(
                    results[0].lon
                )

        };

    } catch (error) {

        console.error(
            "Geocoding error:",
            error
        );

        return null;

    }

}


/* =========================================================
   AMBULANCE NETWORK
   ========================================================= */

async function loadAmbulances() {

    const container =
        document.getElementById(
            "ambulanceList"
        );


    if (!container) return;


    container.innerHTML =
        '<div class="loading-state">' +
        'Loading ambulance network...' +
        '</div>';


    try {

        const response =
            await fetch(
                "/ambulances"
            );


        if (!response.ok) {

            throw new Error(
                "Ambulance API failed"
            );

        }


        const ambulances =
            await response.json();


        const count =
            document.getElementById(
                "ambulanceCount"
            );


        if (count) {

            count.textContent =
                ambulances.length;

        }


        if (!ambulances.length) {

            container.innerHTML =
                '<div class="empty-state">' +
                '<h3>No ambulances found</h3>' +
                '<p>No ambulance resources are registered.</p>' +
                '</div>';

            return;

        }


        let rows = "";


        ambulances.forEach(
            function (ambulance) {

                rows +=

                    "<tr>" +

                    "<td><strong>" +
                    escapeHtml(
                        ambulance.ambulanceNumber
                        || "—"
                    ) +
                    "</strong></td>" +

                    "<td>" +
                    escapeHtml(
                        ambulance.driverName
                        || "—"
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHtml(
                        ambulance.location
                        || "—"
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHtml(
                        ambulance.ambulanceType
                        || "Basic"
                    ) +
                    "</td>" +

                    "<td>" +
                    escapeHtml(
                        ambulance.status
                        || "AVAILABLE"
                    ) +
                    "</td>" +

                    "</tr>";

            }
        );


        container.innerHTML =

            "<table class='resource-table'>" +

            "<thead>" +

            "<tr>" +

            "<th>AMBULANCE</th>" +

            "<th>DRIVER</th>" +

            "<th>LOCATION</th>" +

            "<th>TYPE</th>" +

            "<th>STATUS</th>" +

            "</tr>" +

            "</thead>" +

            "<tbody>" +

            rows +

            "</tbody>" +

            "</table>";

    } catch (error) {

        console.error(error);


        container.innerHTML =

            "<div class='empty-state'>" +

            "<h3>Unable to load ambulances</h3>" +

            "<p>Make sure Spring Boot is running.</p>" +

            "</div>";

    }

}


/* =========================================================
   HOSPITAL NETWORK
   ========================================================= */

async function searchHospitals() {

    const input =
        document.getElementById(
            "hospitalSearchLocation"
        );


    const container =
        document.getElementById(
            "hospitalResults"
        );


    if (!input || !container) {
        return;
    }


    const location =
        input.value.trim();


    if (!location) {

        showToast(
            "Enter a location first.",
            "error"
        );

        return;
    }


    container.innerHTML =
        '<div class="loading-state">' +
        'Searching hospital resources...' +
        '</div>';


    try {

        const response =
            await fetch(
                "/hospitals/search?location=" +
                encodeURIComponent(
                    location
                )
            );


        if (!response.ok) {

            throw new Error(
                "Hospital API failed"
            );

        }


        const hospitals =
            await response.json();


        if (!hospitals.length) {

            container.innerHTML =
                '<div class="empty-state">' +
                '<h3>No hospitals found</h3>' +
                '<p>Try another locality.</p>' +
                '</div>';

            return;

        }


        container.innerHTML = "";


        hospitals.forEach(
            function (hospital) {

                const card =
                    document.createElement(
                        "div"
                    );


                card.className =
                    "hospital-card";


                card.innerHTML =

                    "<h3>" +

                    escapeHtml(
                        hospital.name
                        || "Hospital"
                    ) +

                    "</h3>" +

                    "<p>" +

                    escapeHtml(
                        hospital.address
                        || "Location available"
                    ) +

                    "</p>" +

                    "<div class='hospital-meta'>" +

                    "<span>" +

                    "Emergency: " +

                    escapeHtml(
                        hospital.emergency
                        || "Yes"
                    ) +

                    "</span>" +

                    "<span>" +

                    escapeHtml(
                        hospital.speciality
                        || "General"
                    ) +

                    "</span>" +

                    "</div>" +

                    "<button class='map-button'>" +

                    "📍 Open Map" +

                    "</button>";


                const button =
                    card.querySelector(
                        "button"
                    );


                button.addEventListener(
                    "click",
                    function () {

                        if (
                            hospital.latitude != null &&
                            hospital.longitude != null
                        ) {

                            const url =

                                "https://www.openstreetmap.org/" +

                                "?mlat=" +
                                hospital.latitude +

                                "&mlon=" +
                                hospital.longitude +

                                "#map=17/" +
                                hospital.latitude +
                                "/" +
                                hospital.longitude;


                            window.open(
                                url,
                                "_blank"
                            );

                        }

                    }
                );


                container.appendChild(
                    card
                );

            }
        );

    } catch (error) {

        console.error(error);


        container.innerHTML =

            "<div class='empty-state'>" +

            "<h3>Hospital search failed</h3>" +

            "<p>Check your Spring Boot application.</p>" +

            "</div>";

    }

}


/* =========================================================
   PATIENT FORM
   ========================================================= */

function setupPatientForm() {

    const form =
        document.getElementById(
            "patientForm"
        );


    if (!form) return;


    form.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const patient = {

                name:
                    document.getElementById(
                        "patientName"
                    ).value.trim(),

                age:
                    parseInt(
                        document.getElementById(
                            "patientAge"
                        ).value
                    ),

                gender:
                    document.getElementById(
                        "patientGender"
                    ).value,

                phone:
                    document.getElementById(
                        "patientPhone"
                    ).value.trim(),

                address:
                    document.getElementById(
                        "patientAddress"
                    ).value.trim()

            };


            try {

                const response =
                    await fetch(
                        "/patients",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    patient
                                )
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Patient registration failed"
                    );

                }


                form.reset();


                showToast(
                    "Patient registered successfully.",
                    "success"
                );


                loadPatients();

            } catch (error) {

                console.error(error);


                showToast(
                    "Unable to register patient.",
                    "error"
                );

            }

        }
    );

}


/* =========================================================
   LOAD PATIENTS
   ========================================================= */

async function loadPatients() {

    const container =
        document.getElementById(
            "patientList"
        );


    if (!container) return;


    container.innerHTML =
        '<div class="loading-state">' +
        'Loading patient records...' +
        '</div>';


    try {

        const response =
            await fetch(
                "/patients"
            );


        if (!response.ok) {

            throw new Error(
                "Patient API failed"
            );

        }


        const patients =
            await response.json();


        if (!patients.length) {

            container.innerHTML =
                "<div class='empty-state'>" +

                "<h3>No patient records</h3>" +

                "<p>Registered patients will appear here.</p>" +

                "</div>";

            return;

        }


        container.innerHTML = "";


        patients.forEach(
            function (patient) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "patient-item";


                item.innerHTML =

                    "<strong>" +

                    escapeHtml(
                        patient.name
                        || "Patient"
                    ) +

                    "</strong>" +

                    "<small>" +

                    "Age: " +

                    escapeHtml(
                        patient.age
                        || "—"
                    ) +

                    " | " +

                    escapeHtml(
                        patient.gender
                        || "—"
                    ) +

                    " | " +

                    escapeHtml(
                        patient.phone
                        || "—"
                    ) +

                    "</small>";


                container.appendChild(
                    item
                );

            }
        );

    } catch (error) {

        console.error(error);


        container.innerHTML =

            "<div class='empty-state'>" +

            "<h3>Unable to load patients</h3>" +

            "<p>Make sure Spring Boot is running.</p>" +

            "</div>";

    }

}


/* =========================================================
   EMERGENCY STATUS TRACKING
   ========================================================= */

function updateEmergencyStatus(status) {

    if (!currentEmergency) {

        showToast(
            "No active emergency found.",
            "error"
        );

        return;

    }


    currentEmergency.status =
        status;


    updateEmergencyStatusUI(
        status
    );


    /* Update backend status */

    if (currentEmergency.id) {

        updateEmergencyStatusBackend(
            currentEmergency.id,
            status
        );

    }


    showToast(
        "Emergency status updated to " +
        status.replace("_", " "),
        "success"
    );

}


async function updateEmergencyStatusBackend(
    id,
    status
) {

    try {

        const response =
            await fetch(
                "/emergencies/" +
                id +
                "/status",
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            status
                        )
                }
            );


        if (!response.ok) {

            console.error(
                "Status update failed"
            );

        }

    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

    }

}


/* =========================================================
   STATUS TRACKER UI
   ========================================================= */

function updateEmergencyStatusUI(status) {

    const steps =
        document.querySelectorAll(
            ".status-step"
        );


    if (!steps.length) {
        return;
    }


    const statusOrder = [

        "REPORTED",

        "DISPATCHED",

        "IN_TRANSIT",

        "REACHED",

        "RESOLVED"

    ];


    const currentIndex =
        statusOrder.indexOf(
            status
        );


    steps.forEach(
        function (step, index) {

            step.classList.remove(
                "completed",
                "current"
            );


            if (index < currentIndex) {

                step.classList.add(
                    "completed"
                );

            }


            if (index === currentIndex) {

                step.classList.add(
                    "current"
                );

            }

        }
    );

}


/* =========================================================
   AMBULANCE ASSIGNMENT
   ========================================================= */
   async function assignAmbulance() {

       const button =
           document.getElementById("assignAmbulanceButton");

       if (button) {
           button.textContent = "Ambulance Assigned";
           button.disabled = true;
       }

       const statusElement =
           document.getElementById("ambulanceStatus");

       if (statusElement) {
           statusElement.textContent = "DISPATCHED";
       }

       updateEmergencyStatusUI("DISPATCHED");

   }

/* =========================================================
   EMERGENCY HISTORY
   ========================================================= */

async function loadEmergencyHistory() {

    const container =
        document.getElementById(
            "historyList"
        );


    if (!container) return;


    container.innerHTML =
        '<div class="loading-state">' +
        'Loading emergency history...' +
        '</div>';


    try {

        const response =
            await fetch(
                "/emergencies"
            );


        if (!response.ok) {

            throw new Error(
                "Emergency history API failed"
            );

        }


        const emergencies =
            await response.json();


        if (!emergencies.length) {

            container.innerHTML =
                "<div class='empty-state'>" +

                "<h3>No emergency records</h3>" +

                "<p>Reported emergencies will appear here.</p>" +

                "</div>";

            return;

        }


        let rows = "";


        emergencies.forEach(
            function (emergency) {

                const caseId =
                    emergency.id
                        ? "EMG-" +
                          String(
                              emergency.id
                          ).padStart(
                              3,
                              "0"
                          )
                        : "EMG";


                rows +=

                    "<tr>" +

                    "<td><strong>" +

                    escapeHtml(
                        caseId
                    ) +

                    "</strong></td>" +

                    "<td>" +

                    escapeHtml(
                        emergency.emergencyType
                        || "—"
                    ) +

                    "</td>" +

                    "<td>" +

                    escapeHtml(
                        emergency.severity
                        || "—"
                    ) +

                    "</td>" +

                    "<td>" +

                    escapeHtml(
                        emergency.location
                        || "—"
                    ) +

                    "</td>" +

                    "<td>" +

                    "<span class='history-status'>" +

                    escapeHtml(
                        emergency.status
                        || "REPORTED"
                    ) +

                    "</span>" +

                    "</td>" +

                    "<td>" +

                    "<button " +

                    "class='small-button' " +

                    "onclick='viewEmergency(" +
                    emergency.id +
                    ")'>" +

                    "View" +

                    "</button>" +

                    "</td>" +

                    "</tr>";

            }
        );


        container.innerHTML =

            "<div class='table-wrapper'>" +

            "<table class='resource-table'>" +

            "<thead>" +

            "<tr>" +

            "<th>CASE ID</th>" +

            "<th>TYPE</th>" +

            "<th>SEVERITY</th>" +

            "<th>LOCATION</th>" +

            "<th>STATUS</th>" +

            "<th>ACTION</th>" +

            "</tr>" +

            "</thead>" +

            "<tbody>" +

            rows +

            "</tbody>" +

            "</table>" +

            "</div>";

    } catch (error) {

        console.error(
            "History error:",
            error
        );


        container.innerHTML =

            "<div class='empty-state'>" +

            "<h3>Unable to load history</h3>" +

            "<p>Make sure Spring Boot is running.</p>" +

            "</div>";

    }

}


/* =========================================================
   VIEW EMERGENCY
   ========================================================= */

async function viewEmergency(id) {

    try {

        const response =
            await fetch(
                "/emergencies"
            );


        if (!response.ok) {
            throw new Error(
                "Unable to load emergencies"
            );
        }


        const emergencies =
            await response.json();


        const emergency =
            emergencies.find(
                function (item) {

                    return item.id === id;

                }
            );


        if (!emergency) {

            showToast(
                "Emergency record not found.",
                "error"
            );

            return;

        }


        currentEmergency = {

            id:
                emergency.id,

            caseId:
                "EMG-" +
                String(
                    emergency.id
                ).padStart(
                    3,
                    "0"
                ),

            type:
                emergency.emergencyType,

            severity:
                emergency.severity,

            location:
                emergency.location,

            description:
                emergency.description,

            status:
                emergency.status
                || "REPORTED"

        };


        prepareResultScreen();


        updateEmergencyStatusUI(
            currentEmergency.status
        );


        showScreen(
            "result"
        );


        setTimeout(
            function () {

                initializeResponseMap();

                addEmergencyMarker();

            },
            300
        );


        loadResponseResources();


    } catch (error) {

        console.error(error);


        showToast(
            "Unable to open emergency.",
            "error"
        );

    }

}


/* =========================================================
   EMERGENCY REPORT
   ========================================================= */

function prepareEmergencyReport() {

    if (!currentEmergency) {

        setText(
            "reportCaseId",
            "No active emergency"
        );

        return;

    }


    setText(
        "reportCaseId",
        currentEmergency.caseId
    );


    setText(
        "reportType",
        currentEmergency.type
    );


    setText(
        "reportSeverity",
        currentEmergency.severity
    );


    setText(
        "reportLocation",
        currentEmergency.location
    );


    setText(
        "reportStatus",
        currentEmergency.status
        || "REPORTED"
    );


    setText(
        "reportDescription",
        currentEmergency.description
        || "No description provided"
    );


    if (selectedAmbulance) {

        setText(
            "reportAmbulance",
            selectedAmbulance.ambulanceNumber
        );

        setText(
            "reportDriver",
            selectedAmbulance.driverName
        );

        setText(
            "reportAmbulanceLocation",
            selectedAmbulance.location
        );

    } else {

        setText(
            "reportAmbulance",
            "Not assigned"
        );

        setText(
            "reportDriver",
            "Not assigned"
        );

        setText(
            "reportAmbulanceLocation",
            "Not available"
        );

    }


    if (selectedHospital) {

        setText(
            "reportHospital",
            selectedHospital.name
        );

        setText(
            "reportHospitalAddress",
            selectedHospital.address
        );

    } else {

        setText(
            "reportHospital",
            "Not selected"
        );

        setText(
            "reportHospitalAddress",
            "Not available"
        );

    }

}


/* =========================================================
   PRINT EMERGENCY REPORT
   ========================================================= */

function printEmergencyReport() {

    prepareEmergencyReport();

    window.print();

}


/* =========================================================
   OPEN HOSPITAL MAP
   ========================================================= */

function openHospitalMapFromResult() {

    if (!selectedHospital) {

        showToast(
            "Hospital information is not available.",
            "error"
        );

        return;

    }


    if (
        selectedHospital.latitude == null ||
        selectedHospital.longitude == null
    ) {

        showToast(
            "Hospital coordinates are not available.",
            "error"
        );

        return;

    }


    const url =
        "https://www.openstreetmap.org/" +

        "?mlat=" +
        selectedHospital.latitude +

        "&mlon=" +
        selectedHospital.longitude +

        "#map=17/" +

        selectedHospital.latitude +

        "/" +

        selectedHospital.longitude;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   UTILITY - SET TEXT
   ========================================================= */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value == null
                ? ""
                : value;

    }

}


/* =========================================================
   UTILITIES
   ========================================================= */

function normalize(value) {

    return String(
        value || ""
    )
    .toLowerCase()
    .replace(
        /[^a-z0-9]/g,
        ""
    );

}


function escapeHtml(value) {

    return String(
        value || ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(

    message,

    type = "success"

) {

    const toast =
        document.getElementById(
            "toast"
        );


    if (!toast) {

        alert(message);

        return;

    }


    toast.textContent =
        message;


    toast.className =
        "toast " +
        type +
        " show";


    setTimeout(
        function () {

            toast.classList.remove(
                "show"
            );

        },
        3500
    );

}