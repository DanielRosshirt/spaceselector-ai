# Quick Start Guide

## 🚀 Getting Started in 3 Steps

### 1. Get Your Google Maps API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a new project or select an existing one
3. Enable the **Maps JavaScript API**
4. Create an API Key under Credentials
5. Copy your API key

### 2. Add Your API Key

Create a `.env` file in the project root (already done):

```bash
PORT=3000
GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
```

Replace `YOUR_API_KEY_HERE` with your actual Google Maps API key.

### 3. Start the Application

```bash
npm start
```

Then open your browser to: **http://localhost:3000**

---

## 📊 Sample Data

The database has been pre-populated with 8 sample commercial properties in the San Francisco Bay Area.

To add more sample properties:
```bash
npm run scrape
```

---

## 🎯 What You Can Do

- **Filter by Location**: Search by city and state
- **Filter by Type**: Office, Retail, Industrial, Medical, etc.
- **Filter by Price**: Set min/max budget
- **Filter by Size**: Set min/max square footage
- **View on Map**: Click markers to see property details
- **View Details**: Click any property card for full information

---

## 🔧 Troubleshooting

**"Google Maps API key not configured"**
- Make sure you have a `.env` file with `GOOGLE_MAPS_API_KEY=your_key`
- Restart the server after adding the key

**No properties showing**
- Run `npm run scrape` to populate the database

**Port already in use**
- Change the PORT in your `.env` file
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill -9`

---

## 📝 Next Steps

1. Add your Google Maps API key to `.env`
2. Run `npm start`
3. Visit http://localhost:3000
4. Enjoy browsing commercial properties!

For more details, see the full README.md

