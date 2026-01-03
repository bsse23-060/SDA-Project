# Healthcare Management System - Complete Architecture Guide

## System Overview

This is a Java Spring Boot microservices architecture with a React frontend for managing patient data.

### Services Analyzed

#### 1. **Auth Service** (Spring Boot)
- **Port**: 4004 (via API Gateway)
- **Purpose**: User authentication and JWT token generation
- **Database**: PostgreSQL

**Endpoints**:
```
POST /auth/login
- Input: { email, password }
- Output: { token }
- Validation: Email required, Password min 8 chars

GET /auth/validate
- Input: Authorization header with Bearer token
- Output: 200 OK or 401 Unauthorized
```

**Credentials**:
- Email: testuser@test.com
- Password: password123

---

#### 2. **Patient Service** (Spring Boot)
- **Port**: 4004 (via API Gateway)
- **Purpose**: Patient CRUD operations
- **Database**: PostgreSQL (patient-service-db)
- **Messaging**: Kafka integration for events

**Endpoints**:
```
GET /api/patients
- Returns: List of PatientResponseDTO
- Auth: Required (Bearer token)

POST /api/patients
- Input: PatientRequestDTO
- Output: PatientResponseDTO
- Auth: Required
- Validation: Name (required, max 100), Email (required, valid), 
  Address (required), DOB (required), RegisteredDate (required for new)

PUT /api/patients/{id}
- Input: PatientRequestDTO
- Output: PatientResponseDTO
- Auth: Required

DELETE /api/patients/{id}
- Output: 204 No Content
- Auth: Required
```

**Data Models**:

**PatientRequestDTO**:
```javascript
{
  name: "string (required, max 100)",
  email: "string (required, email)",
  address: "string (required)",
  dateOfBirth: "string (required, date)",
  registeredDate: "string (required for create, optional for update)"
}
```

**PatientResponseDTO**:
```javascript
{
  id: "UUID",
  name: "string",
  email: "string",
  address: "string",
  dateOfBirth: "string"
}
```

---

#### 3. **Billing Service** (Spring Boot)
- **Purpose**: Patient billing management
- **Protocol**: gRPC
- **Notes**: Proto files defined for service communication

---

#### 4. **Analytics Service** (Spring Boot)
- **Purpose**: Event analytics processing
- **Integration**: Kafka consumer for patient events

---

## Frontend Architecture

### Technology Stack
- **Framework**: React 18.2.0
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API
- **Styling**: CSS3 with responsive design

### Project Structure
```
frontend/
├── public/
│   └── index.html                    # HTML entry point
├── src/
│   ├── components/
│   │   ├── Login.js                  # Login component
│   │   ├── PatientManagement.js      # Main patient management
│   │   ├── PatientForm.js            # Form for create/update
│   │   ├── PatientList.js            # Patient list table
│   │   └── ProtectedRoute.js         # Route protection
│   ├── context/
│   │   └── AuthContext.js            # Auth state & hooks
│   ├── services/
│   │   └── apiService.js             # API & fallback logic
│   ├── styles/
│   │   ├── AuthStyles.css            # Login styles
│   │   ├── PatientStyles.css         # Patient management styles
│   │   └── index.css                 # Global styles
│   ├── App.js                        # Main app routing
│   ├── index.js                      # React entry point
│   └── index.css                     # Global CSS
├── package.json
├── .env.example
├── .gitignore
└── FRONTEND_README.md
```

---

## API Integration Layer

### Service Layer (`apiService.js`)

The service layer provides abstraction over API calls with built-in error handling and fallback data.

**Authentication Service**:
```javascript
authService.login(email, password)
  → Returns: { success, token, error, isUsingFallback }

authService.validateToken(token)
  → Returns: { valid, error, isUsingFallback }

authService.logout()
  → Clears auth token from localStorage

authService.getToken()
  → Returns: stored JWT token or null

authService.isAuthenticated()
  → Returns: boolean
```

**Patient Service**:
```javascript
patientService.getPatients()
  → Returns: { data: PatientDTO[], error, isUsingFallback }

patientService.createPatient(patientData)
  → Returns: { data: PatientDTO, error, isUsingFallback }

patientService.updatePatient(patientId, patientData)
  → Returns: { data: PatientDTO, error, isUsingFallback }

patientService.deletePatient(patientId)
  → Returns: { success: boolean, error, isUsingFallback }
```

---

## Fallback Data Strategy

### Purpose
Ensures application remains functional when backend API is unavailable.

### Fallback Patients
```javascript
[
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main Street, Springfield',
    dateOfBirth: '1985-05-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    address: '456 Oak Avenue, Shelbyville',
    dateOfBirth: '1990-03-22',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    address: '789 Pine Road, Capital City',
    dateOfBirth: '1978-11-08',
  },
]
```

### Fallback Token
```javascript
'demo-token-fallback-12345'
```

### Fallback Behavior

| Operation | API Success | API Failure |
|-----------|-------------|-------------|
| Login | Returns real token | Returns fallback token |
| Validate Token | Returns valid/invalid | Accepts any non-empty token |
| Get Patients | Returns DB records | Returns fallback patients |
| Create Patient | Saves to DB | Creates locally with temp ID |
| Update Patient | Updates in DB | Updates locally |
| Delete Patient | Deletes from DB | Simulates deletion locally |

---

## Authentication Flow

### Login Process
1. User enters email & password on Login page
2. Frontend calls `POST /auth/login` with credentials
3. Backend validates credentials and returns JWT token
4. Token stored in browser's localStorage
5. User redirected to patient management page

### Token Usage
- All subsequent API requests include `Authorization: Bearer <token>` header
- Protected routes verify token before rendering
- Invalid token redirects user to login

