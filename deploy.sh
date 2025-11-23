#!/bin/bash

# Quick Deploy Script for SpaceSelector.ai
# Choose your deployment platform

echo "🚀 SpaceSelector.ai - Quick Deploy"
echo "=================================="
echo ""
echo "Choose your deployment platform:"
echo ""
echo "1. Vercel (Recommended - Free, Easy)"
echo "2. Railway (Modern, $5 credit)"
echo "3. Render (Free tier)"
echo "4. Heroku (Classic)"
echo "5. GitHub Only (I'll deploy manually)"
echo ""
read -p "Enter choice (1-5): " choice

case $choice in
  1)
    echo ""
    echo "📦 Deploying to Vercel..."
    echo ""
    
    # Check if vercel is installed
    if ! command -v vercel &> /dev/null; then
        echo "Installing Vercel CLI..."
        npm install -g vercel
    fi
    
    echo ""
    echo "🔐 Please login to Vercel..."
    vercel login
    
    echo ""
    echo "🚀 Deploying..."
    vercel
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "Next steps:"
    echo "1. Go to vercel.com dashboard"
    echo "2. Add environment variable: GOOGLE_MAPS_API_KEY"
    echo "3. Go to Settings → Domains"
    echo "4. Add domain: spaceselector.ai"
    echo "5. Update your DNS records as instructed"
    ;;
    
  2)
    echo ""
    echo "📦 Railway Deployment"
    echo ""
    echo "Steps:"
    echo "1. Go to https://railway.app"
    echo "2. Sign in with GitHub"
    echo "3. New Project → Deploy from GitHub repo"
    echo "4. Select this repository"
    echo "5. Add environment variable: GOOGLE_MAPS_API_KEY"
    echo "6. Settings → Add custom domain: spaceselector.ai"
    echo ""
    read -p "Press Enter to open Railway..."
    open https://railway.app
    ;;
    
  3)
    echo ""
    echo "📦 Render Deployment"
    echo ""
    echo "Steps:"
    echo "1. Go to https://render.com"
    echo "2. New → Web Service"
    echo "3. Connect your GitHub repository"
    echo "4. Build Command: npm install"
    echo "5. Start Command: npm start"
    echo "6. Add environment variable: GOOGLE_MAPS_API_KEY"
    echo "7. Add custom domain: spaceselector.ai"
    echo ""
    read -p "Press Enter to open Render..."
    open https://render.com
    ;;
    
  4)
    echo ""
    echo "📦 Deploying to Heroku..."
    echo ""
    
    # Check if heroku is installed
    if ! command -v heroku &> /dev/null; then
        echo "Installing Heroku CLI..."
        brew tap heroku/brew && brew install heroku
    fi
    
    echo ""
    echo "🔐 Please login to Heroku..."
    heroku login
    
    echo ""
    echo "📦 Creating Heroku app..."
    heroku create spaceselector
    
    echo ""
    read -p "Enter your Google Maps API Key: " api_key
    heroku config:set GOOGLE_MAPS_API_KEY=$api_key
    
    echo ""
    echo "🚀 Deploying..."
    git push heroku main
    
    echo ""
    echo "✅ Deployment complete!"
    echo ""
    echo "To add your domain:"
    echo "heroku domains:add spaceselector.ai"
    echo "heroku domains:add www.spaceselector.ai"
    ;;
    
  5)
    echo ""
    echo "📦 GitHub Only"
    echo ""
    echo "Please provide your GitHub username:"
    read -p "GitHub username: " github_user
    
    echo ""
    echo "Creating remote and pushing..."
    git remote add origin https://github.com/$github_user/spaceselector-ai.git
    
    echo ""
    echo "Pushing to GitHub..."
    git push -u origin main
    
    echo ""
    echo "✅ Pushed to GitHub!"
    echo ""
    echo "Repository: https://github.com/$github_user/spaceselector-ai"
    echo ""
    echo "You can now:"
    echo "1. Deploy via Vercel (vercel.com) - Link your GitHub repo"
    echo "2. Deploy via Railway (railway.app) - Import from GitHub"
    echo "3. Deploy via Render (render.com) - Connect GitHub repo"
    ;;
    
  *)
    echo "Invalid choice. Please run again."
    exit 1
    ;;
esac

echo ""
echo "=================================="
echo "📚 For detailed instructions, see DEPLOYMENT.md"
echo "=================================="

