// TestConnection.jsx
import { useEffect } from 'react';
import api from '../services/api';

const TestConnection = () => {
  useEffect(() => {
    const testEndpoints = async () => {
      try {
        console.log('Testing backend connection...');
        
        // Test 1: Health endpoint
        const healthRes = await api.get('/api/health');
        console.log('✅ Health endpoint:', healthRes.data);
        
        // Test 2: Try me-admin (might fail without token)
        try {
          const meRes = await api.get('/me-admin');
          console.log('✅ /me-admin:', meRes.data);
        } catch (err) {
          console.log('⚠️ /me-admin requires auth:', err.message);
        }
        
      } catch (error) {
        console.error('❌ Backend test failed:', error.message);
        console.log('API Base URL:', api.defaults.baseURL);
      }
    };
    
    testEndpoints();
  }, []);
  
  return (
    <div style={{ padding: '20px' }}>
      <h3>Backend Connection Test</h3>
      <p>Check browser console for results</p>
    </div>
  );
};

export default TestConnection;