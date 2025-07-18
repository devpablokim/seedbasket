#!/bin/bash

echo "🚀 Starting deployment and update process..."

# 1. Remove duplicate folder if exists
if [ -d "seedbasket" ]; then
    echo "📁 Removing duplicate seedbasket folder..."
    rm -rf seedbasket
fi

# 2. Deploy Firebase functions
echo "🔧 Deploying Firebase functions..."
firebase deploy --only functions

# Wait for deployment to complete
echo "⏳ Waiting for deployment to complete..."
sleep 10

# 3. Update news data
echo "📰 Fetching latest news..."
curl -X GET "https://us-central1-seedbasket-342ca.cloudfunctions.net/updateNewsData"
echo ""

# Wait a bit
sleep 5

# 4. Trigger AI analysis
echo "🤖 Running AI analysis on news..."
curl -X GET "https://us-central1-seedbasket-342ca.cloudfunctions.net/triggerNewsAnalysis"
echo ""

# 5. Build and deploy frontend
echo "🏗️ Building frontend..."
cd frontend
npm run build

echo "🚀 Deploying frontend..."
cd ..
firebase deploy --only hosting

echo "✅ Deployment complete!"
echo "🌐 Visit https://seedbasket-342ca.web.app/news to see the results"