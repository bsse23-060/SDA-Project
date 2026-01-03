# React Frontend - API Endpoints Summary

## Architecture Overview

The frontend is structured with:
- **Components**: React components for UI
- **Services**: API integration with fallback handlers
- **Context**: Authentication state management
- **Styles**: CSS styling for responsive design

## API Integration Details

### Login Flow
1. User enters email and password
2. Frontend calls `POST /auth/login`
3. Backend returns JWT token
4. Token stored in localStorage
5. Token included in all subsequent API calls

### Patient Management Flow
1. User must be authenticated (have valid token)
2. Frontend fetches patients: `GET /api/patients`
3. User can:
   - View all patients in table
   - Create new patient: `POST /api/patients`
   - Edit patient: `PUT /api/patients/{id}`
   - Delete patient: `DELETE /api/patients/{id}`

## Fallback Data Strategy

The `apiService.js` contains hardcoded fallback data used when:
- API server is unreachable
- Network request fails
- Authentication fails

All API methods return objects with:
```javascript
{
  data/success: [actual data or fallback],
  error: null | "error message",
  isUsingFallback: boolean
}
```

## Request/Response Examples

### Login Request
```javascript
POST /auth/login
Content-Type: application/json

{
  "email": "testuser@test.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Patients Request
```javascript
GET /api/patients
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "address": "123 Main Street",
    "dateOfBirth": "1985-05-15"
  },
  ...
]
```

### Create Patient Request
```javascript
POST /api/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue",
  "dateOfBirth": "1990-03-22",
  "registeredDate": "2024-11-28"
}

Response:
{
  "id": "uuid",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue",
  "dateOfBirth": "1990-03-22"
}
```

### Update Patient Request
```javascript
PUT /api/patients/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue",
  "dateOfBirth": "1990-03-22"
}

Response:
{
  "id": "uuid",
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue",
  "dateOfBirth": "1990-03-22"
}
```

### Delete Patient Request
```javascript
DELETE /api/patients/{id}
Authorization: Bearer <token>

Response:
204 No Content
```

## Environment Configuration

Create `.env` file in frontend root:
```
REACT_APP_API_BASE_URL=http://localhost:4004
```

## Starting the Frontend

```bash
# Install dependencies
npm install

# Start development server (runs on port 3000)
npm start

# Build for production
npm run build
```

## Features Implemented

✅ Login with email/password
✅ Patient list display
✅ Create new patient
✅ Edit existing patient
✅ Delete patient
✅ Form validation
✅ Authentication context
✅ Protected routes
✅ API error handling
✅ Fallback data on API failure
✅ Responsive UI
✅ Logout functionality
✅ Token-based authentication

## Testing the Fallback

To test the fallback functionality without a running backend:

1. Set `REACT_APP_API_BASE_URL` to an invalid address
2. Or simply stop the backend services
3. Application will automatically use fallback data
4. Yellow warning banner appears: "⚠️ Using Fallback Data"

## Error Messages

The frontend displays different error types:
- **Red errors**: Critical failures requiring user action
- **Yellow warnings**: API unavailable but using fallback data
- **Field errors**: Validation errors on form submission
