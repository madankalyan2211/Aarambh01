# 🚀 Aarambh LMS Backend API Server

Backend API server for handling email OTP verification using Gmail and Nodemailer.

---

## 📋 Features

✅ **Email OTP Service** - Send verification codes via Gmail  
✅ **OTP Management** - Generate, store, and verify OTPs  
✅ **Rate Limiting** - Prevent abuse with request throttling  
✅ **CORS Support** - Secure cross-origin requests  
✅ **Beautiful Email Templates** - Professional HTML emails  
✅ **Error Handling** - Comprehensive error responses  
✅ **Welcome Emails** - Post-registration emails  

---

## 🏗️ Project Structure

```
server/
├── config/
│   └── email.config.js      # Email transporter & templates
├── services/
│   ├── otp.service.js       # OTP generation & validation
│   └── email.service.js     # Email sending logic
├── routes/
│   └── auth.routes.js       # API endpoints
├── .env                      # Environment variables
├── package.json             # Dependencies
├── server.js                # Main server file
└── README.md                # This file
```

---

## ⚙️ Installation

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `nodemailer` - Email sending
- `cors` - Cross-origin support
- `dotenv` - Environment variables
- `express-rate-limit` - Rate limiting
- `nodemon` - Auto-restart (dev)

---

## 🔐 Configuration

The `.env` file is already configured with your Gmail credentials:

```env
# Server
PORT=3001
NODE_ENV=development

# Gmail
GMAIL_USER=teamaarambh01@gmail.com
GMAIL_APP_PASSWORD=rkzcbqxiuckobrlo
GMAIL_FROM_NAME=Aarambh LMS

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

# OTP
OTP_EXPIRY_MINUTES=10
OTP_LENGTH=6
OTP_MAX_ATTEMPTS=3

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

## 🚀 Running the Server

### Development Mode (with auto-restart)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

You should see:

```
🚀 ========================================
🚀 Aarambh LMS Backend Server Started
🚀 Environment: development
🚀 Server running on: http://localhost:3001
🚀 ========================================

📧 Email Service: Gmail
📧 From: teamaarambh01@gmail.com

✅ Email server is ready to send messages
✨ Ready to send OTP emails!
```

---

## 📡 API Endpoints

### Base URL
```
http://localhost:3001/api
```

### 1. Send OTP

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully",
  "email": "user@example.com",
  "expiresIn": 600
}
```

---

### 2. Verify OTP

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP verified successfully",
  "email": "user@example.com"
}
```

---

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP resent successfully",
  "email": "user@example.com",
  "expiresIn": 600
}
```

---

### 4. Send Welcome Email

**Endpoint:** `POST /api/auth/send-welcome`

**Request Body:**
```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Welcome email sent successfully"
}
```

---

### 5. Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## 🧪 Testing with cURL

### Send OTP
```bash
curl -X POST http://localhost:3001/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'
```

### Verify OTP
```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

---

## 🛡️ Security Features

### Rate Limiting

- **General API**: 100 requests per 15 minutes
- **OTP Endpoints**: 5 requests per minute

### CORS Protection

Only allowed origins can access the API:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (Alternative port)

### OTP Security

- ✅ 6-digit random OTP
- ✅ 10-minute expiration
- ✅ Maximum 3 verification attempts
- ✅ Automatic cleanup of expired OTPs

---

## 📧 Email Template

The OTP email includes:

- **Beautiful HTML design** with gradient branding
- **Large, clear OTP display**
- **Expiration time notice**
- **Security warning**
- **Professional footer**

---

## 🔧 Troubleshooting

### Error: "Email transporter verification failed"

**Solution:**
- Check Gmail credentials in `.env`
- Ensure App Password is correct (16 characters, no spaces)
- Verify 2-Step Verification is enabled

---

### Error: "ECONNREFUSED"

**Solution:**
- Check if port 3001 is available
- Stop any other process using port 3001
- Or change PORT in `.env`

---

### Error: "Invalid credentials"

**Solution:**
- Regenerate Gmail App Password
- Update `GMAIL_APP_PASSWORD` in `.env`
- Restart the server

---

### OTP Not Received

**Check:**
1. Email sent successfully (check server logs)
2. Check spam/junk folder
3. Verify Gmail account has sending enabled
4. Check Gmail sent folder

---

## 📊 Monitoring

### Server Logs

The server provides detailed logging:

```
✅ Email sent successfully! Message ID: <xxx@gmail.com>
📝 OTP stored for user@example.com: 123456 (expires in 10 minutes)
🧹 Cleaned up 3 expired OTPs
```

### Error Logs

```
❌ Email transporter verification failed: ...
❌ Error sending email: ...
```

---

## 🚀 Production Deployment

### Recommendations

1. **Use Environment Variables**
   - Store secrets in secure environment variables
   - Never commit `.env` to version control

2. **Use a Database**
   - Replace in-memory OTP storage with Redis/MongoDB
   - Add user session management

3. **Enable HTTPS**
   - Use SSL certificates
   - Update CORS origins

4. **Add Authentication**
   - Implement JWT tokens
   - Add API key authentication

5. **Use Professional Email Service**
   - Consider SendGrid, AWS SES, or Mailgun
   - Better deliverability and analytics

6. **Add Logging**
   - Use Winston or Pino for structured logging
   - Monitor with services like DataDog or New Relic

---

## 📝 Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `GMAIL_USER` | Gmail address | - |
| `GMAIL_APP_PASSWORD` | Gmail app password | - |
| `GMAIL_FROM_NAME` | Sender name | Aarambh LMS |
| `SMTP_HOST` | SMTP server | smtp.gmail.com |
| `SMTP_PORT` | SMTP port | 587 |
| `OTP_EXPIRY_MINUTES` | OTP validity | 10 |
| `OTP_LENGTH` | OTP digits | 6 |
| `OTP_MAX_ATTEMPTS` | Max verify attempts | 3 |
| `ALLOWED_ORIGINS` | CORS origins | localhost:5173 |

---

## 🆘 Support

If you encounter issues:

1. Check server logs for error messages
2. Verify all environment variables are set
3. Test with cURL to isolate frontend/backend issues
4. Check Gmail account status and quotas

---

**Built with ❤️ for Aarambh LMS**
