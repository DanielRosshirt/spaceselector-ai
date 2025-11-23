# 🚀 QUICK DEPLOYMENT TO spaceselector.ai

## Choose Your Method:

### ⚡ FASTEST: Vercel (2 minutes)

```bash
# Install Vercel
npm install -g vercel

# Deploy
cd /Users/danielrosshirt/Desktop/spaceSelector.ai
vercel

# Then on vercel.com:
# 1. Add GOOGLE_MAPS_API_KEY environment variable
# 2. Add domain: spaceselector.ai
# 3. Update DNS as instructed
```

---

### 🎯 AUTOMATED: Use Deploy Script

```bash
cd /Users/danielrosshirt/Desktop/spaceSelector.ai
./deploy.sh
```

Follow the interactive prompts!

---

### 📦 MANUAL: Railway (Modern & Easy)

1. **Push to GitHub first:**
   ```bash
   # You'll need to create a repo on github.com first
   git remote add origin https://github.com/YOUR_USERNAME/spaceselector-ai.git
   git push -u origin main
   ```

2. **Deploy on Railway:**
   - Go to https://railway.app
   - Sign in with GitHub
   - "New Project" → "Deploy from GitHub repo"
   - Select `spaceselector-ai`
   - Add environment variable: `GOOGLE_MAPS_API_KEY`
   - Settings → Domains → Add `spaceselector.ai`

3. **Update DNS:**
   - Add CNAME record from Railway dashboard

---

### 🌊 ALTERNATIVE: Render (Free Tier)

1. **Push to GitHub** (same as above)

2. **Deploy on Render:**
   - Go to https://render.com
   - "New" → "Web Service"
   - Connect GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add environment variable: `GOOGLE_MAPS_API_KEY`
   - Add custom domain: `spaceselector.ai`

---

## DNS Configuration

Once deployed, update your domain DNS:

### For Vercel/Railway/Render:
They'll provide a CNAME target like:

```
Type: CNAME
Name: @  (or spaceselector.ai)
Value: [provided by platform]

Type: CNAME
Name: www
Value: [provided by platform]
```

### For VPS:
```
Type: A
Name: @
Value: [your server IP]

Type: CNAME
Name: www
Value: spaceselector.ai
```

---

## Environment Variables Required

Make sure to set in your hosting platform:

```
GOOGLE_MAPS_API_KEY=your_actual_key_here
PORT=3000  (or as required by platform)
NODE_ENV=production
```

---

## Recommended: Vercel Deployment

**Fastest and easiest option:**

```bash
# One-time setup
npm install -g vercel

# Deploy (run from project directory)
vercel

# Production deployment
vercel --prod

# Add domain
vercel domains add spaceselector.ai
vercel domains add www.spaceselector.ai
```

Then:
1. Go to https://vercel.com/dashboard
2. Select your project
3. Settings → Environment Variables
4. Add: `GOOGLE_MAPS_API_KEY` = `your_key`
5. Redeploy

Your site will be live at spaceselector.ai!

---

## Troubleshooting

### Domain not working?
- Check DNS propagation (can take up to 48 hours)
- Verify CNAME records are correct
- Check hosting platform shows domain as active

### Map not loading?
- Verify GOOGLE_MAPS_API_KEY is set in environment variables
- Check API key is valid and has Maps JavaScript API enabled
- Redeploy after adding environment variables

### Database issues?
- SQLite works fine for small-medium traffic
- For production at scale, consider upgrading to PostgreSQL
- Most platforms offer managed databases

---

## Next Steps After Deployment

1. ✅ Test all features on live site
2. ✅ Set up SSL (usually automatic)
3. ✅ Configure analytics (Google Analytics)
4. ✅ Set up error monitoring (Sentry)
5. ✅ Set up uptime monitoring (UptimeRobot)
6. ✅ Configure backups for database

---

## Support Links

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs

Choose the platform that works best for you and start deploying! 🚀

