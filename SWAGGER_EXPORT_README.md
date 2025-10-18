# IremeCorner API Documentation

## 📚 Swagger Documentation Export

Your complete API documentation has been exported as JSON files for easy sharing and integration.

### 📄 Generated Files

- **`swagger.json`** - Compact JSON format (133KB)
- **`swagger-pretty.json`** - Pretty-printed JSON format (195KB)

### 🚀 Access Your API Documentation

#### Interactive Documentation (Swagger UI)
- **Local:** `http://localhost:5000/api-docs`
- **Production:** `https://your-domain.com/api-docs`

#### JSON Endpoint
- **Local:** `http://localhost:5000/swagger.json`
- **Production:** `https://your-domain.com/swagger.json`

### 📊 Documentation Coverage

**68 API Endpoints** documented across **9 categories:**

| Category | Endpoints | Description |
|----------|-----------|-------------|
| 🔐 Authentication | 8 endpoints | User registration, login, profile management |
| 📂 Categories | 5 endpoints | Category CRUD operations |
| 🛍️ Products | 8 endpoints | Product management and browsing |
| 📦 Orders | 7 endpoints | Order creation and management |
| 🎓 Courses | 10 endpoints | Course enrollment and management |
| 💳 Payments | 6 endpoints | Payment processing |
| 📦 Inventory | 12 endpoints | Stock management and analytics |
| 📝 Assignments | 7 endpoints | Assignment creation and grading |
| 🏆 Certificates | 5 endpoints | Certificate issuance and verification |

### 🔧 How to Use the Exported Files

#### 1. Import into Postman
1. Open Postman
2. Click "Import"
3. Select `swagger.json` or `swagger-pretty.json`
4. All endpoints will be imported with proper documentation

#### 2. Use with Swagger Editor
1. Go to [editor.swagger.io](https://editor.swagger.io)
2. Click "File" → "Import file"
3. Upload your `swagger.json` file
4. Edit and validate your API documentation

#### 3. Generate Client SDKs
Use tools like:
- **OpenAPI Generator:** Generate client libraries in multiple languages
- **Swagger Codegen:** Create SDKs for various platforms
- **Postman:** Generate code snippets

#### 4. Share with Team
- Send the JSON files to frontend developers
- Use in API documentation tools
- Integrate with CI/CD pipelines

### 🎯 Key Features

- **Interactive Testing:** Test all endpoints directly from Swagger UI
- **Authentication Support:** Built-in JWT token authorization
- **Request/Response Examples:** Complete examples for all endpoints
- **Schema Validation:** Detailed data models and validation rules
- **Error Documentation:** Comprehensive error response documentation
- **Role-based Access:** Clear indication of user permissions

### 🔐 Authentication

Most endpoints require JWT authentication:

1. **Register/Login** to get access token
2. **Click "Authorize"** in Swagger UI
3. **Enter:** `Bearer YOUR_JWT_TOKEN`
4. **Test protected endpoints**

### 📱 API Base URLs

- **Development:** `http://localhost:5000/api`
- **Production:** `https://api.iremecorner.com/api`

### 🛠️ Development

To regenerate the documentation:

```bash
# Run the export script
node export-swagger.js

# Or start the server and access
npm run dev
# Then visit: http://localhost:5000/api-docs
```

### 📞 Support

For API support and questions:
- **Email:** api-support@iremecorner.com
- **Documentation:** Available at `/api-docs`
- **JSON Schema:** Available at `/swagger.json`

---

**Generated on:** $(date)
**Total Endpoints:** 68
**API Version:** 1.0.0
