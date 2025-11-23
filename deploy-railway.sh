#!/bin/bash

echo "🚂 Deploying SpaceSelector.ai to Railway"
echo "=========================================="
echo ""
echo "Railway requires a GitHub repository."
echo ""
echo "Step 1: Create GitHub Repository"
echo "--------------------------------"
echo "Please go to https://github.com/new and create a new repository named: spaceselector-ai"
echo ""
read -p "Have you created the repository? (y/n): " created

if [ "$created" != "y" ]; then
    echo "Please create the repository first, then run this script again."
    exit 1
fi

echo ""
read -p "Enter your GitHub username: " github_user

echo ""
echo "Step 2: Pushing to GitHub..."
echo "----------------------------"

# Add remote and push
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/$github_user/spaceselector-ai.git
git branch -M main

echo "Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Pushed to GitHub!"
echo ""
echo "Step 3: Deploy on Railway"
echo "-------------------------"
echo ""
echo "Now let's deploy to Railway:"
echo ""
echo "1. Press Enter to open Railway in your browser"
read -p "Press Enter to continue..."
open https://railway.app/new

echo ""
echo "2. In Railway:"
echo "   - Sign in with GitHub"
echo "   - Click 'Deploy from GitHub repo'"
echo "   - Select: $github_user/spaceselector-ai"
echo "   - Railway will automatically detect and deploy"
echo ""
echo "3. Add Environment Variable:"
echo "   - Click on your service"
echo "   - Go to 'Variables' tab"
echo "   - Add: GOOGLE_MAPS_API_KEY = AIzaSyCRwQW2aLupQ3QpVqPoRyr-OT7et4E14FE"
echo ""
echo "4. Add Custom Domain:"
echo "   - Go to 'Settings' tab"
echo "   - Click 'Generate Domain' (you'll get a free *.railway.app domain)"
echo "   - Or add custom domain: spaceselector.ai"
echo ""
echo "Railway will build and deploy your app automatically!"
echo ""
echo "=========================================="
echo "📚 Your app will be live in 2-3 minutes!"
echo "=========================================="

