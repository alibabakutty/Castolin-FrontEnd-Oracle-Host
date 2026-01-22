import { useEffect, useState } from 'react';
import api from '../services/api';
import { auth } from '../auth/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { AuthContext } from './authConstants';

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [distributorUser, setDistributorUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSigningUp, setIsSigningUp] = useState(false);

  // Helper function to extract user data from various response structures
  const extractUserData = (responseData) => {
    if (!responseData) return null;
    
    // Structure 1: { success: true, data: {...} }
    if (responseData.data && typeof responseData.data === 'object') {
      return responseData.data;
    }
    // Structure 2: { success: true, user: {...} }
    if (responseData.user && typeof responseData.user === 'object') {
      return responseData.user;
    }
    // Structure 3: Array response [{...}]
    if (Array.isArray(responseData) && responseData.length > 0) {
      return responseData[0];
    }
    // Structure 4: Direct object
    if (typeof responseData === 'object' && responseData !== null) {
      return responseData;
    }
    
    return null;
  };

  // Helper to normalize field names (Oracle returns uppercase)
  const normalizeUserData = (data) => {
    if (!data) return null;
    
    return {
      id: data.ID || data.id,
      username: data.USERNAME || data.username,
      email: data.EMAIL || data.email,
      role: data.ROLE || data.role,
      mobile_number: data.MOBILE_NUMBER || data.mobile_number,
      customer_name: data.CUSTOMER_NAME || data.customer_name,
      customer_code: data.CUSTOMER_CODE || data.customer_code,
      firebase_uid: data.FIREBASE_UID || data.firebase_uid,
      state: data.STATE || data.state
    };
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async firebaseUser => {
      // Skip auth state processing during signup
      if (isSigningUp) {
        console.log('Skipping auth state change during signup');
        return;
      }

      setLoading(true);

      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        let userData = null;
        let userRole = null;
        let userType = null;

        try {
          // Try stored user type first
          const storedUserType = localStorage.getItem('userType');
          console.log('Stored user type on refresh:', storedUserType);

          // Define endpoints
          const endpointMap = {
            admin: '/me-admin',
            distributor: '/me-distributor',
            corporate: '/me-corporate',
          };

          // If we have stored type, try that endpoint first
          if (storedUserType && endpointMap[storedUserType]) {
            try {
              console.log(`Trying stored endpoint: ${endpointMap[storedUserType]}`);
              const res = await api.get(endpointMap[storedUserType], {
                headers: { Authorization: `Bearer ${token}` },
              });

              console.log(`${storedUserType} response:`, res.data);
              
              const extracted = extractUserData(res.data);
              if (extracted) {
                userData = normalizeUserData(extracted);
                if (userData && userData.role) {
                  userRole = userData.role;
                  userType = storedUserType;
                  console.log(`Found ${userType} with role: ${userRole}`);
                }
              }
            } catch (err) {
              console.warn(`${storedUserType} endpoint failed:`, err.message);
              // Clear invalid stored type
              localStorage.removeItem('userType');
            }
          }

          // If no role found, try all endpoints (admin first since it's most common)
          if (!userRole) {
            console.log('Trying all endpoints to find user...');
            const endpoints = [
              { path: '/me-admin', type: 'admin' },
              { path: '/me-distributor', type: 'distributor' },
              { path: '/me-corporate', type: 'corporate' },
            ];

            for (const endpoint of endpoints) {
              try {
                console.log(`Trying endpoint: ${endpoint.path}`);
                const res = await api.get(endpoint.path, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                console.log(`${endpoint.type} response:`, res.data);
                
                const extracted = extractUserData(res.data);
                if (extracted) {
                  userData = normalizeUserData(extracted);
                  if (userData && userData.role) {
                    userRole = userData.role;
                    userType = endpoint.type;
                    
                    // Store for next time
                    localStorage.setItem('userType', userType);
                    localStorage.setItem('userRole', userRole);
                    
                    console.log(`Found user as ${userType} with role: ${userRole}`);
                    break;
                  }
                }
              } catch (err) {
                console.warn(`${endpoint.type} endpoint failed:`, err.message);
                // Continue to next endpoint
              }
            }
          }

          // If still no role, set minimal user info
          if (!userRole) {
            console.log('No role found in database, setting minimal user info');
            userData = {
              email: firebaseUser.email,
              uid: firebaseUser.uid
            };
            userRole = 'unknown';
            userType = 'unknown';
          }

          // Set user context
          const contextUser = {
            ...firebaseUser,
            role: userRole,
            username: userData?.username || null,
            customer_name: userData?.customer_name || null,
            id: userData?.id || null,
            email: userData?.email || firebaseUser.email,
            // Store the full user data for reference
            _userData: userData
          };

          setUser(contextUser);
          setRole(userRole);
          
          // Set distributor data separately if applicable
          if (userType === 'distributor') {
            setDistributorUser(userData);
          }

          console.log('Auth state updated on refresh:', { 
            role: userRole, 
            userType, 
            email: firebaseUser.email 
          });

        } catch (err) {
          console.error('Auth state fetch failed:', err);
          
          // Fallback: set user with basic info
          setUser({
            ...firebaseUser,
            role: null
          });
          setRole(null);
          setDistributorUser(null);
        }
      } else {
        // No user logged in - clear everything
        console.log('No user logged in');
        localStorage.removeItem('userType');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        setUser(null);
        setDistributorUser(null);
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isSigningUp]);

  const login = async (email, password) => {
    try {
      console.log('Admin login attempt for:', email);
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      console.log('Firebase login successful, UID:', firebaseUser.uid);
      console.log('Token obtained, calling /me-admin endpoint...');

      const res = await api.get('/me-admin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Login response:", res.data);

      // Extract user data using helper
      const extracted = extractUserData(res.data);
      if (!extracted) {
        throw new Error("No user data received from server");
      }

      const userData = normalizeUserData(extracted);
      const userRole = userData.role || 'admin';

      console.log('Extracted user data:', userData);
      console.log('User role:', userRole);

      // Store in localStorage for persistence
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Create context user object
      const contextUser = {
        ...firebaseUser,
        role: userRole,
        username: userData.username,
        id: userData.id,
        email: userData.email || firebaseUser.email,
        _userData: userData
      };

      // Set state immediately
      setUser(contextUser);
      setRole(userRole);
      setDistributorUser(null);

      return {
        success: true,
        role: userRole,
        user: firebaseUser,
        userData: userData
      };
    } catch (error) {
      console.error('Login failed:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Login failed';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message.includes('auth/')) {
        errorMessage = 'Invalid email or password';
      } else if (error.message.includes('404')) {
        errorMessage = 'Admin account not found. Please contact administrator.';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const loginDistributor = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      console.log('Distributor login attempt, calling /me-distributor...');
      const res = await api.get('/me-distributor', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Distributor login response:", res.data);

      const extracted = extractUserData(res.data);
      if (!extracted) {
        throw new Error("No distributor data received");
      }

      const userData = normalizeUserData(extracted);
      const userRole = userData.role || 'distributor';

      // Store in localStorage
      localStorage.setItem('userType', 'distributor');
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Set state
      const contextUser = {
        ...firebaseUser,
        role: userRole,
        username: userData.customer_name || userData.username,
        id: userData.customer_code,
        email: userData.email || firebaseUser.email,
        _userData: userData
      };

      setUser(contextUser);
      setRole(userRole);
      setDistributorUser(userData);

      return {
        success: true,
        role: userRole,
        user: firebaseUser,
        userData: userData
      };
    } catch (error) {
      console.error('Distributor login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || error.message || 'Distributor login failed' 
      };
    }
  };

  const loginCorporate = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      console.log('Corporate login attempt, calling /me-corporate...');
      const res = await api.get('/me-corporate', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Corporate login response:", res.data);

      const extracted = extractUserData(res.data);
      if (!extracted) {
        throw new Error("No corporate data received");
      }

      const userData = normalizeUserData(extracted);
      const userRole = userData.role || 'corporate';

      // Store in localStorage
      localStorage.setItem('userType', 'corporate');
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('userData', JSON.stringify(userData));

      // Set state
      const contextUser = {
        ...firebaseUser,
        role: userRole,
        username: userData.customer_name || userData.username,
        id: userData.customer_code,
        email: userData.email || firebaseUser.email,
        _userData: userData
      };

      setUser(contextUser);
      setRole(userRole);
      setDistributorUser(null);

      return {
        success: true,
        role: userRole,
        user: firebaseUser,
        userData: userData
      };
    } catch (error) {
      console.error('Corporate login failed:', error);
      return { 
        success: false, 
        message: error.response?.data?.error || error.message || 'Corporate login failed' 
      };
    }
  };

  const loginAdmin = async (email = 'admin123@gmail.com', password = '12345678') => {
    return login(email, password);
  };

  // Rest of your functions remain the same (signup, createDistributorFirebaseAccount, etc.)
  const signup = async (username, email, password, userType = 'admin', mobileNumber) => {
    setIsSigningUp(true);
    try {
      // 1. Create Firebase user
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      // 2. Create user in appropriate table
      const endpoint = userType === 'admin' ? '/signup-admin' : 'undefine-signup';

      const res = await api.post(
        endpoint,
        {
          username,
          email,
          mobile_number: mobileNumber,
          firebaseUid: firebaseUser.uid,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Extract response
      const extracted = extractUserData(res.data);
      const userData = normalizeUserData(extracted);
      const userRole = userData?.role || userType;

      // Store for auto-login
      if (userType === 'admin') {
        localStorage.setItem('userType', 'admin');
        localStorage.setItem('userRole', userRole);
        localStorage.setItem('userData', JSON.stringify(userData));
      }

      return {
        success: true,
        role: userRole,
        userType: userType,
        message: res.data?.message,
        userData: userData
      };
    } catch (error) {
      console.error('Signup failed:', error);

      // Cleanup Firebase user if MySQL failed
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (deleteError) {
          console.error('Error cleaning up Firebase user:', deleteError);
        }
      }

      throw {
        success: false,
        message: error.response?.data?.error || error.message || 'Signup failed',
      };
    } finally {
      setIsSigningUp(false);
    }
  };

  const createDistributorFirebaseAccount = async (usercode, updates, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      const updatePayload = {
        ...updates,
        firebase_uid: firebaseUser.uid,
        email: email,
        status: 'active',
      };

      const res = await api.put(`/distributors/${usercode}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sign out the distributor immediately
      await signOut(auth);

      // Automatically re-login as admin
      const adminLoginResult = await loginAdmin('admin123@gmail.com', '12345678');

      return {
        success: true,
        message: res.data?.message,
        affectedRows: res.data?.affectedRows,
        adminReLogin: adminLoginResult.success,
      };
    } catch (error) {
      console.error('Distributor Firebase creation failed:', error);
      if (auth.currentUser && auth.currentUser.email === email) {
        await auth.currentUser.delete();
      }
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  };

  const createDirectOrderFirebaseAccount = async (usercode, updates, email, password) => {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      const updatePayload = {
        ...updates,
        firebase_uid: firebaseUser.uid,
        email: email,
        status: 'active',
      };

      const res = await api.put(`corporates/${usercode}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await signOut(auth);

      const adminLoginResult = await loginAdmin('admin123@gmail.com', '12345678');

      return {
        success: true,
        message: res.data?.message,
        affectedRows: res.data?.affectedRows,
        adminReLogin: adminLoginResult.success,
      };
    } catch (error) {
      console.error('Direct Order Firebase creation failed!', error);
      if (auth.currentUser && auth.currentUser.email === email) {
        await auth.currentUser.delete();
      }
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    }
  };

  const signupDirectOrder = async (usercode, updates, email, password) => {
    setIsSigningUp(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      const updatePayload = {
        ...updates,
        firebase_uid: firebaseUser.uid,
        email: email,
      };

      const res = await api.put(`/corporates/${usercode}`, updatePayload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Sign out the corporate user immediately
      await signOut(auth);

      return {
        success: true,
        message: res.data?.message,
        affectedRows: res.data?.affectedRows,
      };
    } catch (error) {
      console.error('Direct Order update failed:', error);

      if (auth.currentUser && auth.currentUser.email === email) {
        await auth.currentUser.delete();
      }
      return {
        success: false,
        message: error.response?.data?.error || error.message,
      };
    } finally {
      setIsSigningUp(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userData');
    return signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        distributorUser,
        signup,
        createDistributorFirebaseAccount,
        createDirectOrderFirebaseAccount,
        loginAdmin,
        signupDirectOrder,
        login,
        loginDistributor,
        loginCorporate,
        logout,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;