import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSync, FaFileInvoiceDollar, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { patientService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import PatientForm from './PatientForm';
import PatientList from './PatientList';
import '../styles/PatientStyles.css';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchPatients();
  }, [isAuthenticated, navigate]);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);

    const result = await patientService.getPatients();
    
    if (result.data) {
      setPatients(result.data);
    } else {
      setError('Failed to load patients');
    }
    setLoading(false);
  };

  const handleCreatePatient = async (patientData) => {
    const result = await patientService.createPatient(patientData);
    
    if (result.data) {
      setPatients([...patients, result.data]);
      setShowForm(false);
    } else {
      setError('Failed to create patient');
    }
  };

  const handleUpdatePatient = async (patientId, patientData) => {
    const result = await patientService.updatePatient(patientId, patientData);
    
    if (result.data) {
      setPatients(
        patients.map((p) => (p.id === patientId ? result.data : p))
      );
      setEditingPatient(null);
    } else {
      setError('Failed to update patient');
    }
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      const result = await patientService.deletePatient(patientId);
      
      if (result.success) {
        setPatients(patients.filter((p) => p.id !== patientId));
      } else {
        setError('Failed to delete patient');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="patient-management">
      <header className="header">
        <div className="header-left">
          <h1><FaUsers /> Patient Management</h1>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/billing')} className="btn-nav">
            <FaFileInvoiceDollar /> Billing
          </button>
          <button onClick={handleLogout} className="btn-logout">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="content">
        <div className="sidebar">
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingPatient(null);
            }}
          >
            <FaPlus /> Add Patient
          </button>
          <button
            className="btn-secondary"
            onClick={fetchPatients}
            disabled={loading}
          >
            <FaSync className={loading ? 'spinning' : ''} /> Refresh
          </button>
        </div>

        <div className="main-content">
          {showForm && (
            <PatientForm
              patient={editingPatient}
              onSubmit={
                editingPatient
                  ? (data) => handleUpdatePatient(editingPatient.id, data)
                  : handleCreatePatient
              }
              onCancel={() => {
                setShowForm(false);
                setEditingPatient(null);
              }}
            />
          )}

          {!showForm && (
            <PatientList
              patients={patients}
              onEdit={(patient) => {
                setEditingPatient(patient);
                setShowForm(true);
              }}
              onDelete={handleDeletePatient}
              loading={loading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;
