const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory data storage for Vercel serverless environment
// (SQLite doesn't work in serverless - no persistent filesystem)
let properties = [
  {
    id: 1,
    title: "Modern Office Space Downtown",
    address: "123 Main St",
    city: "San Francisco",
    state: "CA",
    zip_code: "94102",
    latitude: 37.7858,
    longitude: -122.4068,
    price: 5000000,
    square_feet: 10000,
    property_type: "Office",
    description: "Prime downtown office space with modern amenities and excellent visibility.",
    image_url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Retail Space on High Street",
    address: "456 Market St",
    city: "San Francisco",
    state: "CA",
    zip_code: "94103",
    latitude: 37.7898,
    longitude: -122.4005,
    price: 3500000,
    square_feet: 5000,
    property_type: "Retail",
    description: "High-traffic retail location with large display windows and customer parking.",
    image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Industrial Warehouse Complex",
    address: "789 Industrial Blvd",
    city: "Oakland",
    state: "CA",
    zip_code: "94601",
    latitude: 37.7955,
    longitude: -122.2370,
    price: 8000000,
    square_feet: 50000,
    property_type: "Industrial",
    description: "Large warehouse with loading docks, high ceilings, and excellent freeway access.",
    image_url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Mixed-Use Development Site",
    address: "321 Broadway",
    city: "Oakland",
    state: "CA",
    zip_code: "94612",
    latitude: 37.8044,
    longitude: -122.2712,
    price: 12000000,
    square_feet: 25000,
    property_type: "Mixed Use",
    description: "Prime development opportunity in growing urban area. Zoned for mixed use.",
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Medical Office Building",
    address: "555 Health Dr",
    city: "San Jose",
    state: "CA",
    zip_code: "95110",
    latitude: 37.3387,
    longitude: -121.8853,
    price: 6500000,
    square_feet: 15000,
    property_type: "Medical",
    description: "Well-maintained medical office building with ample parking near major hospital.",
    image_url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    title: "Restaurant Space with Kitchen",
    address: "888 Food Court Way",
    city: "San Jose",
    state: "CA",
    zip_code: "95112",
    latitude: 37.3541,
    longitude: -121.9552,
    price: 2500000,
    square_feet: 4000,
    property_type: "Restaurant",
    description: "Fully equipped restaurant space with commercial kitchen and outdoor patio.",
    image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    title: "Tech Office Campus",
    address: "999 Innovation Pkwy",
    city: "Palo Alto",
    state: "CA",
    zip_code: "94301",
    latitude: 37.4419,
    longitude: -122.1430,
    price: 25000000,
    square_feet: 75000,
    property_type: "Office",
    description: "State-of-the-art office campus with cafeteria, gym, and collaborative spaces.",
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    title: "Shopping Center Anchor Space",
    address: "111 Retail Plaza",
    city: "San Mateo",
    state: "CA",
    zip_code: "94401",
    latitude: 37.5630,
    longitude: -122.3255,
    price: 4200000,
    square_feet: 12000,
    property_type: "Retail",
    description: "Anchor tenant space in busy shopping center with excellent foot traffic.",
    image_url: "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800",
    source_url: "#",
    source_site: "Sample",
    created_at: new Date().toISOString()
  }
];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// API Routes

// Get all properties with optional filters
app.get('/api/properties', (req, res) => {
  try {
    const { 
      minPrice, 
      maxPrice, 
      minSize, 
      maxSize, 
      propertyType,
      city,
      state 
    } = req.query;

    let filteredProperties = [...properties];

    if (minPrice) {
      filteredProperties = filteredProperties.filter(p => p.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filteredProperties = filteredProperties.filter(p => p.price <= parseFloat(maxPrice));
    }
    if (minSize) {
      filteredProperties = filteredProperties.filter(p => p.square_feet >= parseInt(minSize));
    }
    if (maxSize) {
      filteredProperties = filteredProperties.filter(p => p.square_feet <= parseInt(maxSize));
    }
    if (propertyType && propertyType !== 'all') {
      filteredProperties = filteredProperties.filter(p => p.property_type === propertyType);
    }
    if (city) {
      filteredProperties = filteredProperties.filter(p => 
        p.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    if (state) {
      filteredProperties = filteredProperties.filter(p => p.state === state.toUpperCase());
    }
    
    res.json({ success: true, data: filteredProperties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single property by ID
app.get('/api/properties/:id', (req, res) => {
  try {
    const property = properties.find(p => p.id === parseInt(req.params.id));
    
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    
    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a new property
app.post('/api/properties', (req, res) => {
  try {
    const newProperty = {
      id: properties.length + 1,
      ...req.body,
      created_at: new Date().toISOString()
    };

    properties.push(newProperty);

    res.json({ 
      success: true, 
      data: newProperty
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete all properties (for testing)
app.delete('/api/properties/all', (req, res) => {
  try {
    properties = [];
    res.json({ success: true, message: 'All properties deleted' });
  } catch (error) {
    console.error('Error deleting properties:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get API key for frontend
app.get('/api/config', (req, res) => {
  res.json({ 
    success: true, 
    data: { 
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY 
    } 
  });
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Export for Vercel serverless
module.exports = app;

// Start server for local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`API available at http://localhost:${PORT}/api/properties`);
  });
}

