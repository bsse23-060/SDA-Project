import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaSignInAlt, FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthStyles.css';

const Login = () => {
  const [email, setEmail] = useState('testuser@test.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fallbackMessage, setFallbackMessage] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFallbackMessage(null);

    const result = await login(email, password);
    
    if (result.success) {
      if (result.error) {
        setFallbackMessage(result.error);
      }
      navigate('/patients');
    } else {
      setError(result.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <FaShieldAlt style={{ fontSize: '2.5rem', color: '#667eea', marginBottom: '0.5rem' }} />
        </div>
        <h1>Healthcare Manager</h1>
        <h2>Authentication System</h2>
        
        {error && <div className="error-message">{error}</div>}
        {fallbackMessage && <div className="fallback-message">{fallbackMessage}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email"><FaEnvelope style={{ marginRight: '0.5rem' }} />Email Address</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password"><FaLock style={{ marginRight: '0.5rem' }} />Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-submit">
            <FaSignInAlt style={{ marginRight: '0.5rem' }} />
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>


      </div>
    </div>
  );
};

export default Login;
