# 🚀 IremeCorner API Documentation Deployment Guide

## 📋 Overview

This guide helps you deploy **only the Swagger documentation** for your IremeCorner API. The documentation server is lightweight and focuses solely on serving your API documentation.

## 🎯 What Gets Deployed

- **Interactive Swagger UI** (`/api-docs`)
- **JSON Schema endpoint** (`/swagger.json`)
- **Health check endpoint** (`/health`)
- **68 documented API endpoints**

## 🛠️ Deployment Options

### Option 1: Render.com (Recommended)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure the service:**

```yaml
# Render Configuration
Build Command: echo "No build required"
Start Command: node swagger-server.js
Environment: Node
Branch: main
Root Directory: server
```

4. **Environment Variables:**
   - `NODE_ENV=production`
   - `PORT=10000`

5. **Deploy!** Your docs will be available at `https://your-app.onrender.com/api-docs`

### Option 2: Heroku

1. **Create Heroku app:**
```bash
heroku create iremecorner-api-docs
```

2. **Set environment variables:**
```bash
heroku config:set NODE_ENV=production
```

3. **Deploy:**
```bash
git subtree push --prefix=server heroku main
```

### Option 3: Vercel

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd server
vercel --prod
```

### Option 4: Docker

1. **Build Docker image:**
```bash
cd server
docker build -t iremecorner-api-docs .
```

2. **Run container:**
```bash
docker run -p 3000:3000 iremecorner-api-docs
```

## 📁 Files Required for Deployment

### Essential Files:
- `swagger-server.js` - Main server file
- `swagger.json` - API documentation
- `package-docs.json` - Dependencies (rename to package.json)

### Optional Files:
- `Dockerfile` - For containerized deployment
- `render.yaml` - Render.com configuration
- `export-swagger.js` - For regenerating docs

## 🔧 Pre-Deployment Setup

1. **Rename package file:**
```bash
cd server
mv package-docs.json package.json
```

2. **Install dependencies:**
```bash
npm install
```

3. **Test locally:**
```bash
npm start
# Visit: http://localhost:3000/api-docs
```

## 🌐 Post-Deployment URLs

After deployment, your documentation will be available at:

- **Interactive Docs:** `https://your-domain.com/api-docs`
- **JSON Schema:** `https://your-domain.com/swagger.json`
- **Health Check:** `https://your-domain.com/health`

## 📊 Features Available

- ✅ **Interactive API Testing**
- ✅ **JWT Authentication Support**
- ✅ **Request/Response Examples**
- ✅ **Schema Validation**
- ✅ **Error Documentation**
- ✅ **Role-based Access Control**
- ✅ **Mobile-friendly Interface**

## 🔄 Updating Documentation

To update your deployed documentation:

1. **Regenerate swagger.json:**
```bash
node export-swagger.js
```

2. **Commit and push changes:**
```bash
git add swagger.json
git commit -m "Update API documentation"
git push
```

3. **Redeploy** (automatic with most platforms)

## 🎨 Customization

### Custom Styling
Edit the `customCss` option in `swagger-server.js`:

```javascript
customCss: `
  .swagger-ui .topbar { display: none }
  .swagger-ui .info { margin: 20px 0 }
  /* Add your custom styles */
`
```

### Custom Domain
Most platforms support custom domains:
- **Render:** Add custom domain in dashboard
- **Heroku:** Use Heroku CLI to add domain
- **Vercel:** Configure in project settings

## 📱 Mobile Access

The Swagger UI is fully responsive and works great on mobile devices. Users can:
- Browse API endpoints
- Test endpoints with authentication
- View request/response examples
- Access JSON schema

## 🔐 Security Considerations

- **CORS enabled** for JSON endpoint
- **No sensitive data** in documentation
- **Read-only access** to API schema
- **Health check** for monitoring

## 📈 Monitoring

Monitor your documentation server:

- **Health endpoint:** `/health`
- **Uptime monitoring:** Use services like UptimeRobot
- **Analytics:** Add Google Analytics to track usage

## 🆘 Troubleshooting

### Common Issues:

1. **Port conflicts:** Ensure PORT environment variable is set
2. **Missing dependencies:** Run `npm install` before deployment
3. **File not found:** Ensure `swagger.json` exists in root directory
4. **CORS issues:** Check Access-Control-Allow-Origin headers

### Debug Mode:
Set `NODE_ENV=development` to see detailed error messages.

## 📞 Support

- **Documentation Issues:** Check the generated swagger.json
- **Deployment Issues:** Check platform-specific logs
- **API Questions:** Contact api-support@iremecorner.com

---

**Ready to deploy?** Choose your preferred platform and follow the steps above! 🚀
