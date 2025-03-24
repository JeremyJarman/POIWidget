const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 4000;

// Middleware to parse JSON requests
app.use(express.json());

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = '';

// Route to calculate directions
app.post('/api/routes', async (req, res) => {
    const { property, point1, point2 } = req.body;

    if (!property || !point1 || !point2) {
        return res.status(400).json({ error: 'Missing required parameters.' });
    }

    try {
        // Fetch route to Point 1
        const route1 = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: property,
                destination: point1,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        console.log('Route 1 Response:', JSON.stringify(route1.data, null, 2)); // Log the full response

        // Fetch route to Point 2
        const route2 = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
            params: {
                origin: property,
                destination: point2,
                key: GOOGLE_MAPS_API_KEY
            }
        });
        console.log('Route 2 Response:', JSON.stringify(route2.data, null, 2)); // Log the full response

        // Extract relevant data
        const routes = [
            {
                to: point1,
                duration: route1.data.routes[0]?.legs[0]?.duration?.text || 'N/A',
                distance: route1.data.routes[0]?.legs[0]?.distance?.text || 'N/A'
            },
            {
                to: point2,
                duration: route2.data.routes[0]?.legs[0]?.duration?.text || 'N/A',
                distance: route2.data.routes[0]?.legs[0]?.distance?.text || 'N/A'
            }
        ];

        // Send response
        res.json({ routes });
    } catch (error) {
        console.error('Error fetching directions:', error.message);
        res.status(500).json({ error: 'Failed to fetch route data.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});