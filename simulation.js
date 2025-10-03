const axios = require('axios');

// Use an environment variable for the API URL, with localhost as a fallback
const API_URL = process.env.PUBLIC_API_URL || 'http://localhost:3000';

const SCHEDULES_URL = `${API_URL}/api/v1/schedules`;
const LOCATIONS_URL = `${API_URL}/api/v1/locations`;

// This array will be populated automatically by fetching from the API
let activeSchedules = [];

// --- Realistic Path Data ---
// Store realistic paths with detailed stops for known route numbers
const routePaths = {
    "177": [ // Kaduwela -> Kollupitiya
        { lat: 6.9344, lon: 79.9885 }, // Kaduwela Bus Stand
        { lat: 6.9148, lon: 79.9729 }, // Malabe Junction
        { lat: 6.9100, lon: 79.9442 }, // Thalahena Junction
        { lat: 6.9048, lon: 79.9248 }, // Battaramulla
        { lat: 6.9088, lon: 79.8970 }, // Rajagiriya
        { lat: 6.9120, lon: 79.8735 }, // Borella (Castle Street)
        { lat: 6.9150, lon: 79.8600 }, // Town Hall
        { lat: 6.9120, lon: 79.8510 }  // Kollupitiya (Liberty Plaza)
    ],
    "01": [ // Colombo -> Avissawella
        { lat: 6.9350, lon: 79.8450 }, // Colombo (Pettah)
        { lat: 6.8919, lon: 79.8583 }, // Kirulapone
        { lat: 6.8655, lon: 79.8817 }, // Nugegoda
        { lat: 6.8488, lon: 79.9211 }, // Maharagama
        { lat: 6.8400, lon: 79.9780 }, // Kottawa
        { lat: 6.8333, lon: 80.0333 }, // Homagama
        { lat: 6.8610, lon: 80.1200 }, // Hanwella
        { lat: 6.8975, lon: 80.2222 }  // Avissawella
    ],
    "03": [ // Colombo -> Kandy
        { lat: 6.9350, lon: 79.8450 }, // Colombo (Pettah)
        { lat: 6.9630, lon: 79.9020 }, // Peliyagoda
        { lat: 7.0931, lon: 80.0158 }, // Kadawatha
        { lat: 7.1900, lon: 80.1700 }, // Nittambuwa
        { lat: 7.2180, lon: 80.2600 }, // Warakapola
        { lat: 7.2936, lon: 80.3775 }, // Kegalle
        { lat: 7.3200, lon: 80.4700 }, // Mawanella
        { lat: 7.2906, lon: 80.6337 }  // Kandy
    ],
    "32": [ // Colombo -> Puttalam
        { lat: 6.9350, lon: 79.8450 }, // Colombo (Pettah)
        { lat: 7.0500, lon: 79.8700 }, // Wattala
        { lat: 7.1500, lon: 79.8400 }, // Ja-Ela
        { lat: 7.2885, lon: 79.8585 }, // Negombo
        { lat: 7.5500, lon: 79.8300 }, // Marawila
        { lat: 7.8545, lon: 79.8378 }, // Chilaw
        { lat: 8.5873, lon: 79.9989 }  // Puttalam
    ],
    "02": [ // Colombo -> Matara
        { lat: 6.9350, lon: 79.8450 }, // Colombo (Pettah)
        { lat: 6.8523, lon: 79.8610 }, // Dehiwala
        { lat: 6.7968, lon: 79.8883 }, // Moratuwa
        { lat: 6.7000, lon: 79.9300 }, // Panadura
        { lat: 6.3333, lon: 80.0000 }, // Aluthgama
        { lat: 6.0535, lon: 80.2210 }, // Galle
        { lat: 5.9496, lon: 80.5468 }  // Matara
    ]
};

// --- Dynamic Schedule Fetching ---
const fetchActiveSchedules = async () => {
    try {
        console.log('--- 🔎 Fetching active schedules from the API... ---');
        const response = await axios.get(SCHEDULES_URL, { params: { status: 'Departed' } });
        const schedules = response.data;

        if (schedules.length === 0) {
            console.log('No active schedules found.');
            activeSchedules = [];
            return;
        }

        activeSchedules = schedules.map(schedule => {
            console.log(`✅ Found active trip: ${schedule.tripCode} on Route ${schedule.routeId.routeNumber}`);
            // Assign the correct path based on the route number
            const path = routePaths[schedule.routeId.routeNumber] || routePaths["01"]; // Use a default path if a specific one isn't found
            return {
                scheduleId: schedule._id,
                path: path,
                currentLeg: 0
            };
        });
    } catch (error) {
        console.error('❌ Could not fetch active schedules:', error.message);
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
        });
        console.log(`🛰️ Update for ${scheduleId}: Location sent.`);
    } catch (error) {
        // --- Heavy-Duty Error Logging ---
        console.error(`❌ An error occurred for schedule ${scheduleId}:`);
        if (error.response) {
            // The request was made and the server responded with a status code
            console.error('Status:', error.response.status);
            console.error('Data:', JSON.stringify(error.response.data));
        } else if (error.request) {
            // The request was made but no response was received
            console.error('Request Error: No response received. Is the API server still running?');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Axios Setup Error:', error.message);
        }
    }
};

const simulateBusMovement = () => {
    if (activeSchedules.length === 0) return;
    console.log(`\n--- 🚍 Sending updates for ${activeSchedules.length} buses... ---`);
    activeSchedules.forEach(bus => {
        const currentLocation = bus.path[bus.currentLeg];
        sendLocationUpdate(bus.scheduleId, currentLocation);
        bus.currentLeg = (bus.currentLeg + 1) % bus.path.length;
    });
};

// --- Start the Simulation ---
const startSimulation = async () => {
    console.log('🚀 Bus Location Simulation Starting...');
    await fetchActiveSchedules();
    setInterval(simulateBusMovement, 20000);
    setInterval(fetchActiveSchedules, 300000); // Re-fetch every 5 minutes
};

startSimulation();