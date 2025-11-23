#!/bin/bash

# Railway startup script
echo "🚀 Starting SpaceSelector.ai..."

# Check if database exists and has data
if [ ! -f properties.db ] || [ ! -s properties.db ]; then
    echo "📊 Database not found or empty. Running scraper to populate..."
    node scraper.js
else
    # Check if database has any properties
    COUNT=$(sqlite3 properties.db "SELECT COUNT(*) FROM properties;" 2>/dev/null || echo "0")
    if [ "$COUNT" = "0" ]; then
        echo "📊 Database empty. Running scraper to populate..."
        node scraper.js
    else
        echo "✅ Database found with $COUNT properties"
    fi
fi

echo "🎯 Starting server..."
node server.js

