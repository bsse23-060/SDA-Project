# Quick Start Guide - Healthcare Frontend

## 🚀 Get Started in 3 Minutes

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```
The app opens at `http://localhost:3000`

### 3. Login with Demo Credentials
- **Email**: testuser@test.com
- **Password**: password123

---

## 📋 What You Can Do

### View Patients
- See all patients in a table
- View name, email, address, date of birth

### Add Patient
- Click "+ Add Patient"
- Fill in the form
- Validation happens automatically
- Click "Create Patient"

### Edit Patient
- Click "Edit" button on any patient
- Update the information
- Click "Update Patient"

### Delete Patient
- Click "Delete" button on any patient
- Confirm deletion

### Logout
- Click "Logout" button in top-right
- Redirected to login page

---

## ⚙️ Configuration

### Change API URL (Optional)
Create `.env` file in frontend folder:
```
REACT_APP_API_BASE_URL=http://localhost:4004
```

### For Production
```
REACT_APP_API_BASE_URL=https://your-api-gateway.com
```

---

## 🔄 Test Fallback Data

Stop the backend services and the frontend will automatically use hardcoded sample data. You'll see a yellow warning: "⚠️ Using Fallback Data"

---

## 📦 Build for Production

```bash
npm run build
```

Creates an optimized build in the `build/` folder ready for deployment.

---

## 🧪 Form Validation Rules

### Patient Form
- **Name**: Required, max 100 characters
- **Email**: Required, valid email format
- **Address**: Required
- **Date of Birth**: Required, YYYY-MM-DD format
- **Registered Date**: Required for new patients only

### Login Form
- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters

---

## 🎨 UI Features

- **Modern Design**: Gradient header, clean layout
- **Responsive**: Works on mobile, tablet, and desktop
- **Form Validation**: Real-time error feedback
- **Fallback Indicators**: Yellow banner when API unavailable
- **Error Messages**: Red banners for critical errors
- **Loading States**: Shows loading indicators during API calls

---

## 🔐 Security Notes

1. Demo uses localStorage for tokens (development only)
2. For production, configure httpOnly cookies
3. All API calls include Bearer token authorization
4. Protected routes prevent unauthorized access

---

## 🐛 Troubleshooting

### Blank White Page
- Check browser console (F12)
- Verify .env configuration
- Clear browser cache and reload

### Can't Login
- Verify credentials: testuser@test.com / password123
- Check if backend is running on port 4004
- App should fallback to demo data if API unavailable

### Port 3000 Already in Use
```bash
PORT=3001 npm start
```

### API Connection Error
- This is normal! App uses fallback data
- Yellow banner confirms fallback mode
- All functionality works with demo data

---

## 📱 File Structure

```
frontend/
├── src/
│   ├── components/       # React components
│   ├── context/          # Auth state management
│   ├── services/         # API integration
│   ├── styles/           # CSS styling
│   ├── App.js            # Main app
│   └── index.js          # Entry point
├── public/
│   └── index.html        # HTML template
└── package.json          # Dependencies
```

---

## 🔗 API Endpoints Used

```
POST   /auth/login              Login
GET    /auth/validate           Validate token
GET    /api/patients            Get all patients
POST   /api/patients            Create patient
PUT    /api/patients/{id}       Update patient
DELETE /api/patients/{id}       Delete patient
```

---

## 📖 More Documentation

- [FRONTEND_README.md](./FRONTEND_README.md) - Detailed features
- [FRONTEND_INTEGRATION_GUIDE.md](../FRONTEND_INTEGRATION_GUIDE.md) - API details
- [COMPLETE_ARCHITECTURE.md](../COMPLETE_ARCHITECTURE.md) - Full system overview

---

## ✅ Verification Checklist

- [ ] npm install completed without errors
- [ ] npm start opens browser at localhost:3000
- [ ] Login page displays with demo credentials
- [ ] Can login and access patient management
- [ ] Can view patient list (real or fallback data)
- [ ] Can create new patient
- [ ] Can edit patient
- [ ] Can delete patient
- [ ] Logout works and returns to login
- [ ] Yellow fallback indicator appears if API down

---

## 🎓 Learning Resources

### React Concepts Used
- Functional Components
- Hooks (useState, useEffect, useContext, useNavigate)
- Context API for state management
- React Router for navigation
- Form handling and validation

### Backend Integration
- Axios for HTTP requests
- Bearer token authentication
- Error handling and fallback strategies
- Async/await for async operations

---

## 💡 Tips

1. **Demo Mode**: Works perfectly without backend
2. **Development**: Hot reload on file changes
3. **Debugging**: Open DevTools (F12) to inspect
4. **Mobile**: Rotate device to test responsive design
5. **Testing**: Try both real API and fallback modes

---

**Happy coding! 🎉**
