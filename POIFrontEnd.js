(() => {
    // Lazy load Google Maps API
    const loadGoogleMapsAPI = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places';
            script.async = true;
            script.onload = resolve;
            document.head.appendChild(script);
        });
    };

    // Initialize the widget
    const initWidget = async () => {
        await loadGoogleMapsAPI();

        // Create floating UI
        const widgetContainer = document.createElement('div');
        widgetContainer.style.position = 'fixed';
        widgetContainer.style.bottom = '20px';
        widgetContainer.style.right = '20px';
        widgetContainer.style.background = 'white';
        widgetContainer.style.padding = '10px';
        widgetContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        widgetContainer.style.borderRadius = '5px';
        widgetContainer.style.zIndex = '1000';
        widgetContainer.innerHTML = `
            <label>Point 1: <input id="point1" type="text" /></label>
            <label>Point 2: <input id="point2" type="text" /></label>
            <button id="calculateRoute">Check Routes</button>
            <div id="routeResults"></div>
        `;
        document.body.appendChild(widgetContainer);

        // Add Google Maps Autocomplete
        const autocomplete1 = new google.maps.places.Autocomplete(document.getElementById('point1'));
        const autocomplete2 = new google.maps.places.Autocomplete(document.getElementById('point2'));

        // Capture property address dynamically
        const propertyAddress = document.querySelector('meta[property-address]')?.content || 'Unknown Address';

        // Handle route calculation
        document.getElementById('calculateRoute').addEventListener('click', async () => {
            const point1 = document.getElementById('point1').value;
            const point2 = document.getElementById('point2').value;

            if (!point1 || !point2) {
                alert('Please enter both points of interest.');
                return;
            }

            try {
                const response = await fetch(`https://your-backend.com/api/routes?property=${encodeURIComponent(propertyAddress)}&point1=${encodeURIComponent(point1)}&point2=${encodeURIComponent(point2)}`);
                const data = await response.json();

                // Display results in a Google Maps-style overlay
                const resultsContainer = document.getElementById('routeResults');
                resultsContainer.innerHTML = `
                    <p><strong>Route to ${point1}:</strong> ${data.routes[0].duration}, ${data.routes[0].distance}</p>
                    <p><strong>Route to ${point2}:</strong> ${data.routes[1].duration}, ${data.routes[1].distance}</p>
                `;
            } catch (error) {
                console.error('Error fetching route data:', error);
                alert('Failed to fetch route data. Please try again later.');
            }
        });
    };

    // Initialize the widget when the DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWidget);
    } else {
        initWidget();
    }
})();
