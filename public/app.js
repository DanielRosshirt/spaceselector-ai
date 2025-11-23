// Global variables
let map;
let markers = [];
let properties = [];
let selectedPropertyId = null;
let googleMapsApiKey = '';

// Initialize the application
async function init() {
    try {
        // Get Google Maps API key from backend
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();
        
        if (config.success && config.data.googleMapsApiKey) {
            googleMapsApiKey = config.data.googleMapsApiKey;
            loadGoogleMapsScript();
        } else {
            document.getElementById('mapLoading').innerHTML = 
                '<p style="color: red;">⚠️ Google Maps API key not configured. Please add it to your .env file.</p>' +
                '<p style="font-size: 0.9rem; margin-top: 1rem;">Get your API key from:<br>' +
                '<a href="https://console.cloud.google.com/google/maps-apis" target="_blank">Google Cloud Console</a></p>';
        }

        // Load properties
        await loadProperties();

        // Set up event listeners
        setupEventListeners();
    } catch (error) {
        console.error('Initialization error:', error);
        showError('Failed to initialize application');
    }
}

// Load Google Maps script dynamically
function loadGoogleMapsScript() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}

// Initialize Google Map
function initMap() {
    // Default center (San Francisco Bay Area)
    const defaultCenter = { lat: 37.7749, lng: -122.4194 };

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: defaultCenter,
        styles: [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ]
    });

    // Hide loading message
    document.getElementById('mapLoading').style.display = 'none';

    // Display properties on map
    displayPropertiesOnMap();
}

// Load properties from API
async function loadProperties(filters = {}) {
    try {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`/api/properties?${queryParams}`);
        const data = await response.json();

        if (data.success) {
            properties = data.data;
            displayProperties();
            displayPropertiesOnMap();
            updateResultsSummary();
        } else {
            showError('Failed to load properties');
        }
    } catch (error) {
        console.error('Error loading properties:', error);
        showError('Failed to load properties');
    }
}

// Display properties in the sidebar list
function displayProperties() {
    const propertyList = document.getElementById('propertyList');

    if (properties.length === 0) {
        propertyList.innerHTML = `
            <div class="empty-state">
                <h3>No Properties Found</h3>
                <p>Try adjusting your search filters or run the scraper to add properties.</p>
                <p style="margin-top: 1rem; font-size: 0.9rem;">Run: <code>npm run scrape</code></p>
            </div>
        `;
        return;
    }

    propertyList.innerHTML = properties.map(property => `
        <div class="property-card" data-id="${property.id}" onclick="selectProperty(${property.id})">
            <img src="${property.image_url}" alt="${property.title}" class="property-image" 
                 onerror="this.src='https://via.placeholder.com/400x200?text=No+Image'">
            <span class="property-type">${property.property_type}</span>
            <h3 class="property-title">${property.title}</h3>
            <p class="property-address">📍 ${property.address}, ${property.city}, ${property.state}</p>
            <div class="property-details">
                <span class="property-price">$${formatPrice(property.price)}</span>
                <span class="property-size">${formatNumber(property.square_feet)} sq ft</span>
            </div>
        </div>
    `).join('');
}

// Display properties on Google Map
function displayPropertiesOnMap() {
    if (!map) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    // Create info window
    const infoWindow = new google.maps.InfoWindow();

    // Filter properties with valid coordinates
    const validProperties = properties.filter(p => p.latitude && p.longitude);

    if (validProperties.length === 0) return;

    // Add markers for each property
    validProperties.forEach(property => {
        const marker = new google.maps.Marker({
            position: { lat: property.latitude, lng: property.longitude },
            map: map,
            title: property.title,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#667eea',
                fillOpacity: 0.8,
                strokeColor: '#ffffff',
                strokeWeight: 2
            }
        });

        marker.addListener('click', () => {
            const content = `
                <div style="max-width: 250px;">
                    <h3 style="margin: 0 0 0.5rem 0; color: #667eea;">${property.title}</h3>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;">${property.address}</p>
                    <p style="margin: 0.5rem 0; font-weight: 600;">$${formatPrice(property.price)}</p>
                    <p style="margin: 0.25rem 0; font-size: 0.9rem;">${formatNumber(property.square_feet)} sq ft</p>
                    <button onclick="showPropertyDetail(${property.id})" 
                            style="margin-top: 0.5rem; padding: 0.5rem 1rem; background: #667eea; 
                                   color: white; border: none; border-radius: 4px; cursor: pointer;">
                        View Details
                    </button>
                </div>
            `;
            infoWindow.setContent(content);
            infoWindow.open(map, marker);
            selectProperty(property.id);
        });

        markers.push(marker);
    });

    // Fit map to show all markers
    if (markers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        validProperties.forEach(property => {
            bounds.extend({ lat: property.latitude, lng: property.longitude });
        });
        map.fitBounds(bounds);
    }
}

