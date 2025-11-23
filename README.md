# 🏢 SpaceSelector.ai

A modern web application for finding commercial real estate properties with interactive map visualization and advanced filtering capabilities.

## Features

- 🗺️ **Interactive Google Maps Integration** - View properties on an interactive map with custom markers
- 🔍 **Advanced Search & Filtering** - Filter by price, square footage, property type, and location
- 📊 **Detailed Property Information** - View comprehensive details including images, descriptions, and pricing
- 🎨 **Modern, Responsive UI** - Beautiful gradient design that works on all devices
- 🗃️ **SQLite Database** - Lightweight, serverless database for storing property listings
- 🌐 **Web Scraping Capability** - Framework for scraping commercial real estate sites (with ethical considerations)

## Screenshots

The application features:
- Left sidebar with search filters and property listings
- Full-screen Google Maps view with property markers
- Modal windows for detailed property information
- Responsive design for mobile and desktop

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Google Maps API key

## Installation

1. **Clone or navigate to the repository:**
   ```bash
   cd /Users/danielrosshirt/Desktop/spaceSelector.ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Maps API key:
   ```
   PORT=3000
   GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

   **Get a Google Maps API Key:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
   - Create a new project or select an existing one
   - Enable the "Maps JavaScript API"
   - Create credentials (API Key)
   - Copy the API key to your `.env` file

4. **Populate the database with sample data:**
   ```bash
   npm run scrape
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

6. **Open your browser:**
   ```
   http://localhost:3000
   ```

## Usage

### Searching for Properties

1. **Filter by Location:**
   - Enter a city and/or state in the filter sidebar
   - Example: "San Francisco", "CA"

2. **Filter by Property Type:**
   - Select from: Office, Retail, Industrial, Mixed Use, Medical, Restaurant, Warehouse

3. **Filter by Price Range:**
   - Set minimum and maximum price
   - Example: $1,000,000 - $5,000,000

4. **Filter by Size:**
   - Set minimum and maximum square footage
   - Example: 5,000 - 20,000 sq ft

5. **View Results:**
   - Properties appear in the list on the left
   - Markers show on the map
   - Click any property card or marker to see details

### Viewing Property Details

- Click on a property card in the sidebar, OR
- Click on a map marker
- A modal will open with full property details including:
  - High-resolution image
  - Full description
  - Price and size information
  - Location details
  - Link to original listing (if available)

## Project Structure

```
spaceSelector.ai/
├── server.js           # Express server and API endpoints
├── scraper.js          # Web scraping module
├── package.json        # Dependencies and scripts
├── properties.db       # SQLite database (created automatically)
├── .env               # Environment variables (create this)
├── .gitignore         # Git ignore rules
├── README.md          # This file
└── public/            # Frontend files
    ├── index.html     # Main HTML file
    ├── styles.css     # Styling
    └── app.js         # Frontend JavaScript
