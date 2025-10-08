require('dotenv').config();
const axios = require('axios');
const express = require('express');

// --- Minimal Web Server for Render Deployment ---
const app = express();
const PORT = process.env.PORT || 3001;
app.get('/', (req, res) => res.status(200).send('Bus Simulation Service is running and healthy.'));
app.listen(PORT, () => console.log(`Keep-alive server for simulation is listening on port ${PORT}.`));


// --- Main Simulation Logic ---
const API_URL = process.env.PUBLIC_API_URL || 'http://localhost:3000';
const SCHEDULES_URL = `${API_URL}/api/v1/schedules`;
const LOCATIONS_URL = `${API_URL}/api/v1/locations`;
const OPERATOR_API_KEY = process.env.OPERATOR_API_KEY;

let activeSchedules = [];

// --- Detailed Realistic GPS Paths ---
const routePaths = {
    "177": [ // Kollupitiya -> Kaduwela
        { lat: 6.9120, lon: 79.8510 }, // Kollupitiya
        { lat: 6.9150, lon: 79.8600 }, // Town Hall
        { lat: 6.9120, lon: 79.8735 }, // Borella
        { lat: 6.9088, lon: 79.8970 }, // Rajagiriya
        { lat: 6.9048, lon: 79.9248 }, // Battaramulla
        { lat: 6.9100, lon: 79.9442 }, // Thalangama
        { lat: 6.9148, lon: 79.9729 }, // Malabe
        { lat: 6.9344, lon: 79.9885 }  // Kaduwela
    ],
    "122": [ // Colombo -> Avissawella (High-Level Road)
        { lat: 6.9350, lon: 79.8450 }, // Colombo
        { lat: 6.8655, lon: 79.8817 }, // Nugegoda
        { lat: 6.8488, lon: 79.9211 }, // Maharagama
        { lat: 6.8400, lon: 79.9780 }, // Kottawa
        { lat: 6.8333, lon: 80.0333 }, // Homagama
        { lat: 6.8430, lon: 80.0730 }, // Meepe
        { lat: 6.8975, lon: 80.2222 }  // Avissawella
    ],
    "01": [ // Colombo -> Kandy (A1 Road)
        { lat: 6.9350, lon: 79.8450 }, // Colombo
        { lat: 6.9630, lon: 79.9020 }, // Peliyagoda
        { lat: 7.0931, lon: 80.0158 }, // Kadawatha
        { lat: 7.1900, lon: 80.1700 }, // Nittambuwa
        { lat: 7.2180, lon: 80.2600 }, // Warakapola
        { lat: 7.2936, lon: 80.3775 }, // Kegalle
        { lat: 7.3200, lon: 80.4700 }, // Mawanella
        { lat: 7.2948, lon: 80.5921 }, // Peradeniya
        { lat: 7.2906, lon: 80.6337 }  // Kandy
    ],
    "04": [ // Colombo -> Puttalam
        { lat: 6.9350, lon: 79.8450 }, // Colombo
        { lat: 7.0500, lon: 79.8700 }, // Wattala
        { lat: 7.1500, lon: 79.8400 }, // Ja-Ela
        { lat: 7.2885, lon: 79.8585 }, // Negombo
        { lat: 7.5500, lon: 79.8300 }, // Marawila
        { lat: 7.8545, lon: 79.8378 }, // Chilaw
        { lat: 8.3000, lon: 79.8000 }, // Mundalama
        { lat: 8.5873, lon: 79.9989 }  // Puttalam
    ],
    "EX01": [ // Colombo -> Matara (Expressway)
        { lat: 6.9350, lon: 79.8450 }, // Colombo
        { lat: 6.8400, lon: 79.9780 }, // Kottawa Interchange
        { lat: 6.2700, lon: 80.1200 }, // Kurundugahahetekma Interchange
        { lat: 6.0590, lon: 80.2160 }, // Pinnaduwa Interchange (Galle)
        { lat: 5.9600, lon: 80.5000 }, // Godagama Interchange (Matara Exit)
        { lat: 5.9496, lon: 80.5468 }  // Matara Town
    ]
};

const fetchActiveSchedules = async () => {
    if (!OPERATOR_API_KEY) return; // Don't fetch if key is missing
    try {
        console.log('--- Fetching active schedules from the API... ---');
        const response = await axios.get(SCHEDULES_URL, { 
            params: { status: 'Departed' }
        });
        const schedules = response.data;

        if (schedules.length === 0) {
            console.log('No active schedules found.');
            activeSchedules = [];
            return;
        }

        activeSchedules = schedules.map(schedule => {
            console.log(`Found active trip: ${schedule.tripCode} on Route ${schedule.routeId.routeNumber}`);
            const path = routePaths[schedule.routeId.routeNumber] || routePaths["01"];
            return {
                scheduleId: schedule._id,
                path: path,
                currentLeg: 0
            };
        }).filter(s => s); // Filter out any nulls if a schedule has no route

    } catch (error) {
        console.error('Could not fetch active schedules:', error.response ? error.response.data.message : error.message);
    }
};

const sendLocationUpdate = async (scheduleId, coordinates) => {
    try {
        await axios.post(LOCATIONS_URL, {
            scheduleId: scheduleId,
            coordinates: {
                latitude: coordinates.lat,
                longitude: coordinates.lon
            }
        }, {
            headers: {
                'x-api-key': OPERATOR_API_KEY
            }
        });
        console.log(`Update for ${scheduleId}: Location sent.`);
    } catch (error) {
        console.error(`Error for ${scheduleId}:`, error.response ? error.response.data.message : error.message);
    }
};

const simulateBusMovement = () => {
    if (activeSchedules.length === 0) return;
    console.log(`\n--- Sending updates for ${activeSchedules.length} buses... ---`);
    activeSchedules.forEach(bus => {
        const currentLocation = bus.path[bus.currentLeg];
        sendLocationUpdate(bus.scheduleId, currentLocation);
        bus.currentLeg = (bus.currentLeg + 1) % bus.path.length;
    });
};

const startSimulation = async () => {
    console.log('Bus Location Simulation Starting...');
    if (!OPERATOR_API_KEY) {
        console.error('FATAL ERROR: OPERATOR_API_KEY is not defined. The simulation cannot run.');
        return; 
    }
    await fetchActiveSchedules();
    setInterval(simulateBusMovement, 20000);
    setInterval(fetchActiveSchedules, 300000);
};

startSimulation();