// Select a property (highlight in list and map)
function selectProperty(propertyId) {
    selectedPropertyId = propertyId;

    // Update card highlighting
    document.querySelectorAll('.property-card').forEach(card => {
        card.classList.remove('active');
        if (parseInt(card.dataset.id) === propertyId) {
            card.classList.add('active');
            // Scroll into view
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // Update marker highlighting
    const property = properties.find(p => p.id === propertyId);
    if (property && property.latitude && property.longitude) {
        markers.forEach(marker => {
            const markerPos = marker.getPosition();
            if (Math.abs(markerPos.lat() - property.latitude) < 0.0001 &&
                Math.abs(markerPos.lng() - property.longitude) < 0.0001) {
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 12,
                    fillColor: '#764ba2',
                    fillOpacity: 1,
                    strokeColor: '#ffffff',
                    strokeWeight: 3
                });
            } else {
                marker.setIcon({
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: '#667eea',
                    fillOpacity: 0.8,
                    strokeColor: '#ffffff',
                    strokeWeight: 2
                });
            }
        });
    }
}

// Show property detail modal
function showPropertyDetail(propertyId) {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    const modal = document.getElementById('propertyModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <img src="${property.image_url}" alt="${property.title}" class="modal-image"
             onerror="this.src='https://via.placeholder.com/600x300?text=No+Image'">
        <span class="property-type">${property.property_type}</span>
        <h2 class="modal-title">${property.title}</h2>
        
        <div class="modal-info">
            <div class="info-item">
                <div class="info-label">Price</div>
                <div class="info-value">$${formatPrice(property.price)}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Square Feet</div>
                <div class="info-value">${formatNumber(property.square_feet)} sq ft</div>
            </div>
            <div class="info-item">
                <div class="info-label">Location</div>
                <div class="info-value">${property.city}, ${property.state}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Price per Sq Ft</div>
                <div class="info-value">$${Math.round(property.price / property.square_feet)}</div>
            </div>
        </div>

        <div class="modal-description">
            <h3>Description</h3>
            <p>${property.description || 'No description available.'}</p>
        </div>

        <div>
            <h3>Address</h3>
            <p>${property.address}, ${property.city}, ${property.state} ${property.zip_code}</p>
        </div>

        ${property.source_url && property.source_url !== '#' ? 
            `<a href="${property.source_url}" target="_blank" class="modal-link">View on ${property.source_site} →</a>` 
            : ''}
    `;

    modal.classList.add('show');
}

// Close modal
function closeModal() {
    document.getElementById('propertyModal').classList.remove('show');
}

// Set up event listeners
function setupEventListeners() {
    // Search form
    document.getElementById('searchForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const filters = {
            city: document.getElementById('city').value,
            state: document.getElementById('state').value.toUpperCase(),
            propertyType: document.getElementById('propertyType').value,
            minPrice: document.getElementById('minPrice').value,
            maxPrice: document.getElementById('maxPrice').value,
            minSize: document.getElementById('minSize').value,
            maxSize: document.getElementById('maxSize').value
        };

        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key] || filters[key] === 'all') {
                delete filters[key];
            }
        });

        await loadProperties(filters);
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        document.getElementById('searchForm').reset();
        loadProperties();
    });

    // Modal close button
    document.getElementById('closeModal').addEventListener('click', closeModal);

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('propertyModal');
        if (event.target === modal) {
            closeModal();
        }
    });

    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// Update results summary
function updateResultsSummary() {
    const summary = document.getElementById('resultsSummary');
    const count = properties.length;
    const withCoords = properties.filter(p => p.latitude && p.longitude).length;

    summary.innerHTML = `
        <p><strong>${count}</strong> ${count === 1 ? 'property' : 'properties'} found</p>
        ${count !== withCoords ? `<p style="font-size: 0.85rem; color: #999; margin-top: 0.5rem;">
            ${withCoords} with map locations
        </p>` : ''}
    `;
}

// Utility: Format price
function formatPrice(price) {
    if (!price) return 'N/A';
    return price.toLocaleString('en-US');
}

// Utility: Format number
function formatNumber(num) {
    if (!num) return 'N/A';
    return num.toLocaleString('en-US');
}

// Show error message
function showError(message) {
    const propertyList = document.getElementById('propertyList');
    propertyList.innerHTML = `
        <div class="empty-state">
            <h3 style="color: #e74c3c;">Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

