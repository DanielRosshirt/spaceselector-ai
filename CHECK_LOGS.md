# 🔍 Debugging: Check Railway Logs

## I've Added Comprehensive Logging!

### What Was Added:

1. ✅ **Startup script logging** - Shows file system, database checks
2. ✅ **Server startup logging** - Shows database status, property count
3. ✅ **API request logging** - Shows every property query
4. ✅ **Database logging** - Shows sample properties on startup

---

## 📊 How to Check Railway Logs:

### Step 1: Go to Railway Dashboard
https://railway.app/dashboard

### Step 2: Click on Your Service
Find "spaceselector" or your app name

### Step 3: View Logs
Click on the **"Deployments"** tab, then click the latest deployment

OR

Click on the **"Logs"** tab to see real-time logs

---

## 🔍 What to Look For:

### On Startup, You Should See:

```
🚀 Starting SpaceSelector.ai...
📍 Current directory: /app
📁 Files in directory:
... (list of files)

⚠️  Database not found, running scraper...
(OR)
✅ Database has X properties

📊 Total properties in database: X

🎯 Starting server...
🚀 SpaceSelector.ai Server Starting...
📍 Current directory: /app
🔑 Environment: production
🔑 Google Maps API Key: Set ✅
📊 Initializing database...
✅ Database opened successfully
✅ Database tables verified
📊 Database contains X properties
📍 Sample properties:
   - Denver Industrial Distribution Center (Denver, CO) - Industrial
   - ...

====================================
✅ Server running on http://localhost:XXXX
📡 API available at http://localhost:XXXX/api/properties
====================================
```

### When You Search, You Should See:

```
📊 GET /api/properties called
📍 Query params: { city: 'Denver', state: 'CO', propertyType: 'Industrial', ... }
📝 SQL Query: SELECT * FROM properties WHERE 1=1 AND property_type = ? AND city LIKE ? AND state = ? ...
📝 SQL Params: [ 'Industrial', '%Denver%', 'CO', ... ]
✅ Found 3 properties
📍 First property: Denver Industrial Distribution Center Denver CO
```

---

## 🚨 Possible Issues & Solutions:

### Issue 1: "Database not found" but scraper doesn't run
**Solution:** The scraper might be failing. Look for error messages after "running scraper..."

### Issue 2: "Database contains 0 properties"
**Solution:** Scraper ran but failed to add properties. Check for geocoding errors.

### Issue 3: "Found 0 properties" when searching
**Possible causes:**
- Filters are too restrictive
- Database is empty
- SQL query issue

### Issue 4: "Google Maps API Key: Missing ❌"
**Solution:** Add the environment variable in Railway:
- Go to Variables tab
- Add: `GOOGLE_MAPS_API_KEY` = `AIzaSyCRwQW2aLupQ3QpVqPoRyr-OT7et4E14FE`

---

## 📋 Quick Checklist:

After Railway deploys (2-3 minutes from now), check logs for:

- [ ] Startup script ran
- [ ] Scraper executed (if database was empty)
- [ ] "✓ Saved: X properties" messages (should see 19)
- [ ] "Database contains X properties" (X should be 19)
- [ ] Server started successfully
- [ ] Google Maps API key is set
- [ ] Sample properties are listed

---

## 🔧 If Database is Still Empty:

The logs will show why. Common issues:

1. **Geocoding failures** - OpenStreetMap API might be rate limiting
2. **SQLite not available** - Railway should have it, but check
3. **Write permissions** - File system might not allow database creation
4. **Scraper errors** - Check for error messages in logs

---

## 📱 How to Access Logs:

### Option 1: Web Dashboard
1. Go to https://railway.app/dashboard
2. Click your service
3. Click "Logs" or "Deployments"

### Option 2: Railway CLI (if you want)
```bash
railway login
railway link
railway logs
```

---

## ⏱️ Next Steps:

1. **Wait 2-3 minutes** for Railway to deploy
2. **Check the logs** using steps above
3. **Share the logs with me** if there are errors
4. We'll fix any issues based on what the logs show

---

## 🎯 What I'm Looking For:

Please share any:
- ❌ Error messages
- ⚠️  Warning messages
- 📊 Property count (should be 19)
- 🔑 API key status (should be "Set ✅")

The logs will tell us exactly what's happening! 🔍

