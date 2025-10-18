# 🚀 Render.com Deployment Guide for Swagger Documentation

## 🎯 Quick Fix for Current Issue

The error you're seeing is because Render is looking in the wrong directory. Here's how to fix it:

### **Step 1: Prepare Your Files**

Run the preparation script:
```bash
# Windows
prepare-deployment.bat

# Linux/Mac
chmod +x prepare-deployment.sh
./prepare-deployment.sh
```

### **Step 2: Configure Render.com**

1. **Go to your Render dashboard**
2. **Edit your web service settings**
3. **Update these settings:**

```
Root Directory: server
Build Command: echo "No build required"
Start Command: node swagger-server.js
```

### **Step 3: Environment Variables**

Add these environment variables in Render:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |

### **Step 4: Deploy**

1. **Save your settings**
2. **Trigger a new deployment**
3. **Wait for deployment to complete**

## 🔧 Alternative: Create New Service

If you want to start fresh:

### **Option A: New Web Service**

1. **Create new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure:**

```
Name: iremecorner-api-docs
Environment: Node
Region: Choose closest to your users
Branch: backend
Root Directory: server
Build Command: echo "No build required"
Start Command: node swagger-server.js
```

### **Option B: Use render.yaml**

1. **Ensure `render.yaml` is in your repository root**
2. **Create new Blueprint on Render**
3. **Connect your repository**
4. **Render will auto-configure from the YAML file**

## 📁 Required Files Structure

Make sure your repository has this structure:

```
iremeCorner/
├── server/
│   ├── swagger-server.js
│   ├── swagger.json
│   ├── package.json
│   ├── render.yaml
│   └── prepare-deployment.bat
└── render.yaml (optional)
```

## 🧪 Testing Your Deployment

After deployment, test these endpoints:

1. **Health Check:** `https://your-app.onrender.com/health`
2. **Interactive Docs:** `https://your-app.onrender.com/api-docs`
3. **JSON Schema:** `https://your-app.onrender.com/swagger.json`

## 🐛 Troubleshooting

### **Common Issues:**

1. **"Cannot find module" error:**
   - ✅ Set Root Directory to `server`
   - ✅ Ensure `swagger-server.js` exists in server folder

2. **"Build failed" error:**
   - ✅ Use Build Command: `echo "No build required"`
   - ✅ Check that `package.json` exists

3. **"Port not found" error:**
   - ✅ Set PORT environment variable to `10000`
   - ✅ Check Start Command: `node swagger-server.js`

4. **"Health check failed":**
   - ✅ Set Health Check Path to `/health`
   - ✅ Wait for deployment to complete

### **Debug Steps:**

1. **Check Render logs** for specific error messages
2. **Verify file structure** matches requirements
3. **Test locally** using `node swagger-server.js`
4. **Check environment variables** are set correctly

## 🎉 Success Indicators

When deployment is successful, you'll see:

- ✅ **Build successful** message
- ✅ **Health check passing**
- ✅ **Service running** status
- ✅ **Accessible endpoints**

## 📱 What You'll Get

After successful deployment:

- **📚 Interactive API Documentation** with 68 endpoints
- **🔐 JWT Authentication** support
- **📱 Mobile-responsive** design
- **🧪 Interactive testing** capabilities
- **📄 JSON schema** endpoint
- **🔍 Health monitoring**

## 🚀 Next Steps

1. **Test all endpoints** in the interactive docs
2. **Share the URL** with your team
3. **Set up monitoring** for uptime
4. **Customize styling** if needed
5. **Add custom domain** (optional)

---

**Need help?** Check the Render logs and ensure all file paths are correct! 🎯
