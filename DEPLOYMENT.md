# Deployment Guide for spaceselector.ai

## 🚀 Deployment Options

Choose one of these platforms to deploy your application:

---

## Option 1: Vercel (Recommended - Easiest)

### Why Vercel?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy custom domain setup
- ✅ Git integration
- ✅ Environment variables support

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variables**
   - Go to your project on vercel.com
   - Settings → Environment Variables
   - Add: `GOOGLE_MAPS_API_KEY`

5. **Connect Domain**
   - Go to project Settings → Domains
   - Add `spaceselector.ai`
   - Update your DNS records as instructed

---

## Option 2: Heroku

### Why Heroku?
- ✅ Simple deployment
- ✅ Free tier available
- ✅ Built-in database support
- ✅ Easy environment variables

### Steps:

1. **Install Heroku CLI**
   ```bash
   brew install heroku/brew/heroku
   ```

2. **Login**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create spaceselector
   ```

4. **Set Environment Variables**
   ```bash
   heroku config:set GOOGLE_MAPS_API_KEY=your_key_here
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **Connect Domain**
   ```bash
   heroku domains:add spaceselector.ai
   heroku domains:add www.spaceselector.ai
   ```
   - Update DNS records as shown in Heroku dashboard

---

## Option 3: DigitalOcean App Platform

### Why DigitalOcean?
- ✅ $5/month starter plan
- ✅ Full control
- ✅ Easy scaling
- ✅ Good documentation

### Steps:

1. **Push to GitHub** (see GitHub setup below)

2. **Go to DigitalOcean App Platform**
   - https://cloud.digitalocean.com/apps

3. **Create New App**
   - Choose GitHub repository
   - Select branch: `main`

4. **Configure Build**
   - Build Command: `npm install`
   - Run Command: `npm start`

5. **Add Environment Variables**
   - Add `GOOGLE_MAPS_API_KEY`
   - Add `PORT=8080`

6. **Connect Domain**
   - Settings → Domains
   - Add `spaceselector.ai`
   - Update DNS records

---

## Option 4: Railway

### Why Railway?
- ✅ Modern platform
- ✅ Free tier with $5 credit
- ✅ Simple setup
- ✅ GitHub integration

### Steps:

1. **Go to Railway**
   - https://railway.app

2. **New Project → Deploy from GitHub**
   - Connect your repository

3. **Add Environment Variables**
   - Variables tab
   - Add `GOOGLE_MAPS_API_KEY`

4. **Generate Domain**
   - Settings → Generate Domain
   - Or add custom domain: `spaceselector.ai`

5. **Update DNS**
   - Add CNAME record as instructed

---

## Option 5: Traditional VPS (Advanced)

### Platforms: AWS, Linode, Vultr, etc.

### Steps:

1. **Set up VPS**
   - Ubuntu 22.04 or later

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install Nginx**
   ```bash
   sudo apt install nginx
   ```

4. **Upload Your Code**
   ```bash
   scp -r . user@your-server:/var/www/spaceselector.ai
   ```

5. **Install Dependencies**
   ```bash
   cd /var/www/spaceselector.ai
   npm install
   ```

6. **Set up PM2** (process manager)
   ```bash
   npm install -g pm2
   pm2 start server.js --name spaceselector
   pm2 startup
   pm2 save
   ```

7. **Configure Nginx** (see nginx-config.conf)

8. **Set up SSL** (Let's Encrypt)
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d spaceselector.ai -d www.spaceselector.ai
   ```

---

## GitHub Setup (Required for Most Platforms)

1. **Create GitHub Repository**
   - Go to github.com
   - Create new repository: `spaceselector-ai`

2. **Push Code**
   ```bash
   git add .
   git commit -m "Initial commit: SpaceSelector.ai"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/spaceselector-ai.git
   git push -u origin main
   ```

---

## DNS Configuration

Once you deploy, update your DNS records:

### For Vercel/Railway:
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com (or provided by platform)

Type: CNAME  
Name: www
Value: cname.vercel-dns.com
```

### For VPS/Heroku:
```
Type: A
Name: @
Value: YOUR_SERVER_IP

Type: CNAME
Name: www
Value: spaceselector.ai
```

---

## Environment Variables Needed

Make sure to set these in your hosting platform:

```
GOOGLE_MAPS_API_KEY=your_key_here
PORT=3000  (or as required by platform)
NODE_ENV=production
```

---

## Pre-Deployment Checklist

- [ ] Google Maps API key is ready
- [ ] Code is committed to git
- [ ] Database strategy decided (SQLite or upgrade to PostgreSQL)
- [ ] Environment variables configured
- [ ] Domain DNS is accessible
- [ ] SSL certificate plan (automatic or manual)

---

## Database Considerations

### SQLite (Current)
- ✅ Works for small-medium traffic
- ✅ No additional setup needed
- ⚠️ File-based, may need persistent storage

### Upgrade to PostgreSQL (Recommended for Production)
Most platforms offer managed databases:
- Heroku Postgres (free tier available)
- DigitalOcean Managed Databases
- Railway Postgres
- Supabase (free tier)

---

## Post-Deployment Steps

1. **Test the Application**
   - Visit https://spaceselector.ai
   - Check all features work
   - Test on mobile devices

2. **Monitor Performance**
   - Set up error tracking (Sentry)
   - Monitor uptime (UptimeRobot)
   - Check analytics

3. **Enable HTTPS**
   - Should be automatic on most platforms
   - If manual, use Let's Encrypt

4. **Set up Backups**
   - Database backups
   - Code repository

---

## Recommended: Quick Deploy with Vercel

**This is the fastest option:**

```bash
# Install Vercel
npm install -g vercel

# Deploy
vercel

# Follow prompts:
# - Project name: spaceselector-ai
# - Link to existing project: No
# - Set up and deploy: Yes

# Add domain
vercel domains add spaceselector.ai

# Add environment variable (on dashboard)
# GOOGLE_MAPS_API_KEY=your_key
```

Then update your domain's DNS to point to Vercel!

---

## Need Help?

- **Vercel**: https://vercel.com/docs
- **Heroku**: https://devcenter.heroku.com/
- **DigitalOcean**: https://docs.digitalocean.com/products/app-platform/
- **Railway**: https://docs.railway.app/

Choose the platform that fits your needs and budget!

