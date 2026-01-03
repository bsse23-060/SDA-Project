import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSync, FaTrash, FaPencilAlt, FaFileInvoiceDollar, FaClock, FaCheckCircle, FaDollarSign, FaUser } from 'react-icons/fa';
import { patientService, billingService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';
import BillingForm from './BillingForm';
import '../styles/BillingStyles.css';

const BillingManagement = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [isAuthenticated, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    // Fetch patients for reference
    const patientsResult = await patientService.getPatients();
    if (patientsResult.data) {
      setPatients(patientsResult.data);
    }

    // Fetch bills
    const billsResult = await billingService.getBills();
    if (billsResult.data) {
      setBills(billsResult.data);
    } else {
      setError('Failed to load bills');
    }
    setLoading(false);
  };

  const handleCreateBill = async (billData) => {
    const result = await billingService.createBill(billData);
    
    if (result.data) {
      setBills([...bills, result.data]);
      setShowForm(false);
    } else {
      setError('Failed to create bill');
    }
  };

  const handleUpdateBill = async (billId, billData) => {
    const result = await billingService.updateBill(billId, billData);
    
    if (result.data) {
      setBills(bills.map((b) => (b.id === billId ? result.data : b)));
      setEditingBill(null);
    } else {
      setError('Failed to update bill');
    }
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      const result = await billingService.deleteBill(billId);
      
      if (result.success) {
        setBills(bills.filter((b) => b.id !== billId));
      } else {
        setError('Failed to delete bill');
      }
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const filteredBills = filterStatus === 'all' 
    ? bills 
    : bills.filter(b => b.status === filterStatus);

  const stats = {
    total: bills.reduce((sum, b) => sum + (b.amount || 0), 0),
    pending: billingService.getTotalByStatus('pending'),
    paid: billingService.getTotalByStatus('paid'),
    overdue: billingService.getTotalByStatus('overdue'),
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="billing-management">
      <header className="billing-header">
        <div className="header-left">
          <h1><FaFileInvoiceDollar /> Billing Management</h1>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/patients')} className="btn-nav">
            <FaUser /> Patients
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}

      {/* Stats Dashboard */}
      <div className="stats-container">
        <div className="stat-card total">
          <div className="stat-icon"><FaDollarSign /></div>
          <div className="stat-content">
            <p className="stat-label">Total Bills</p>
            <p className="stat-value">${stats.total.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card pending">
          <div className="stat-icon"><FaClock /></div>
          <div className="stat-content">
            <p className="stat-label">Pending</p>
            <p className="stat-value">${stats.pending.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card paid">
          <div className="stat-icon"><FaCheckCircle /></div>
          <div className="stat-content">
            <p className="stat-label">Paid</p>
            <p className="stat-value">${stats.paid.toFixed(2)}</p>
          </div>
        </div>
        <div className="stat-card overdue">
          <div className="stat-icon"><FaFileInvoiceDollar /></div>
          <div className="stat-content">
            <p className="stat-label">Overdue</p>
            <p className="stat-value">${stats.overdue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="billing-content">
        <div className="billing-sidebar">
          <button
            className="btn-primary"
            onClick={() => {
              setShowForm(true);
              setEditingBill(null);
            }}
          >
            <FaPlus /> New Bill
          </button>
          <button
            className="btn-secondary"
            onClick={fetchData}
            disabled={loading}
          >
            <FaSync className={loading ? 'spinning' : ''} /> Refresh
          </button>

          <div className="filter-section">
            <h3>Filter by Status</h3>
            <div className="filter-buttons">
              {['all', 'pending', 'paid', 'overdue'].map(status => (
                <button
                  key={status}
                  className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                  onClick={() => setFilterStatus(status)}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="billing-main">
          {showForm && (
            <div className="form-container">
              <BillingForm
                bill={editingBill}
                patients={patients}
                onSubmit={
                  editingBill
                    ? (data) => handleUpdateBill(editingBill.id, data)
                    : handleCreateBill
                }
                onCancel={() => {
                  setShowForm(false);
                  setEditingBill(null);
                }}
              />
            </div>
          )}

          {!showForm && (
            <div className="bills-list">
              {loading ? (
                <div className="loading">Loading bills...</div>
              ) : filteredBills.length > 0 ? (
                <div className="bills-grid">
                  {filteredBills.map(bill => (
                    <div key={bill.id} className={`bill-card status-${bill.status}`}>
                      <div className="bill-header">
                        <div>
                          <h3>{bill.description || 'Medical Service'}</h3>
                          <p className="bill-patient">{getPatientName(bill.patientId)}</p>
                        </div>
                        <div className={`status-badge status-${bill.status}`}>
                          {bill.status.toUpperCase()}
                        </div>
                      </div>

                      <div className="bill-details">
                        <div className="detail-row">
                          <span className="label">Amount:</span>
                          <span className="value">${(bill.amount || 0).toFixed(2)}</span>
                        </div>
                        <div className="detail-row">
                          <span className="label">Date:</span>
                          <span className="value">
                            {new Date(bill.createdAt || new Date()).toLocaleDateString()}
                          </span>
                        </div>
                        {bill.dueDate && (
                          <div className="detail-row">
                            <span className="label">Due Date:</span>
                            <span className="value">
                              {new Date(bill.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {bill.notes && (
                          <div className="detail-row">
                            <span className="label">Notes:</span>
                            <span className="value">{bill.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="bill-actions">
                        <button
                          className="btn-edit"
                          onClick={() => {
                            setEditingBill(bill);
                            setShowForm(true);
                          }}
                        >
                          <FaPencilAlt /> Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => handleDeleteBill(bill.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <FaFileInvoiceDollar className="empty-icon" />
                  <p>No bills found</p>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setShowForm(true);
                      setEditingBill(null);
                    }}
                  >
                    Create First Bill
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