### Token Validation
- Called implicitly when accessing protected routes
- Validates JWT signature and expiration
- Invalid tokens trigger logout

---

## State Management

### AuthContext
Manages global authentication state using React Context API.

**State**:
```javascript
{
  isAuthenticated: boolean,     // User logged in
  token: string | null,          // JWT token
  loading: boolean,              // Initial load state
  usingFallback: boolean,        // Using fallback data
}
```

**Actions**:
```javascript
login(email, password)           // Authenticate user
logout()                         // Clear authentication
```

**Hook**:
```javascript
const { isAuthenticated, token, login, logout, usingFallback } = useAuth();
```

---

## Component Hierarchy

```
App
├── Router
│   ├── /login → Login
│   └── /patients → ProtectedRoute
│       └── PatientManagement
│           ├── PatientForm (conditionally)
│           └── PatientList
└── AuthProvider (context wrapper)
```

---

## Data Flow

### Patient List Load
```
PatientManagement (mount)
  ↓
useEffect checks authentication
  ↓
fetchPatients()
  ↓
patientService.getPatients()
  ↓
API Call: GET /api/patients
  ↓
Success → setPatients(data)
Failure → setPatients(fallbackData)
  ↓
PatientList renders patients in table
```

### Patient Create
```
PatientForm (submit)
  ↓
validateForm()
  ↓
patientService.createPatient(formData)
  ↓
API Call: POST /api/patients
  ↓
Success → Add to state, close form, show success
Failure → Create locally, show fallback warning
```

---

## Validation Rules

### Patient Form
```
Name:
  - Required: Yes
  - Max length: 100 characters
  
Email:
  - Required: Yes
  - Format: Valid email address
  
Address:
  - Required: Yes
  - Max length: Unlimited
  
Date of Birth:
  - Required: Yes
  - Format: YYYY-MM-DD
  
Registered Date:
  - Required: Yes (new patients only)
  - Format: YYYY-MM-DD
```

### Login Form
```
Email:
  - Required: Yes
  - Format: Valid email address
  
Password:
  - Required: Yes
  - Min length: 8 characters
```

---

## Error Handling

### Error Types

1. **Network Errors**: API unreachable
   - Status: Connection refused
   - Action: Use fallback data

2. **Authentication Errors**: Invalid credentials
   - Status: 401 Unauthorized
   - Action: Show error message, allow retry

3. **Validation Errors**: Invalid data submitted
   - Status: 400 Bad Request
   - Action: Show field-level errors

4. **Not Found Errors**: Resource doesn't exist
   - Status: 404 Not Found
   - Action: Show error message

5. **Server Errors**: Backend issues
   - Status: 500+ Server Error
   - Action: Use fallback data, show warning

### Error Display
- **Red banner**: Critical errors requiring user action
- **Yellow banner**: Fallback data being used
- **Field errors**: Below form inputs

---

## Security Considerations

### Token Storage
- Tokens stored in localStorage (vulnerable to XSS)
- Consider moving to httpOnly cookies for production

### CORS
- Frontend runs on port 3000
- Backend (API Gateway) on port 4004
- CORS headers must be configured on backend

### Password
- Transmitted over HTTPS only (required for production)
- Minimum 8 characters enforced
- No password recovery shown in demo

---

## Environment Configuration

### Development
```
REACT_APP_API_BASE_URL=http://localhost:4004
```

### Production
```
REACT_APP_API_BASE_URL=https://api.yourdomain.com
```

---

## Running the Application

### Prerequisites
- Node.js v14+
- npm or yarn
- Java 21+ (for backend)
- Docker (for containerization)

### Frontend Setup
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your API URL
```

### Building for Production
```bash
npm run build
# Creates optimized build in build/ directory
```

---

## Testing the System

### Manual Testing Checklist
- [ ] Login with demo credentials
- [ ] View patient list from API
- [ ] Create new patient
- [ ] Edit existing patient
- [ ] Delete patient with confirmation
- [ ] Logout and verify redirect to login
- [ ] Stop backend and verify fallback data
- [ ] Form validation (missing fields, invalid email)
- [ ] Session timeout (token expiration)
- [ ] Responsive design on mobile/tablet

### Testing Fallback
```bash
# Set invalid API URL
REACT_APP_API_BASE_URL=http://invalid.local:9999

# Or stop backend services
docker-compose down

# Frontend automatically uses fallback data
```

---

## Deployment

### Docker
```dockerfile
# Build React app
npm run build

# Copy to static server
# Nginx/Apache with fallback routing to index.html
```

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync build/ s3://your-bucket/
# Configure CloudFront distribution
```

### Environment Variables
- Set `REACT_APP_API_BASE_URL` to API Gateway URL
- Update CORS settings on backend

---

## Future Enhancements

1. **Features**
   - Billing service integration
   - Analytics dashboard
   - Patient search/filtering
   - Pagination
   - Export to PDF

2. **Security**
   - Move tokens to httpOnly cookies
   - Add password reset functionality
   - Implement role-based access control
   - Add audit logging

3. **Performance**
   - Add caching (React Query)
   - Implement pagination
   - Optimize bundle size
   - Add lazy loading

4. **Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)
   - API contract testing

---

## Support & Troubleshooting

### Port Already in Use
```bash
# Change port
PORT=3001 npm start
```

### CORS Errors
- Ensure backend API Gateway has CORS configured
- Check API URL in .env file
- Verify frontend and backend can communicate

### Blank Page
- Check browser console for errors
- Verify .env configuration
- Clear localStorage and reload

### Login Fails
- Verify credentials: testuser@test.com / password123
- Check backend auth service is running
- Look for fallback warning (should still allow login)
