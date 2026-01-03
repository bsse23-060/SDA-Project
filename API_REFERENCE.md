# API Reference - Frontend to Backend

## Base URL
```
http://localhost:4004
```

Environment variable: `REACT_APP_API_BASE_URL`

---

## Authentication Service

### Login
**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "testuser@test.com",
  "password": "password123"
}
```

**Response (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (401 Unauthorized)**:
```
(No body)
```

**Frontend Usage**:
```javascript
const result = await authService.login(email, password);
if (result.success) {
  // Token stored in localStorage
  navigate('/patients');
} else {
  // Show error message
  setError(result.error);
}
```

**Fallback**: Returns demo token when API unavailable

---

### Validate Token
**Endpoint**: `GET /auth/validate`

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**:
```
(Empty body)
```

**Response (401 Unauthorized)**:
```
(Empty body)
```

**Frontend Usage**:
```javascript
const result = await authService.validateToken(token);
if (!result.valid) {
  logout();
  navigate('/login');
}
```

**Fallback**: Accepts any non-empty token

---

## Patient Service

### Get All Patients
**Endpoint**: `GET /api/patients`

**Request Headers**:
```
Authorization: Bearer <token>
```

**Response (200 OK)**:
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "address": "123 Main Street, Springfield",
    "dateOfBirth": "1985-05-15"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "address": "456 Oak Avenue, Shelbyville",
    "dateOfBirth": "1990-03-22"
  }
]
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

**Frontend Usage**:
```javascript
const result = await patientService.getPatients();
if (result.data) {
  setPatients(result.data);
  if (result.error) {
    setFallbackMessage(result.error); // Show warning
  }
}
```

**Fallback**: Returns 3 sample patients

---

### Create Patient
**Endpoint**: `POST /api/patients`

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue, Shelbyville",
  "dateOfBirth": "1990-03-22",
  "registeredDate": "2024-11-28"
}
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue, Shelbyville",
  "dateOfBirth": "1990-03-22"
}
```

**Response (400 Bad Request)**:
```json
{
  "error": "Name cannot exceed 100 characters"
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

**Frontend Usage**:
```javascript
const result = await patientService.createPatient({
  name: "New Patient",
  email: "patient@example.com",
  address: "Some Address",
  dateOfBirth: "1990-01-01",
  registeredDate: "2024-11-28"
});

if (result.data) {
  setPatients([...patients, result.data]);
  if (result.isUsingFallback) {
    setFallbackMessage('Using fallback data - API unavailable');
  }
}
```

**Validation**:
- name: Required, max 100 characters
- email: Required, valid email format
- address: Required
- dateOfBirth: Required, YYYY-MM-DD format
- registeredDate: Required, YYYY-MM-DD format

**Fallback**: Creates patient with generated ID locally

---

### Update Patient
**Endpoint**: `PUT /api/patients/{id}`

**Request Headers**:
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue, Shelbyville",
  "dateOfBirth": "1990-03-22"
}
```

**URL Parameters**:
```
id: UUID of patient to update
```

**Response (200 OK)**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Jane Smith Updated",
  "email": "jane.smith@example.com",
  "address": "456 Oak Avenue, Shelbyville",
  "dateOfBirth": "1990-03-22"
}
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Patient not found"
}
```

**Frontend Usage**:
```javascript
const result = await patientService.updatePatient(patientId, {
  name: "Updated Name",
  email: "updated@example.com",
  address: "New Address",
  dateOfBirth: "1990-01-01"
});

if (result.data) {
  setPatients(
    patients.map(p => p.id === patientId ? result.data : p)
  );
}
```

**Validation**:
- name: Required, max 100 characters
- email: Required, valid email format
- address: Required
- dateOfBirth: Required, YYYY-MM-DD format
- registeredDate: Not used for updates

**Fallback**: Updates patient data locally

---

### Delete Patient
**Endpoint**: `DELETE /api/patients/{id}`

**Request Headers**:
```
Authorization: Bearer <token>
```

**URL Parameters**:
```
id: UUID of patient to delete
```

**Response (204 No Content)**:
```
(Empty body)
```

**Response (401 Unauthorized)**:
```json
{
  "error": "Unauthorized"
}
```

**Response (404 Not Found)**:
```json
{
  "error": "Patient not found"
}
```

**Frontend Usage**:
```javascript
const result = await patientService.deletePatient(patientId);

