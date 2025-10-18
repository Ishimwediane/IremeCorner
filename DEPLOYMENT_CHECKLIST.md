# 🚀 Render Deployment Checklist - Backend Branch

## ✅ **Pre-Deployment Checklist**

### **1. Branch Configuration**
- [ ] **Branch:** `backend` (not main)
- [ ] **Root Directory:** `server`
- [ ] **Build Command:** `echo "No build required"`
- [ ] **Start Command:** `node swagger-server.js`

### **2. Environment Variables**
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`

### **3. Required Files in Backend Branch**
- [ ] `server/swagger-server.js`
- [ ] `server/swagger.json`
- [ ] `server/package.json`
- [ ] `server/render.yaml` (optional)

## 🔧 **Render Dashboard Settings**

When configuring your Render service, use these exact settings:

```
Service Name: iremecorner-api-docs
Environment: Node
Region: Choose closest to your users
Branch: backend
Root Directory: server
Build Command: echo "No build required"
Start Command: node swagger-server.js
Health Check Path: /health
```

## 🎯 **Quick Fix Steps**

1. **Go to Render Dashboard**
2. **Edit your web service**
3. **Change Branch from `main` to `backend`**
4. **Ensure Root Directory is `server`**
5. **Save and redeploy**

## 🧪 **Test After Deployment**

Once deployed, test these URLs:

- **Health Check:** `https://your-app.onrender.com/health`
- **Interactive Docs:** `https://your-app.onrender.com/api-docs`
- **JSON Schema:** `https://your-app.onrender.com/swagger.json`

## 🐛 **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| "Cannot find module" | ✅ Set Branch to `backend` |
| "Wrong directory" | ✅ Set Root Directory to `server` |
| "Build failed" | ✅ Use Build Command: `echo "No build required"` |
| "Port error" | ✅ Set PORT environment variable to `10000` |

## 🎉 **Success Indicators**

- ✅ **Build successful** message
- ✅ **Health check passing**
- ✅ **Service running** status
- ✅ **All endpoints accessible**

---

**Ready to deploy?** Make sure your branch is set to `backend` in Render! 🚀
