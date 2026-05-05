# API Reference

Complete reference for all Pyadra API endpoints.

---

## 🌐 Base URL

**Development**: `http://localhost:3000/api`  
**Production**: `https://pyadra.io/api`

---

## 📋 Table of Contents

- [Observer System](#observer-system)
- [EterniCapsule](#eternicapsule)
- [Orbit 77](#orbit-77)
- [Figurines](#figurines)
- [Statistics](#statistics)
- [Stripe Webhooks](#stripe-webhooks)
- [Error Handling](#error-handling)

---

## 🔭 Observer System

### POST /api/observer
**Purpose**: Create a new observer record  
**Authentication**: None required

**Request**:
```typescript
POST /api/observer
Content-Type: application/json

// No body required
```

**Response**:
```typescript
{
  "id": 1234,           // Unique observer number
  "created_at": "2026-05-05T10:30:00Z"
}
```

**Error Responses**:
```typescript
// Database connection failure
{
  "error": "Database unavailable",
  "transient_id": 0  // Fallback ID
}
```

**Usage**: Called on home page first visit to assign observer ID

---

## 💊 EterniCapsule

### POST /api/ethernicapsule/checkout
**Purpose**: Create Stripe checkout session for new capsule  
**Authentication**: None required

**Request**:
```typescript
POST /api/ethernicapsule/checkout
Content-Type: application/json

{
  "product_id": "eternicapsule",
  "quantity": 1,
  "metadata": {
    "sender_email": "user@example.com",
    "recipient_email": "friend@example.com",
    "unlock_date": "2027-01-01",
    "message_preview": "Happy New Year...",
    "guardian_email": "guardian@example.com"  // Optional
  }
}
```

**Response**:
```typescript
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

**Error Responses**:
```typescript
// Missing required fields
{
  "error": "Missing required metadata fields",
  "status": 400
}

// Stripe error
{
  "error": "Payment processing failed",
  "status": 500
}
```

---

### POST /api/ethernicapsule/verify
**Purpose**: Verify capsule key (sender or recipient)  
**Authentication**: None (key-based access)

**Request**:
```typescript
POST /api/ethernicapsule/verify
Content-Type: application/json

{
  "key": "abc123...",  // Capsule or sender key
  "type": "capsule"    // "capsule" or "sender"
}
```

**Response**:
```typescript
{
  "success": true,
  "capsuleId": "uuid-here"
}
```

**Error Responses**:
```typescript
// Invalid key
{
  "error": "This key does not match any capsule",
  "status": 404
}

// Invalid type
{
  "error": "Invalid key type",
  "status": 400
}
```

---

### POST /api/ethernicapsule/edit
**Purpose**: Edit capsule message (sender key required)  
**Authentication**: Sender key verification

**Request**:
```typescript
POST /api/ethernicapsule/edit
Content-Type: application/json

{
  "capsule_id": "uuid-here",
  "sender_key": "abc123...",
  "message_ciphertext": "encrypted-message",
  "unlock_date": "2027-06-01"  // Optional: update unlock date
}
```

**Response**:
```typescript
{
  "success": true,
  "message": "Capsule updated successfully"
}
```

---

### POST /api/ethernicapsule/guardian-access
**Purpose**: Grant guardian access to capsule  
**Authentication**: Guardian email verification

**Request**:
```typescript
POST /api/ethernicapsule/guardian-access
Content-Type: application/json

{
  "capsule_id": "uuid-here",
  "guardian_email": "guardian@example.com",
  "reason": "Emergency access requested"
}
```

**Response**:
```typescript
{
  "success": true,
  "capsule_key": "abc123...",
  "message": "Guardian access granted"
}
```

---

## 🌍 Orbit 77

### POST /api/donate
**Purpose**: Create donation checkout session  
**Authentication**: None required

**Request**:
```typescript
POST /api/donate
Content-Type: application/json

{
  "amount": 5000,  // Amount in cents (AUD)
  "intent": "orbit-support",
  "supporter_name": "John Doe",
  "supporter_email": "john@example.com",
  "display_publicly": true
}
```

**Response**:
```typescript
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

---

### GET /api/stats/orbit-fund
**Purpose**: Get current funding statistics  
**Authentication**: None required

**Request**:
```typescript
GET /api/stats/orbit-fund
```

**Response**:
```typescript
{
  "total": 12345,  // Total raised in cents (AUD)
  "supporters": 42,
  "goal": 50000
}
```

---

### POST /api/applications
**Purpose**: Submit Orbit 77 participation application  
**Authentication**: None required

**Request**:
```typescript
POST /api/applications
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "location": "Melbourne, AU",
  "why": "I want to share stories about...",
  "availability": "Weekends preferred"
}
```

**Response**:
```typescript
{
  "success": true,
  "message": "Application submitted successfully"
}
```

---

## 🎭 Figurines

### POST /api/figurines/checkout
**Purpose**: Create checkout session for figurine order  
**Authentication**: None required

**Request**:
```typescript
POST /api/figurines/checkout
Content-Type: application/json

{
  "product_id": "figurine",
  "quantity": 1,
  "metadata": {
    "customer_name": "John Doe",
    "customer_email": "john@example.com",
    "shipping_address": "123 Main St, City, Country",
    "front_photo_url": "https://...",
    "left_photo_url": "https://...",
    "right_photo_url": "https://..."
  }
}
```

**Response**:
```typescript
{
  "url": "https://checkout.stripe.com/c/pay/cs_test_...",
  "sessionId": "cs_test_..."
}
```

---

### POST /api/figurines/upload
**Purpose**: Upload selfie photos for figurine generation  
**Authentication**: None (session-based)

**Request**:
```http
POST /api/figurines/upload
Content-Type: multipart/form-data

front_photo: (binary)
left_photo: (binary)
right_photo: (binary)
```

**Response**:
```typescript
{
  "success": true,
  "urls": {
    "front": "https://storage.../front.jpg",
    "left": "https://storage.../left.jpg",
    "right": "https://storage.../right.jpg"
  }
}
```

**Limits**:
- Max file size: 5MB per photo
- Accepted formats: JPEG, PNG
- Required: All 3 angles (front, left, right)

---

## 📊 Statistics

### GET /api/stats
**Purpose**: Get general platform statistics  
**Authentication**: None required

**Request**:
```typescript
GET /api/stats
```

**Response**:
```typescript
{
  "observers": 1234,
  "capsules_sealed": 567,
  "orbit_supporters": 89,
  "figurines_created": 12
}
```

---

### POST /api/home/complete
**Purpose**: Record home game completion stats  
**Authentication**: None required

**Request**:
```typescript
POST /api/home/complete
Content-Type: application/json

{
  "observer_id": "1234",
  "time_elapsed": 45.2,
  "pulses_sent": 12,
  "decode_attempts": 3
}
```

**Response**:
```typescript
{
  "success": true
}
```

---

## 💳 Stripe Webhooks

### POST /api/stripe/webhook
**Purpose**: Handle Stripe webhook events  
**Authentication**: Stripe signature verification

**Request**:
```http
POST /api/stripe/webhook
Stripe-Signature: t=...,v1=...

{
  "type": "checkout.session.completed",
  "data": {
    "object": { ... }
  }
}
```

**Supported Events**:
- `checkout.session.completed` - Payment successful
- `payment_intent.succeeded` - Payment confirmed
- `payment_intent.payment_failed` - Payment failed

**Response**:
```typescript
{
  "received": true
}
```

**Error Responses**:
```typescript
// Invalid signature
{
  "error": "Invalid webhook signature",
  "status": 400
}
```

---

## ⚠️ Error Handling

### Standard Error Response Format
```typescript
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",  // Optional
  "status": 400  // HTTP status code
}
```

### Common Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `MISSING_FIELDS` | 400 | Required fields not provided |
| `INVALID_KEY` | 404 | Capsule key not found |
| `UNAUTHORIZED` | 401 | Authentication failed |
| `PAYMENT_FAILED` | 500 | Stripe checkout error |
| `DATABASE_ERROR` | 500 | Supabase connection issue |
| `VALIDATION_ERROR` | 400 | Input validation failed |

---

## 🔒 Security

### Rate Limiting
Currently **no rate limiting** implemented. Consider adding for production:
- `/api/observer` - 10 requests per hour per IP
- `/api/applications` - 5 requests per hour per IP
- `/api/donate` - 20 requests per hour per IP

### Authentication
- Most endpoints are **public** (no auth required)
- **Key-based access** for capsule operations (sender/recipient keys)
- **Webhook verification** using Stripe signatures

### Input Validation
All user inputs are:
- Sanitized using `sanitizeString()` from `/lib/validation.ts`
- Validated for required fields
- Checked for SQL injection patterns

---

## 📚 Related Documentation

- **Environment Variables** (`/docs/ENVIRONMENT_VARIABLES.md`) - API key configuration
- **Database Schema** (`/docs/DATABASE_SCHEMA.md`) - Data models
- **Architecture** (`/ARCHITECTURE.md`) - System design
