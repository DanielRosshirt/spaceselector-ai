const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
const db = new Database('properties.db');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    latitude REAL,
    longitude REAL,
    price REAL,
    square_feet INTEGER,
    property_type TEXT,
    description TEXT,
    image_url TEXT,
    source_url TEXT,
    source_site TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

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

    let query = 'SELECT * FROM properties WHERE 1=1';
    const params = [];

    if (minPrice) {
      query += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      query += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }
    if (minSize) {
      query += ' AND square_feet >= ?';
      params.push(parseInt(minSize));
    }
    if (maxSize) {
      query += ' AND square_feet <= ?';
      params.push(parseInt(maxSize));
    }
    if (propertyType && propertyType !== 'all') {
      query += ' AND property_type = ?';
      params.push(propertyType);
    }
    if (city) {
      query += ' AND city LIKE ?';
      params.push(`%${city}%`);
    }
    if (state) {
      query += ' AND state = ?';
      params.push(state);
    }

    query += ' ORDER BY created_at DESC';

    const stmt = db.prepare(query);
    const properties = stmt.all(...params);
    
    res.json({ success: true, data: properties });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get a single property by ID
app.get('/api/properties/:id', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM properties WHERE id = ?');
    const property = stmt.get(req.params.id);
    
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
    const {
      title,
      address,
      city,
      state,
      zip_code,
      latitude,
      longitude,
      price,
      square_feet,
      property_type,
      description,
      image_url,
      source_url,
      source_site
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO properties 
      (title, address, city, state, zip_code, latitude, longitude, price, 
       square_feet, property_type, description, image_url, source_url, source_site)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      title, address, city, state, zip_code, latitude, longitude, price,
      square_feet, property_type, description, image_url, source_url, source_site
    );

    res.json({ 
      success: true, 
      data: { id: result.lastInsertRowid, ...req.body } 
    });
  } catch (error) {
    console.error('Error adding property:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Delete all properties (for testing)
app.delete('/api/properties/all', (req, res) => {
  try {
    db.prepare('DELETE FROM properties').run();
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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api/properties`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close();
  console.log('\nDatabase connection closed.');
  process.exit(0);
});

