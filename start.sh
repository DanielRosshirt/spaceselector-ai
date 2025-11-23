#!/bin/bash

# SpaceSelector.ai - Start Script
# This script helps you get started quickly

echo "🏢 SpaceSelector.ai - Commercial Real Estate Finder"
echo "=================================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  WARNING: .env file not found!"
    echo ""
    echo "Please create a .env file with your Google Maps API key:"
    echo ""
    echo "  PORT=3000"
    echo "  GOOGLE_MAPS_API_KEY=your_api_key_here"
    echo ""
    echo "Get your API key from:"
    echo "  https://console.cloud.google.com/google/maps-apis"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit..."
else
    echo "✅ .env file found"
fi

# Check if database exists
if [ ! -f properties.db ]; then
    echo "⚠️  Database not found. Running scraper to populate data..."
    echo ""
    npm run scrape
    echo ""
fi

echo "=================================================="
echo "🚀 Starting SpaceSelector.ai..."
echo "=================================================="
echo ""
echo "Once the server starts, open your browser to:"
echo ""
echo "  👉 http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""
echo "=================================================="
echo ""

# Start the server
npm start

