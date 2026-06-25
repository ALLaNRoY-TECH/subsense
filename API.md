# SubSense API Documentation

SubSense strictly implements a uniform JSON payload specification for all API Route responses:

**Success Structure:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Structure:**
```json
{
  "success": false,
  "error": "Human readable error message."
}
```

---

## Authentication Routes

### `GET /api/auth/google`
Initiates the OAuth 2.0 flow with Google.
* **Response:** 302 Redirect to Google Consent Screen (or Sandbox bypass).

### `GET /api/auth/callback`
Handles the OAuth 2.0 redirect payload from Google.
* **Query Params:** `code` (OAuth verification string).
* **Response:** 302 Redirect to `/dashboard`. Sets `subsense_session` cookie securely.

### `GET /api/auth/me`
Validates the current session.
* **Response Format:**
  ```json
  {
    "success": true,
    "data": { "authenticated": true, "user": { "id": "...", "name": "...", "email": "..." } }
  }
  ```

### `POST /api/auth/logout`
Destroys the user session.
* **Response Format:**
  ```json
  { "success": true }
  ```

---

## Core Routes

### `GET /api/subscriptions`
Retrieves the user's active tracking portfolio.
* **Response Format:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "sub-1",
        "name": "Netflix Premium",
        "price": 649,
        "currency": "₹",
        "category": "Entertainment",
        "status": "active",
        "billing_frequency": "monthly"
      }
    ]
  }
  ```

### `POST /api/insights`
Generates an AI-powered financial roast and recommendation health report.
* **Request Format:**
  ```json
  {
    "subscriptions": [ ... array of active subscriptions ... ]
  }
  ```
* **Response Format:**
  ```json
  {
    "success": true,
    "data": {
      "healthScore": 85,
      "roast": "You're bleeding money on duplicate streaming services.",
      "totalWasted": 4500,
      "recommendations": [ "Cancel Hulu, you already have Netflix." ]
    }
  }
  ```

### `POST /api/scan/gmail`
Scans the user's Gmail inbox for recent subscription receipts and billing confirmations.
* **Request Format:**
  ```json
  {
    "token": "google_oauth_access_token_string"
  }
  ```
* **Response Format:**
  ```json
  {
    "success": true,
    "data": [
      { "name": "Spotify Premium", "price": 119, "status": "active" }
    ]
  }
  ```

### `POST /api/scan/pdf`
Performs visual OCR on a bank statement to locate recurring charges.
* **Request Format:**
  ```json
  {
    "base64Pdf": "JVBERi0xLjQKJcOkw7zDtsOfCjIgMCBvYmoKPDwvTGVuZ3Ro..."
  }
  ```
* **Response Format:**
  ```json
  {
    "success": true,
    "data": {
      "merchant": "Adobe Creative Cloud",
      "price": 4230,
      "currency": "₹",
      "icon": "💳",
      "confidence": "high"
    }
  }
  ```
