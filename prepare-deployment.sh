#!/bin/bash

# IremeCorner API Documentation Deployment Script
echo "🚀 Preparing IremeCorner API Documentation for Deployment..."

# Check if we're in the right directory
if [ ! -f "swagger.json" ]; then
    echo "❌ Error: swagger.json not found. Please run this script from the server directory."
    exit 1
fi

# Ensure package.json exists
if [ ! -f "package.json" ]; then
    echo "📦 Creating package.json..."
    cp package-docs.json package.json
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm install --only=production

# Test the server
echo "🧪 Testing documentation server..."
timeout 10s node swagger-server.js &
SERVER_PID=$!
sleep 3

# Check if server started successfully
if curl -s http://localhost:3000/health > /dev/null; then
    echo "✅ Server test successful"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server test failed"
    kill $SERVER_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Deployment package ready!"
echo ""
echo "📁 Essential files:"
echo "   ✅ swagger-server.js"
echo "   ✅ swagger.json"
echo "   ✅ package.json"
echo ""
echo "🌐 After deployment, your docs will be at:"
echo "   📚 Interactive UI: https://your-app.onrender.com/api-docs"
echo "   📄 JSON Schema: https://your-app.onrender.com/swagger.json"
echo "   🔍 Health Check: https://your-app.onrender.com/health"
echo ""
echo "🚀 Ready for Render.com deployment!"
echo "   Make sure to set Root Directory to 'server' in Render dashboard"
