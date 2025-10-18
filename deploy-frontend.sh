#!/bin/bash

echo "=== Aarambh Frontend Deployment Script ==="

# Set environment variables for production build
export VITE_API_BASE_URL="https://aarambh-production.eba-hmkpyyve.us-east-1.elasticbeanstalk.com/api"
export VITE_WS_BASE_URL="wss://aarambh-production.eba-hmkpyyve.us-east-1.elasticbeanstalk.com"
export VITE_APP_ENV="production"
export VITE_DEBUG_MODE="false"
export VITE_APP_URL="https://main.dr5r9xxdzd1cq.amplifyapp.com"

# Build the project with environment variables
echo "Building frontend with production environment variables..."
npm run build

# Create deployment package
echo "Creating deployment package..."
rm -f aarambh-frontend-deploy.zip
zip -r aarambh-frontend-deploy.zip build

echo "Deployment package created: aarambh-frontend-deploy.zip"
echo ""
echo "NEXT STEPS:"
echo "1. Go to AWS Amplify Console: https://console.aws.amazon.com/amplify/"
echo "2. Select your app (ID: dr5r9xxdzd1cq)"
echo "3. Click 'Deploy' or 'Manual deploy'"
echo "4. Upload the file: aarambh-frontend-deploy.zip"
echo "5. Click 'Save and deploy'"
echo ""
echo "Deployment package is ready for manual upload to AWS Amplify."