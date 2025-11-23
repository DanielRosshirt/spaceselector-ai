#!/bin/bash

# Railway startup script with detailed logging
echo "🚀 Starting SpaceSelector.ai..."
echo "📍 Current directory: $(pwd)"
echo "📁 Files in directory:"
ls -lah

# Check if database exists
if [ -f properties.db ]; then
    echo "✅ Database file exists"
    echo "📊 Database size: $(du -h properties.db)"
    
    # Try to count properties
    if command -v sqlite3 &> /dev/null; then
        echo "✅ SQLite3 available"
        COUNT=$(sqlite3 properties.db "SELECT COUNT(*) FROM properties;" 2>&1)
        echo "📊 Property count: $COUNT"
        
        if [ "$COUNT" = "0" ] || [ -z "$COUNT" ]; then
            echo "⚠️  Database is empty, running scraper..."
            node scraper.js
        else
            echo "✅ Database has $COUNT properties"
        fi
    else
        echo "⚠️  SQLite3 not available, running scraper to be safe..."
        node scraper.js
    fi
else
    echo "⚠️  Database not found, running scraper..."
    node scraper.js
fi

echo ""
echo "📊 Final database check:"
ls -lh properties.db 2>&1 || echo "Database file not found!"

if command -v sqlite3 &> /dev/null && [ -f properties.db ]; then
    FINAL_COUNT=$(sqlite3 properties.db "SELECT COUNT(*) FROM properties;" 2>&1)
    echo "📊 Total properties in database: $FINAL_COUNT"
fi

echo ""
echo "🎯 Starting server..."
node server.js

