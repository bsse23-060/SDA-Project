import React from 'react';
import '../styles/PatientStyles.css';

const PatientList = ({ patients, onEdit, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  if (!patients || patients.length === 0) {
    return <div className="no-data">No patients found. Create a new one to get started.</div>;
  }

  return (
    <div className="patient-list">
      <h2>Patients ({patients.length})</h2>
      <div className="table-container">
        <table className="patient-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.email}</td>
                <td>{patient.address}</td>
                <td>{patient.dateOfBirth}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => onEdit(patient)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(patient.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PatientList;
