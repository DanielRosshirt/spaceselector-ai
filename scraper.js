const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio');
const Database = require('better-sqlite3');

/**
 * IMPORTANT NOTE ABOUT WEB SCRAPING:
 * 
 * Web scraping should be done responsibly and ethically. Before scraping any website:
 * 1. Check the website's Terms of Service
 * 2. Review their robots.txt file
 * 3. Consider using official APIs when available
 * 4. Implement rate limiting to avoid overloading servers
 * 5. Respect copyright and data ownership
 * 
 * LoopNet and similar commercial real estate sites may have restrictions on scraping.
 * Consider using their official APIs or data feeds if available.
 * 
 * This scraper is provided for educational purposes and demonstration.
 */

class PropertyScraper {
  constructor() {
    this.db = new Database('properties.db');
    this.browser = null;
    this.initDatabase();
  }

  initDatabase() {
    // Create tables if they don't exist
    this.db.exec(`
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
  }

  async init() {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
    this.db.close();
  }

  // Geocode address using a simple geocoding service
  async geocodeAddress(address) {
    try {
      // Using OpenStreetMap's Nominatim API (free, but rate limited)
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: address,
          format: 'json',
          limit: 1
        },
        headers: {
          'User-Agent': 'SpaceSelector.ai Property Finder'
        }
      });

      if (response.data && response.data.length > 0) {
        return {
          latitude: parseFloat(response.data[0].lat),
          longitude: parseFloat(response.data[0].lon)
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error.message);
    }
    return { latitude: null, longitude: null };
  }

  // Save property to database
  saveProperty(property) {
    const stmt = this.db.prepare(`
      INSERT INTO properties 
      (title, address, city, state, zip_code, latitude, longitude, price, 
       square_feet, property_type, description, image_url, source_url, source_site)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    try {
      const result = stmt.run(
        property.title,
        property.address,
        property.city,
        property.state,
        property.zip_code,
        property.latitude,
        property.longitude,
        property.price,
        property.square_feet,
        property.property_type,
        property.description,
        property.image_url,
        property.source_url,
        property.source_site
      );
      console.log(`✓ Saved: ${property.title}`);
      return result.lastInsertRowid;
    } catch (error) {
      console.error(`✗ Error saving property: ${error.message}`);
      return null;
    }
  }

  // Generic scraper for demonstration purposes
  async scrapeSampleProperties() {
    console.log('Generating sample properties for demonstration...\n');

    // Sample data for demonstration (replace with actual scraping)
    const sampleProperties = [
      {
        title: 'Modern Office Space Downtown',
        address: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        price: 5000000,
        square_feet: 10000,
        property_type: 'Office',
        description: 'Prime downtown office space with modern amenities and excellent visibility.',
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Retail Space on High Street',
        address: '456 Market St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94103',
        price: 3500000,
        square_feet: 5000,
        property_type: 'Retail',
        description: 'High-traffic retail location with large display windows and customer parking.',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Industrial Warehouse Complex',
        address: '789 Industrial Blvd',
        city: 'Oakland',
        state: 'CA',
        zip_code: '94601',
        price: 8000000,
        square_feet: 50000,
        property_type: 'Industrial',
        description: 'Large warehouse with loading docks, high ceilings, and excellent freeway access.',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Mixed-Use Development Site',
        address: '321 Broadway',
        city: 'Oakland',
        state: 'CA',
        zip_code: '94612',
        price: 12000000,
        square_feet: 25000,
        property_type: 'Mixed Use',
        description: 'Prime development opportunity in growing urban area. Zoned for mixed use.',
        image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Medical Office Building',
        address: '555 Health Dr',
        city: 'San Jose',
        state: 'CA',
        zip_code: '95110',
        price: 6500000,
        square_feet: 15000,
        property_type: 'Medical',
        description: 'Well-maintained medical office building with ample parking near major hospital.',
        image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Restaurant Space with Kitchen',
        address: '888 Food Court Way',
        city: 'San Jose',
        state: 'CA',
        zip_code: '95112',
        price: 2500000,
        square_feet: 4000,
        property_type: 'Restaurant',
        description: 'Fully equipped restaurant space with commercial kitchen and outdoor patio.',
        image_url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Tech Office Campus',
        address: '999 Innovation Pkwy',
        city: 'Palo Alto',
        state: 'CA',
        zip_code: '94301',
        price: 25000000,
        square_feet: 75000,
        property_type: 'Office',
        description: 'State-of-the-art office campus with cafeteria, gym, and collaborative spaces.',
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Shopping Center Anchor Space',
        address: '111 Retail Plaza',
        city: 'San Mateo',
        state: 'CA',
        zip_code: '94401',
        price: 4200000,
        square_feet: 12000,
        property_type: 'Retail',
        description: 'Anchor tenant space in busy shopping center with excellent foot traffic.',
        image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
        source_site: 'Sample'
      }
    ];

    let savedCount = 0;

    for (const property of sampleProperties) {
      // Geocode the address
      const fullAddress = `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`;
      console.log(`Geocoding: ${fullAddress}`);
      
      const coords = await this.geocodeAddress(fullAddress);
      property.latitude = coords.latitude;
      property.longitude = coords.longitude;
      property.source_url = '#';

      // Add delay to respect rate limits
      await this.delay(1000);

      // Save to database
      if (this.saveProperty(property)) {
        savedCount++;
      }
    }

    console.log(`\n✓ Successfully saved ${savedCount} properties`);
  }

  // Example scraper for LoopNet (DEMONSTRATION ONLY - may violate TOS)
  async scrapeLoopNet(location, propertyType = 'all') {
    console.log('⚠️  NOTE: Actual LoopNet scraping may violate their Terms of Service.');
    console.log('⚠️  Consider using their official API or data feeds instead.');
    console.log('⚠️  This is a demonstration structure only.\n');

    // In a real implementation, you would:
    // 1. Check robots.txt
    // 2. Respect rate limits
    // 3. Use official APIs when available
    // 4. Handle pagination
    // 5. Parse property details properly

    console.log('For legal and ethical reasons, using sample data instead.');
    await this.scrapeSampleProperties();
  }

  // Utility: delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function main() {
  const scraper = new PropertyScraper();
  
  try {
    await scraper.init();
    
    console.log('='.repeat(60));
    console.log('SpaceSelector.ai Property Scraper');
    console.log('='.repeat(60));
    console.log();

    // For demonstration, we'll scrape sample properties
    await scraper.scrapeSampleProperties();

    console.log('\n' + '='.repeat(60));
    console.log('Scraping complete! Start the server to view properties.');
    console.log('Run: npm start');
    console.log('='.repeat(60));

  } catch (error) {
    console.error('Scraping error:', error);
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = PropertyScraper;

