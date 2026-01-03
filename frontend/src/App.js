import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import PatientManagement from './components/PatientManagement';
import BillingManagement from './components/BillingManagement';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/patients"
            element={
              <ProtectedRoute>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/billing"
            element={
              <ProtectedRoute>
                <BillingManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/patients" replace />} />
          <Route path="*" element={<Navigate to="/patients" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