```

## API Endpoints

### GET `/api/properties`
Get all properties with optional filters

**Query Parameters:**
- `city` - Filter by city name
- `state` - Filter by state code (e.g., CA)
- `propertyType` - Filter by type (Office, Retail, etc.)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `minSize` - Minimum square footage
- `maxSize` - Maximum square footage

**Example:**
```
GET /api/properties?city=San Francisco&minPrice=1000000&maxPrice=5000000
```

### GET `/api/properties/:id`
Get a single property by ID

### POST `/api/properties`
Add a new property

**Request Body:**
```json
{
  "title": "Modern Office Space",
  "address": "123 Main St",
  "city": "San Francisco",
  "state": "CA",
  "zip_code": "94102",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "price": 5000000,
  "square_feet": 10000,
  "property_type": "Office",
  "description": "Beautiful office space...",
  "image_url": "https://...",
  "source_url": "https://...",
  "source_site": "LoopNet"
}
```

### GET `/api/config`
Get configuration (including Google Maps API key for frontend)

### DELETE `/api/properties/all`
Delete all properties (for testing/development)

## Web Scraping

### Important Notes About Web Scraping

⚠️ **Legal and Ethical Considerations:**

The web scraping functionality in this project is provided for **educational and demonstration purposes**. Before scraping any website:

1. **Check Terms of Service** - Many sites prohibit automated scraping
2. **Review robots.txt** - Respect the site's crawling policies
3. **Use Official APIs** - When available, always prefer official APIs
4. **Rate Limiting** - Implement delays to avoid overloading servers
5. **Respect Copyright** - Be mindful of data ownership and intellectual property

**LoopNet and similar commercial real estate sites may have restrictions on scraping.**

### Running the Scraper

The included scraper generates sample data for demonstration:

```bash
npm run scrape
```

### Extending the Scraper

To add actual web scraping functionality:

1. Review the target site's Terms of Service
2. Check their robots.txt file
3. Look for official APIs or data feeds
4. Implement respectful rate limiting
5. Handle errors gracefully
6. Update `scraper.js` with your implementation

Example sites to consider (check their policies first):
- LoopNet (official API available)
- CoStar
- Crexi
- CommercialCafe

## Development

### Run in Development Mode

```bash
npm run dev
```

This uses nodemon to automatically restart the server when you make changes.

### Database Management

The SQLite database (`properties.db`) is created automatically. To reset:

```bash
# Delete the database file
rm properties.db

# Restart the server (creates new empty database)
npm start

# Re-populate with sample data
npm run scrape
```

### Adding More Sample Data

Edit `scraper.js` and add more entries to the `sampleProperties` array, then run:

```bash
npm run scrape
```

## Customization

### Changing the Default Map Location

Edit `public/app.js` and modify the `defaultCenter` in the `initMap()` function:

```javascript
const defaultCenter = { lat: YOUR_LAT, lng: YOUR_LNG };
```

### Modifying Property Types

1. Update the database schema in `server.js`
2. Add new options to the dropdown in `public/index.html`
3. Update the scraper in `scraper.js`

### Styling

Edit `public/styles.css` to customize:
- Colors and gradients
- Layout and spacing
- Typography
- Responsive breakpoints

The current design uses a purple gradient theme. Key colors:
- Primary: `#667eea`
- Secondary: `#764ba2`

## Technologies Used

- **Backend:**
  - Node.js
  - Express.js
  - better-sqlite3 (SQLite database)
  - Puppeteer (web scraping)
  - Axios & Cheerio (HTTP requests and HTML parsing)

- **Frontend:**
  - Vanilla JavaScript (ES6+)
  - Google Maps JavaScript API
  - Modern CSS (Grid, Flexbox, Gradients)
  - Responsive design

## Troubleshooting

### "Google Maps API key not configured"
- Make sure you created a `.env` file
- Verify your API key is correct
- Ensure the Maps JavaScript API is enabled in Google Cloud Console

### No properties showing
- Run `npm run scrape` to populate the database
- Check the console for errors
- Verify the database file exists (`properties.db`)

### Map not loading
- Check your internet connection
- Verify the Google Maps API key is valid
- Check browser console for errors
- Ensure the API key has the correct permissions

### Scraper errors
- Check your internet connection
- The sample scraper uses OpenStreetMap's geocoding API
- Rate limits may apply - the scraper includes 1-second delays

## Future Enhancements

Potential features to add:
- User authentication and saved searches
- Email alerts for new properties matching criteria
- Comparison tool for multiple properties
- Integration with real estate APIs (LoopNet, Zillow, etc.)
- Advanced map features (drawing search areas, heatmaps)
- Property analytics and market trends
- Mobile app version
- Export search results to PDF/Excel

## License

MIT License - feel free to use this project for learning or as a starting point for your own application.

## Contributing

This is a demonstration project. Feel free to fork and modify for your own needs.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the code comments in the source files
3. Check the browser console for error messages

## Disclaimer

This application is for educational and demonstration purposes. When implementing web scraping:
- Always respect website Terms of Service
- Use official APIs when available
- Implement proper rate limiting
- Respect robots.txt directives
- Be mindful of copyright and data ownership

---

Built with ❤️ using Node.js, Express, and Google Maps API

