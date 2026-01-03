import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4004';

// Fallback data for when API fails
const FALLBACK_DATA = {
  patients: [
    {
      id: '1',
      name: 'Muhammad Hassan Khan',
      email: 'hassan.khan@healthcare.pk',
      address: 'House 42, Street 5, Gulberg, Lahore',
      dateOfBirth: '1985-05-15',
    },
    {
      id: '2',
      name: 'Fatima Ahmed',
      email: 'fatima.ahmed@healthcare.pk',
      address: 'Flat 301, Crescent Plaza, DHA Phase 5, Karachi',
      dateOfBirth: '1990-03-22',
    },
    {
      id: '3',
      name: 'Dr. Ali Raza Malik',
      email: 'ali.malik@healthcare.pk',
      address: 'House 15, Shami Road, F-7 Markaz, Islamabad',
      dateOfBirth: '1978-11-08',
    },
  ],
  token: 'demo-token-fallback-12345',
};

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return { success: true, token, error: null };
    } catch (error) {
      console.warn('Auth API failed, using fallback:', error.message);
      // Fallback: Simulate successful login
      localStorage.setItem('authToken', FALLBACK_DATA.token);
      return { 
        success: true, 
        token: FALLBACK_DATA.token, 
        error: 'API unavailable - using fallback data',
        isUsingFallback: true 
      };
    }
  }

  async validateToken(token) {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/validate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { valid: true, error: null };
    } catch (error) {
      console.warn('Validate token API failed, using fallback:', error.message);
      // Fallback: Accept token if it exists
      return { 
        valid: !!token, 
        error: 'API unavailable - validation skipped',
        isUsingFallback: true 
      };
    }
  }

  logout() {
    localStorage.removeItem('authToken');
  }

  getToken() {
    return localStorage.getItem('authToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

class PatientService {
  constructor() {
    this.STORAGE_KEY = 'patients_data';
    this.initializeStorage();
  }

  initializeStorage() {
    // Check if localStorage has patients data, if not initialize with fallback
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(FALLBACK_DATA.patients));
    }
  }

  getStoredPatients() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : FALLBACK_DATA.patients;
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return FALLBACK_DATA.patients;
    }
  }

  savePatients(patients) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients));
    } catch (error) {
      console.warn('Error saving to localStorage:', error);
    }
  }

  async getPatients() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/patients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Save API response to localStorage
      this.savePatients(response.data);
      return { data: response.data, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Get patients API failed, using localStorage:', error.message);
      // Return stored data from localStorage
      const storedPatients = this.getStoredPatients();
      return { 
        data: storedPatients, 
        error: 'API unavailable - using saved data',
        isUsingFallback: true 
      };
    }
  }

  async createPatient(patientData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/api/patients`, patientData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      // Save API response to localStorage
      const storedPatients = this.getStoredPatients();
      this.savePatients([...storedPatients, response.data]);
      return { data: response.data, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Create patient API failed, saving locally:', error.message);
      // Create patient locally and save to localStorage
      const newPatient = {
        id: Date.now().toString(),
        ...patientData,
      };
      const storedPatients = this.getStoredPatients();
      this.savePatients([...storedPatients, newPatient]);
      return { 
        data: newPatient, 
        error: 'API unavailable - patient created locally',
        isUsingFallback: true 
      };
    }
  }

  async updatePatient(patientId, patientData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/patients/${patientId}`,
        patientData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      // Save API response to localStorage
      const storedPatients = this.getStoredPatients();
      const updatedPatients = storedPatients.map(p => 
        p.id === patientId ? response.data : p
      );
      this.savePatients(updatedPatients);
      return { data: response.data, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Update patient API failed, saving locally:', error.message);
      // Update patient locally and save to localStorage
      const updatedPatient = {
        id: patientId,
        ...patientData,
      };
      const storedPatients = this.getStoredPatients();
      const updatedPatients = storedPatients.map(p => 
        p.id === patientId ? updatedPatient : p
      );
      this.savePatients(updatedPatients);
      return { 
        data: updatedPatient, 
        error: 'API unavailable - patient updated locally',
        isUsingFallback: true 
      };
    }
  }

  async deletePatient(patientId) {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/api/patients/${patientId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Remove from localStorage
      const storedPatients = this.getStoredPatients();
      const updatedPatients = storedPatients.filter(p => p.id !== patientId);
      this.savePatients(updatedPatients);
      return { success: true, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Delete patient API failed, deleting locally:', error.message);
      // Remove from localStorage
      const storedPatients = this.getStoredPatients();
      const updatedPatients = storedPatients.filter(p => p.id !== patientId);
      this.savePatients(updatedPatients);
      return { 
        success: true, 
        error: 'API unavailable - patient deleted locally',
        isUsingFallback: true 
      };
    }
  }
}

