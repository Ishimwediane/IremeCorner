# Dockerfile for IremeCorner API Documentation
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package-docs.json package.json

# Install dependencies
RUN npm install --only=production

# Copy application files
COPY swagger.json ./
COPY swagger-server.js ./

# Create public directory for static files
RUN mkdir -p public

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "swagger-server.js"]
