# 🚂 Railway Deployment Guide

## Quick Deploy to Railway

Railway supports SQLite perfectly! Your full database will work.

### Step 1: Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `spaceselector-ai`
3. Make it public or private
4. **DO NOT** initialize with README, .gitignore, or license
5. Click "Create repository"

### Step 2: Push to GitHub

Copy your GitHub username, then run:

```bash
cd /Users/danielrosshirt/Desktop/spaceSelector.ai

# Replace YOUR_USERNAME with your actual GitHub username
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/YOUR_USERNAME/spaceselector-ai.git
git push -u origin main
```

### Step 3: Deploy on Railway

1. **Go to Railway:**
   https://railway.app/new

2. **Sign in with GitHub**

3. **Deploy from GitHub repo:**
   - Click "Deploy from GitHub repo"
   - Select `spaceselector-ai` repository
   - Railway will automatically detect it's a Node.js app

4. **Railway will automatically:**
   - ✅ Install dependencies
   - ✅ Build the app
   - ✅ Start the server
   - ✅ Generate a public URL

### Step 4: Add Environment Variable

1. Click on your deployed service
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add:
   - **Key:** `GOOGLE_MAPS_API_KEY`
   - **Value:** `AIzaSyCRwQW2aLupQ3QpVqPoRyr-OT7et4E14FE`
5. Click "Add"
6. Railway will automatically redeploy

### Step 5: Run Database Scraper

Once deployed, you need to populate the database:

**Option A: Use Railway CLI**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run scraper
railway run node scraper.js
```

**Option B: Add to startup**
We can modify the start command to run the scraper automatically on first deploy.

### Step 6: Get Your URL

1. In Railway dashboard, click on your service
2. Go to **"Settings"** tab
3. Click **"Generate Domain"**
4. You'll get a URL like: `spaceselector-production.up.railway.app`

### Step 7: Add Custom Domain (Optional)

1. In Settings, scroll to "Domains"
2. Click "Custom Domain"
3. Enter: `spaceselector.ai`
4. Railway will show you the DNS records to add:
   ```
   Type: CNAME
   Name: @  (or spaceselector.ai)
   Value: [railway-provided-value]
   ```

---

## What You'll Get with Railway

✅ **Full SQLite database support**
✅ **Persistent data storage**
✅ **Can add/modify properties**
✅ **Traditional server environment**
✅ **Automatic HTTPS**
✅ **Free $5 credit (good for ~1 month)**
✅ **After trial: ~$5-10/month**

---

## Quick Command Summary

```bash
# 1. Create repo on github.com/new

# 2. Push code (replace YOUR_USERNAME)
cd /Users/danielrosshirt/Desktop/spaceSelector.ai
git remote add origin https://github.com/YOUR_USERNAME/spaceselector-ai.git
git push -u origin main

# 3. Deploy on railway.app
# - Sign in with GitHub
# - Deploy from GitHub repo
# - Add GOOGLE_MAPS_API_KEY variable
# - Generate domain

# 4. Populate database
railway login
railway link
railway run node scraper.js
```

---

## Need Help?

Railway has excellent documentation:
- **Docs:** https://docs.railway.app
- **Discord:** https://discord.gg/railway

---

Ready to deploy? Just provide your GitHub username and I'll help you push the code!

