# 📚 IremeCorner API Documentation Deployment

## 🎯 Quick Start

This directory contains everything needed to deploy **only the Swagger documentation** for your IremeCorner API.

### 🚀 Deploy in 3 Steps:

1. **Prepare deployment:**
   ```bash
   # Windows
   deploy-docs.bat
   
   # Linux/Mac
   chmod +x deploy-docs.sh
   ./deploy-docs.sh
   ```

2. **Choose your platform:**
   - **Render.com** (Recommended)
   - **Heroku**
   - **Vercel**
   - **Docker**

3. **Deploy and access:**
   - Interactive docs: `https://your-domain.com/api-docs`
   - JSON schema: `https://your-domain.com/swagger.json`

## 📁 What's Included

- **68 API endpoints** documented
- **Interactive Swagger UI**
- **JSON schema endpoint**
- **Health check endpoint**
- **Mobile-responsive design**

## 🔧 Files

| File | Purpose |
|------|---------|
| `swagger-server.js` | Main documentation server |
| `swagger.json` | Complete API documentation |
| `package-docs.json` | Dependencies (rename to package.json) |
| `deploy-docs.bat` | Windows deployment script |
| `deploy-docs.sh` | Linux/Mac deployment script |
| `Dockerfile` | Docker deployment |
| `render.yaml` | Render.com configuration |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment instructions |

## 🌐 Live Demo

Once deployed, your documentation will include:

- **Authentication endpoints** (register, login, profile)
- **Product management** (CRUD operations)
- **Order processing** (create, track, manage)
- **Course management** (enrollment, assignments)
- **Payment processing** (multiple methods)
- **Inventory management** (stock, analytics)
- **Certificate system** (issuance, verification)

## 📱 Features

- ✅ **Interactive testing** - Test endpoints directly from browser
- ✅ **JWT authentication** - Built-in token support
- ✅ **Request/response examples** - Complete examples for all endpoints
- ✅ **Schema validation** - Detailed data models
- ✅ **Error documentation** - Comprehensive error responses
- ✅ **Role-based access** - Clear permission indicators
- ✅ **Mobile-friendly** - Responsive design

## 🎨 Customization

Edit `swagger-server.js` to customize:
- Custom CSS styling
- Additional endpoints
- Authentication methods
- Error handling

## 📞 Support

- **Documentation:** See `DEPLOYMENT_GUIDE.md`
- **Issues:** Check platform-specific logs
- **API Questions:** Contact api-support@iremecorner.com

---

**Ready to deploy?** Run the deployment script and follow the platform-specific instructions! 🚀
