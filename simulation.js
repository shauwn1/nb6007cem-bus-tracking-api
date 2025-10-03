const axios = require('axios');
const express = require('express'); // Required for the keep-alive server

// --- Minimal Web Server Setup ---
// This part is essential for free hosting platforms like Render.
const app = express();
const PORT = process.env.PORT || 3001; // Render provides the PORT environment variable
app.get('/', (req, res) => {
  res.status(200).send('Bus Simulation Service is running and healthy.');
});
app.listen(PORT, () => {
  console.log(`Keep-alive server listening on port ${PORT}.`);
});
// --- End of Server Setup ---


// --- Main Simulation Logic ---
// Use an environment variable for the API URL, with localhost as a fallback.
const API_URL = process.env.PUBLIC_API_URL || 'http://localhost:3000';
const SCHEDULES_URL = `${API_URL}/api/v1/schedules`;
const LOCATIONS_URL = `${API_URL}/api/v1/locations`;

let activeSchedules = [];

// Realistic GPS paths for different routes.
const routePaths = {
    "177": [ // Kaduwela -> Kollupitiya
        { lat: 6.9344, lon: 79.9885 }, { lat: 6.9148, lon: 79.9729 },
        { lat: 6.9100, lon: 79.9442 }, { lat: 6.9048, lon: 79.9248 },
        { lat: 6.9088, lon: 79.8970 }, { lat: 6.9120, lon: 79.8735 },
        { lat: 6.9150, lon: 79.8600 }, { lat: 6.9120, lon: 79.8510 }
    ],
    "01": [ // Colombo -> Avissawella
        { lat: 6.9350, lon: 79.8450 }, { lat: 6.8919, lon: 79.8583 },
        { lat: 6.8655, lon: 79.8817 }, { lat: 6.8488, lon: 79.9211 },
        { lat: 6.8400, lon: 79.9780 }, { lat: 6.8333, lon: 80.0333 },
        { lat: 6.8610, lon: 80.1200 }, { lat: 6.8975, lon: 80.2222 }
    ],
    "03": [ // Colombo -> Kandy
        { lat: 6.9350, lon: 79.8450 }, { lat: 6.9630, lon: 79.9020 },
        { lat: 7.0931, lon: 80.0158 }, { lat: 7.1900, lon: 80.1700 },
        { lat: 7.2180, lon: 80.2600 }, { lat: 7.2936, lon: 80.3775 },
        { lat: 7.3200, lon: 80.4700 }, { lat: 7.2906, lon: 80.6337 }
    ],
    "32": [ // Colombo -> Puttalam
        { lat: 6.9350, lon: 79.8450 }, { lat: 7.0500, lon: 79.8700 },
        { lat: 7.1500, lon: 79.8400 }, { lat: 7.2885, lon: 79.8585 },
        { lat: 7.5500, lon: 79.8300 }, { lat: 7.8545, lon: 79.8378 },
        { lat: 8.5873, lon: 79.9989 }
    ],
    "02": [ // Colombo -> Matara
        { lat: 6.9350, lon: 79.8450 }, { lat: 6.8523, lon: 79.8610 },
        { lat: 6.7968, lon: 79.8883 }, { lat: 6.7000, lon: 79.9300 },
        { lat: 6.3333, lon: 80.0000 }, { lat: 6.0535, lon: 80.2210 },
        { lat: 5.9496, lon: 80.5468 }
    ]
};

const fetchActiveSchedules = async () => {
    try {
        console.log('--- Fetching active schedules from the API... ---');
        const response = await axios.get(SCHEDULES_URL, { params: { status: 'Departed' } });
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
        });
    } catch (error) {
        console.error('Could not fetch active schedules:', error.message);
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
    await fetchActiveSchedules();
    setInterval(simulateBusMovement, 20000);
    setInterval(fetchActiveSchedules, 300000);
};

startSimulation();