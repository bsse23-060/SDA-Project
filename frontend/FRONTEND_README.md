# Healthcare Management System - Frontend

A React-based frontend for the Java Spring Microservices healthcare management system with patient management capabilities.

## Features

- **Authentication**: Login system with token-based authentication
- **Patient Management**: Create, read, update, and delete patient records
- **API Integration**: Full integration with Java microservices backend
- **Fallback Data**: Hardcoded fallback data when API endpoints fail
- **Responsive Design**: Mobile-friendly UI with clean styling
- **Form Validation**: Client-side validation for patient data

## Project Structure

```
src/
├── components/
│   ├── Login.js              # Login page component
│   ├── PatientManagement.js  # Main patient management page
│   ├── PatientForm.js        # Patient form for create/update
│   ├── PatientList.js        # Patient list display table
│   └── ProtectedRoute.js     # Route protection wrapper
├── context/
│   └── AuthContext.js        # Authentication context and hooks
├── services/
│   └── apiService.js         # API service with fallback handlers
├── styles/
│   ├── AuthStyles.css        # Login page styles
│   └── PatientStyles.css     # Patient management styles
├── App.js                    # Main app routing
├── index.js                  # React entry point
└── index.css                 # Global styles
```

## API Endpoints

### Authentication Service
- **POST** `/auth/login` - Login with email and password
  - Request: `{ email, password }`
  - Response: `{ token }`
  
- **GET** `/auth/validate` - Validate JWT token
  - Header: `Authorization: Bearer <token>`
  - Response: `200 OK` or `401 Unauthorized`

### Patient Service
- **GET** `/api/patients` - Get all patients
  - Header: `Authorization: Bearer <token>`
  - Response: `[PatientDTO]`

- **POST** `/api/patients` - Create new patient
  - Header: `Authorization: Bearer <token>`
  - Request: `{ name, email, address, dateOfBirth, registeredDate }`
  - Response: `PatientDTO`

- **PUT** `/api/patients/{id}` - Update patient
  - Header: `Authorization: Bearer <token>`
  - Request: `{ name, email, address, dateOfBirth }`
  - Response: `PatientDTO`

- **DELETE** `/api/patients/{id}` - Delete patient
  - Header: `Authorization: Bearer <token>`
  - Response: `204 No Content`

## Fallback Data

The application includes hardcoded fallback data that is automatically used when API endpoints fail:

### Sample Patients
```javascript
[
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    address: '123 Main Street, Springfield',
    dateOfBirth: '1985-05-15',
  },
  // ... more patients
]
```

### Demo Credentials
- Email: `testuser@test.com`
- Password: `password123`

## Configuration

Set the API base URL via environment variable:
```bash
REACT_APP_API_BASE_URL=http://localhost:4004
```

Default: `http://localhost:4004`

## Installation & Running

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm start
```

The application will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

## Validation Rules

### Patient Form
- **Name**: Required, max 100 characters
- **Email**: Required, valid email format
- **Address**: Required
- **Date of Birth**: Required, date format
- **Registered Date**: Required for new patients only

### Login Form
- **Email**: Required, valid email format
- **Password**: Required, min 8 characters

## Error Handling

The application handles errors gracefully:

1. **API Failures**: Automatically falls back to hardcoded data
2. **Network Errors**: Shows user-friendly error messages
3. **Validation Errors**: Displays field-specific validation messages
4. **Authentication Failures**: Redirects to login page

## Key Components

### AuthContext
Manages authentication state and provides login/logout functionality.

### API Service
Wraps all API calls with error handling and fallback data management:
- `authService.login()`
- `authService.validateToken()`
- `patientService.getPatients()`
- `patientService.createPatient()`
- `patientService.updatePatient()`
- `patientService.deletePatient()`

### Protected Routes
Ensures only authenticated users can access patient management pages.

## Future Enhancements

- Add billing service integration
- Add analytics dashboard
- Implement patient search and filtering
- Add patient history/timeline view
- Implement pagination for large patient lists
- Add export to PDF functionality
- Real-time notifications for patient updates
