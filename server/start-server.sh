#!/bin/bash

# Production startup script for Aarambh backend

echo "Starting Aarambh LMS Backend Server..."

# Check if .env file exists
if [ -f .env.production ]; then
  echo "Loading production environment variables..."
  export $(cat .env.production | xargs)
elif [ -f .env ]; then
  echo "Loading development environment variables..."
  export $(cat .env | xargs)
else
  echo "No environment file found. Using default settings."
fi

# Start the server
node server.js