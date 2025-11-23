# How to Get Your Google Maps API Key

## Step-by-Step Instructions

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/google/maps-apis

### 2. Create or Select a Project
- Click "Select a project" at the top of the page
- Click "New Project"
- Enter a project name (e.g., "SpaceSelector")
- Click "Create"

### 3. Enable Maps JavaScript API
- In the search bar, type "Maps JavaScript API"
- Click on "Maps JavaScript API"
- Click the "Enable" button
- Wait a few seconds for it to activate

### 4. Create API Credentials
- Go to "Credentials" in the left sidebar
- Click "Create Credentials" at the top
- Select "API Key"
- Your API key will be generated and displayed

### 5. (Optional but Recommended) Restrict Your API Key
- Click "Edit API Key" (or the pencil icon)
- Under "Application restrictions":
  - For development: Choose "None"
  - For production: Choose "HTTP referrers" and add your domain
- Under "API restrictions":
  - Choose "Restrict key"
  - Select "Maps JavaScript API"
- Click "Save"

### 6. Copy Your API Key
- Copy the API key (it looks like: `AIzaSyABC123...`)

### 7. Add to Your .env File
Create or edit the `.env` file in your project root:

```bash
PORT=3000
GOOGLE_MAPS_API_KEY=AIzaSyABC123_YOUR_ACTUAL_KEY_HERE
```

### 8. Restart Your Server
```bash
npm start
```

---

## Important Notes

### Free Tier
Google Maps provides a generous free tier:
- $200 free credit per month
- Covers ~28,000 map loads per month
- Perfect for development and small-scale production

### Billing Setup
- You'll need to enable billing on your Google Cloud account
- Don't worry - you won't be charged unless you exceed the free tier
- You can set up budget alerts to avoid unexpected charges

### Security Best Practices

1. **Never commit your API key to Git**
   - The `.env` file is in `.gitignore`
   - Never share your API key publicly

2. **Use API restrictions**
   - Limit which APIs can use your key
   - Limit which domains can use your key (for production)

3. **Monitor usage**
   - Check your usage in Google Cloud Console
   - Set up budget alerts

4. **Regenerate if exposed**
   - If you accidentally expose your key, regenerate it immediately
   - Go to Credentials → Edit Key → Regenerate

---

## Troubleshooting

### "This page can't load Google Maps correctly"
- Check your API key is correct in `.env`
- Ensure Maps JavaScript API is enabled
- Check browser console for specific error messages
- Restart your server after changing `.env`

### "RefererNotAllowedMapError"
- Your API key has referrer restrictions
- Add your domain to allowed referrers
- Or temporarily set to "None" for development

### "RequestDeniedMapError"
- Billing might not be enabled
- Maps JavaScript API might not be enabled
- API key might be restricted incorrectly

---

## Alternative: Use Without API Key (Limited)

If you want to test the application without a Google Maps API key:

1. The map won't load, but you'll see a helpful error message
2. All other features work (property list, filters, API endpoints)
3. You can still browse properties in the list view
4. The scraper and database work independently

---

## Cost Estimation

Based on typical usage:

**Development (local testing):**
- Cost: $0 (well within free tier)
- Usage: 100-200 map loads per day

**Small Production Site:**
- 1,000 users/month
- 3 map loads per user
- Total: 3,000 loads/month
- Cost: $0 (within $200 free credit)

**Medium Production Site:**
- 10,000 users/month
- 3 map loads per user
- Total: 30,000 loads/month
- Cost: ~$2-3/month (after free credit)

---

## Links

- **Google Cloud Console**: https://console.cloud.google.com/
- **Maps JavaScript API Docs**: https://developers.google.com/maps/documentation/javascript
- **Pricing Calculator**: https://mapsplatform.google.com/pricing/
- **Get Started Guide**: https://developers.google.com/maps/get-started

---

## Quick Start Checklist

- [ ] Create Google Cloud project
- [ ] Enable Maps JavaScript API
- [ ] Create API key
- [ ] Copy API key to `.env` file
- [ ] (Optional) Set up API restrictions
- [ ] Restart server
- [ ] Open http://localhost:3000
- [ ] Verify map loads correctly

---

Need help? Check the troubleshooting section or the Google Maps documentation.

