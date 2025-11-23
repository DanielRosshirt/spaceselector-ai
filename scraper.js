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
    console.log('Generating sample properties across major US cities...\n');

    // Sample data for demonstration (replace with actual scraping)
    const sampleProperties = [
      // Denver, CO properties
      {
        title: 'Denver Industrial Distribution Center',
        address: '1200 Industrial Way',
        city: 'Denver',
        state: 'CO',
        zip_code: '80216',
        price: 150000,
        square_feet: 75000,
        property_type: 'Industrial',
        description: 'Large distribution center with multiple loading docks, climate control, and easy highway access.',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Denver Warehouse & Manufacturing Space',
        address: '3400 Brighton Blvd',
        city: 'Denver',
        state: 'CO',
        zip_code: '80216',
        price: 125000,
        square_feet: 45000,
        property_type: 'Industrial',
        description: 'Flexible warehouse space with high ceilings, heavy power, and rail access.',
        image_url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800',
        source_site: 'Sample'
      },
      {
        title: 'RiNo District Industrial Loft',
        address: '2850 Walnut St',
        city: 'Denver',
        state: 'CO',
        zip_code: '80205',
        price: 180000,
        square_feet: 12000,
        property_type: 'Industrial',
        description: 'Converted industrial space in trendy RiNo district, perfect for creative industrial use.',
        image_url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Modern Denver Office Tower Space',
        address: '1700 Broadway',
        city: 'Denver',
        state: 'CO',
        zip_code: '80202',
        price: 145000,
        square_feet: 8500,
        property_type: 'Office',
        description: 'Class A office space in downtown Denver with mountain views and modern amenities.',
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Denver Retail Corner Location',
        address: '1550 17th St',
        city: 'Denver',
        state: 'CO',
        zip_code: '80202',
        price: 165000,
        square_feet: 6500,
        property_type: 'Retail',
        description: 'Prime corner retail space in LoDo with high foot traffic and excellent visibility.',
        image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
        source_site: 'Sample'
      },
      
      // California properties
      {
        title: 'San Francisco Office Space',
        address: '123 Market St',
        city: 'San Francisco',
        state: 'CA',
        zip_code: '94102',
        price: 175000,
        square_feet: 10000,
        property_type: 'Office',
        description: 'Prime downtown office space with modern amenities and excellent visibility.',
        image_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Oakland Industrial Warehouse',
        address: '789 Industrial Blvd',
        city: 'Oakland',
        state: 'CA',
        zip_code: '94601',
        price: 135000,
        square_feet: 50000,
        property_type: 'Industrial',
        description: 'Large warehouse with loading docks, high ceilings, and excellent freeway access.',
        image_url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
        source_site: 'Sample'
      },
      
      // Texas properties
      {
        title: 'Austin Tech Office Campus',
        address: '500 W 2nd St',
        city: 'Austin',
        state: 'TX',
        zip_code: '78701',
        price: 155000,
        square_feet: 15000,
        property_type: 'Office',
        description: 'Modern office space in Austin\'s tech corridor with collaborative workspace.',
        image_url: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Dallas Distribution Center',
        address: '1800 Empire Central',
        city: 'Dallas',
        state: 'TX',
        zip_code: '75235',
        price: 140000,
        square_feet: 85000,
        property_type: 'Industrial',
        description: 'Strategic distribution facility near DFW with cross-dock capabilities.',
        image_url: 'https://images.unsplash.com/photo-1605346434674-a440ca4dc4c0?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Houston Energy Sector Office',
        address: '1000 Louisiana St',
        city: 'Houston',
        state: 'TX',
        zip_code: '77002',
        price: 168000,
        square_feet: 20000,
        property_type: 'Office',
        description: 'Premium office space in Houston\'s energy corridor with full services.',
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        source_site: 'Sample'
      },
      
      // Arizona properties
      {
        title: 'Phoenix Industrial Park Unit',
        address: '4500 S 40th St',
        city: 'Phoenix',
        state: 'AZ',
        zip_code: '85040',
        price: 115000,
        square_feet: 32000,
        property_type: 'Industrial',
        description: 'Modern industrial space in Phoenix with excellent I-10 access.',
        image_url: 'https://images.unsplash.com/photo-1565610222536-ef4d8830522c?w=800',
        source_site: 'Sample'
      },
      
      // New York properties
      {
        title: 'Brooklyn Industrial Conversion',
        address: '500 Johnson Ave',
        city: 'Brooklyn',
        state: 'NY',
        zip_code: '11237',
        price: 195000,
        square_feet: 18000,
        property_type: 'Industrial',
        description: 'Renovated industrial building in Bushwick with modern infrastructure.',
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800',
        source_site: 'Sample'
      },
      
      // Illinois properties
      {
        title: 'Chicago Loop Office Suite',
        address: '200 W Adams St',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60606',
        price: 152000,
        square_feet: 12000,
        property_type: 'Office',
        description: 'Professional office space in Chicago\'s Loop with excellent transit access.',
        image_url: 'https://images.unsplash.com/photo-1462826303086-329426d1aef5?w=800',
        source_site: 'Sample'
      },
      {
        title: 'Chicago O\'Hare Industrial',
        address: '8801 W Higgins Rd',
        city: 'Chicago',
        state: 'IL',
        zip_code: '60631',
        price: 142000,
        square_feet: 60000,
        property_type: 'Industrial',
        description: 'Prime industrial location near O\'Hare Airport with cargo access.',
        image_url: 'https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?w=800',
        source_site: 'Sample'
      },
      
      // Washington properties
      {
        title: 'Seattle Tech Hub Space',
        address: '400 Fairview Ave N',
        city: 'Seattle',
        state: 'WA',
        zip_code: '98109',
        price: 172000,
        square_feet: 14000,
        property_type: 'Office',
        description: 'Modern office space in South Lake Union tech hub with lake views.',
        image_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
        source_site: 'Sample'
      },
      
      // Georgia properties
      {
        title: 'Atlanta Logistics Center',
        address: '3000 Cobb Galleria Pkwy',
        city: 'Atlanta',
        state: 'GA',
        zip_code: '30339',
        price: 138000,
        square_feet: 55000,
        property_type: 'Industrial',
        description: 'Modern logistics facility with easy access to Hartsfield-Jackson Airport.',
        image_url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=800',
        source_site: 'Sample'
      },
      
      // Florida properties
      {
        title: 'Miami Retail Waterfront Space',
        address: '3390 Mary St',
        city: 'Miami',
        state: 'FL',
        zip_code: '33133',
        price: 185000,
        square_feet: 8000,
        property_type: 'Retail',
        description: 'High-end retail space in Coconut Grove with waterfront access.',
        image_url: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800',
        source_site: 'Sample'
      },
      
      // Massachusetts properties
      {
        title: 'Boston Seaport Office',
        address: '50 Northern Ave',
        city: 'Boston',
        state: 'MA',
        zip_code: '02210',
        price: 188000,
        square_feet: 11000,
        property_type: 'Office',
        description: 'Premium office space in Boston\'s innovation district with harbor views.',
        image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
        source_site: 'Sample'
      },
      
      // North Carolina properties
      {
        title: 'Charlotte Distribution Facility',
        address: '7901 Freedom Dr',
        city: 'Charlotte',
        state: 'NC',
        zip_code: '28208',
        price: 128000,
        square_feet: 42000,
        property_type: 'Industrial',
        description: 'Strategic distribution center with rail and highway access.',
        image_url: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=800',
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