if (result.success) {
  setPatients(patients.filter(p => p.id !== patientId));
}
```

**Fallback**: Simulates successful deletion locally

---

## Error Handling

### HTTP Status Codes

| Code | Meaning | Fallback |
|------|---------|----------|
| 200 | Success | N/A |
| 201 | Created | N/A |
| 204 | No Content | N/A |
| 400 | Bad Request (Validation) | Uses fallback |
| 401 | Unauthorized | Logs out user |
| 404 | Not Found | Uses fallback |
| 500 | Server Error | Uses fallback |
| Network Error | API Unreachable | Uses fallback |

### Error Response Format

**Frontend receives**:
```javascript
{
  data: null,           // Actual data if success
  error: "error message", // Error description if failed
  success: boolean,     // Only for delete
  isUsingFallback: boolean // True if using hardcoded data
}
```

### Example Error Handling

```javascript
const result = await patientService.getPatients();

if (result.data) {
  // Success - could be real or fallback data
  setPatients(result.data);
  
  if (result.isUsingFallback) {
    // Show warning that this is fallback data
    showWarning('API unavailable - showing demo data');
  }
} else {
  // Critical error
  showError(result.error);
}
```

---

## Request/Response Examples

### Complete Login Flow

**1. User Login Request**:
```javascript
POST http://localhost:4004/auth/login
Content-Type: application/json

{
  "email": "testuser@test.com",
  "password": "password123"
}
```

**2. Server Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**3. Token Stored**:
```javascript
localStorage.setItem('authToken', token);
```

**4. Subsequent Request with Token**:
```javascript
GET http://localhost:4004/api/patients
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Complete Patient Create Flow

**1. Create Request**:
```javascript
POST http://localhost:4004/api/patients
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main Street",
  "dateOfBirth": "1985-05-15",
  "registeredDate": "2024-11-28"
}
```

**2. Success Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main Street",
  "dateOfBirth": "1985-05-15"
}
```

**3. Frontend Update**:
```javascript
// Add new patient to list
setPatients([...patients, newPatient]);
// Close form
setShowForm(false);
// Clear form
setFormData({...});
```

---

## Data Types

### PatientRequestDTO
```typescript
{
  name: string;           // Required, max 100 chars
  email: string;          // Required, email format
  address: string;        // Required
  dateOfBirth: string;    // Required, YYYY-MM-DD
  registeredDate?: string; // Required for create only, YYYY-MM-DD
}
```

### PatientResponseDTO
```typescript
{
  id: string;           // UUID
  name: string;         // 1-100 characters
  email: string;        // Valid email
  address: string;      // Patient address
  dateOfBirth: string;  // YYYY-MM-DD
}
```

### LoginRequestDTO
```typescript
{
  email: string;        // Required, valid email
  password: string;     // Required, min 8 chars
}
```

### LoginResponseDTO
```typescript
{
  token: string;        // JWT token
}
```

---

## Testing with curl

### Login
```bash
curl -X POST http://localhost:4004/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@test.com",
    "password": "password123"
  }'
```

### Get Patients
```bash
curl -X GET http://localhost:4004/api/patients \
  -H "Authorization: Bearer <token>"
```

### Create Patient
```bash
curl -X POST http://localhost:4004/api/patients \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Patient",
    "email": "patient@example.com",
    "address": "123 Street",
    "dateOfBirth": "1990-01-01",
    "registeredDate": "2024-11-28"
  }'
```

### Update Patient
```bash
curl -X PUT http://localhost:4004/api/patients/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "address": "New Address",
    "dateOfBirth": "1990-01-01"
  }'
```

### Delete Patient
```bash
curl -X DELETE http://localhost:4004/api/patients/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer <token>"
```

### Validate Token
```bash
curl -X GET http://localhost:4004/auth/validate \
  -H "Authorization: Bearer <token>"
```

---

## Troubleshooting

### Token Expired
- Response: 401 Unauthorized
- Fix: Frontend logs out and redirects to login

### Invalid Credentials
- Response: 401 Unauthorized
- Fix: Show login error, allow retry with fallback

### Network Error
- Response: Connection refused
- Fix: Automatically use fallback data

### Validation Error
- Response: 400 Bad Request with error message
- Fix: Display validation errors in form

### Server Error
- Response: 500+ Server Error
- Fix: Use fallback data and show warning

---

## Rate Limiting (If Configured)

If backend implements rate limiting:
- Response: 429 Too Many Requests
- Wait before retrying
- Frontend should show message to user

---

## CORS Configuration

Frontend (port 3000) requires CORS headers from backend (port 4004):

```
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Versioning

API version: v1 (implied)
Frontend compatible with: Java Spring Boot 3.4.0+

---

**Last Updated**: 2024-11-28
**API Stable**: Yes
