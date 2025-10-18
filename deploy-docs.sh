#!/bin/bash

# IremeCorner API Documentation Deployment Script
echo "🚀 Preparing IremeCorner API Documentation for Deployment..."

# Check if we're in the right directory
if [ ! -f "swagger.json" ]; then
    echo "❌ Error: swagger.json not found. Please run this script from the server directory."
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."

# Copy essential files
cp package-docs.json package.json
echo "✅ Package configuration ready"

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
echo "📁 Files for deployment:"
echo "   - swagger-server.js (main server)"
echo "   - swagger.json (API documentation)"
echo "   - package.json (dependencies)"
echo ""
echo "🌐 Your documentation will be available at:"
echo "   - Interactive UI: https://your-domain.com/api-docs"
echo "   - JSON Schema: https://your-domain.com/swagger.json"
echo "   - Health Check: https://your-domain.com/health"
echo ""
echo "🚀 Ready to deploy to your preferred platform!"
echo "   See DEPLOYMENT_GUIDE.md for platform-specific instructions."