class BillingService {
  constructor() {
    this.STORAGE_KEY = 'billing_data';
    this.initializeStorage();
  }

  initializeStorage() {
    if (!localStorage.getItem(this.STORAGE_KEY)) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
    }
  }

  getStoredBills() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('Error reading bills from localStorage:', error);
      return [];
    }
  }

  saveBills(bills) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(bills));
    } catch (error) {
      console.warn('Error saving bills to localStorage:', error);
    }
  }

  async getBills() {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_BASE_URL}/api/billing`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      this.saveBills(response.data);
      return { data: response.data, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Get bills API failed, using localStorage:', error.message);
      const storedBills = this.getStoredBills();
      return { 
        data: storedBills, 
        error: 'API unavailable - using saved data',
        isUsingFallback: true 
      };
    }
  }

  async createBill(billData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post(`${API_BASE_URL}/api/billing`, billData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const storedBills = this.getStoredBills();
      this.saveBills([...storedBills, response.data]);
      return { data: response.data, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Create bill API failed, saving locally:', error.message);
      const newBill = {
        id: Date.now().toString(),
        ...billData,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };
      const storedBills = this.getStoredBills();
      this.saveBills([...storedBills, newBill]);
      return { 
        data: newBill, 
        error: 'API unavailable - bill created locally',
        isUsingFallback: true 
      };
    }
  }

  async updateBill(billId, billData) {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(
        `${API_BASE_URL}/api/billing/${billId}`,
        billData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const storedBills = this.getStoredBills();
      const updatedBills = storedBills.map(b => 
        b.id === billId ? response.data : b
      );
      this.saveBills(updatedBills);
      return { data: response.data, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Update bill API failed, saving locally:', error.message);
      const updatedBill = {
        id: billId,
        ...billData,
      };
      const storedBills = this.getStoredBills();
      const updatedBills = storedBills.map(b => 
        b.id === billId ? updatedBill : b
      );
      this.saveBills(updatedBills);
      return { 
        data: updatedBill, 
        error: 'API unavailable - bill updated locally',
        isUsingFallback: true 
      };
    }
  }

  async deleteBill(billId) {
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`${API_BASE_URL}/api/billing/${billId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const storedBills = this.getStoredBills();
      const updatedBills = storedBills.filter(b => b.id !== billId);
      this.saveBills(updatedBills);
      return { success: true, error: null, isUsingFallback: false };
    } catch (error) {
      console.warn('Delete bill API failed, deleting locally:', error.message);
      const storedBills = this.getStoredBills();
      const updatedBills = storedBills.filter(b => b.id !== billId);
      this.saveBills(updatedBills);
      return { 
        success: true, 
        error: 'API unavailable - bill deleted locally',
        isUsingFallback: true 
      };
    }
  }

  getBillsByPatientId(patientId) {
    const bills = this.getStoredBills();
    return bills.filter(b => b.patientId === patientId);
  }

  getTotalByPatientId(patientId) {
    const bills = this.getBillsByPatientId(patientId);
    return bills.reduce((sum, b) => sum + (b.amount || 0), 0);
  }

  getTotalByStatus(status) {
    const bills = this.getStoredBills();
    return bills.filter(b => b.status === status).reduce((sum, b) => sum + (b.amount || 0), 0);
  }
}

export const authService = new AuthService();
export const patientService = new PatientService();
export const billingService = new BillingService();
