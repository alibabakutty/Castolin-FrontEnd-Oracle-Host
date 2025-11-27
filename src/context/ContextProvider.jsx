import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { auth } from '../auth/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [distributorUser, setDistributorUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        let userData = null;
        let role = null;
        let distributorData = null;

        try {
          const storedUserType = localStorage.getItem('userType');
          const endpointMap = {
            admin: '/me-admin',
            distributor: '/me-distributor',
            corporate: '/me-corporate',
          };

          // Try stored type first if exists
          if (storedUserType && endpointMap[storedUserType]) {
            try {
              const res = await api.get(endpointMap[storedUserType], {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (res.data && res.data[0]) {
                userData = res.data[0];
                role = userData.role;
                
                // Set distributor data if user is distributor
                if (storedUserType === 'distributor') {
                  distributorData = userData;
                }
              }
            } catch (error) {
              console.warn(`${storedUserType} endpoint failed, trying all endpoints`);
              localStorage.removeItem('userType');
            }
          }

          // Try all endpoints if role not found
          if (!role) {
            const endpoints = [
              { path: '/me-admin', type: 'admin' },
              { path: '/me-distributor', type: 'distributor' },
              { path: '/me-corporate', type: 'corporate' }
            ];
            
            for (const endpoint of endpoints) {
              try {
                const res = await api.get(endpoint.path, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data && res.data[0]) {
                  userData = res.data[0];
                  role = userData.role;

                  // Set distributor data if user is distributor
                  if (endpoint.type === 'distributor') {
                    distributorData = userData;
                  }

                  // Persist user type for next time
                  localStorage.setItem('userType', endpoint.type);
                  break;
                }
              } catch (error) {
                // continue trying next endpoint
                continue;
              }
            }
          }

          // Set user and role states
          setUser({
            ...firebaseUser,
            role: userData?.role || null,
            username: userData?.username || null,
            customer_name: userData?.customer_name || null,
          });
          
          // Set distributor user data separately
          setDistributorUser(distributorData);
          setRole(userData?.role || null);
          
        } catch (err) {
          console.error('Auth state fetch failed:', err);
          setUser(firebaseUser);
          setDistributorUser(null);
          setRole(null);
        }
      } else {
        localStorage.removeItem('userType');
        setUser(null);
        setDistributorUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const login = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);

      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      const res = await api.get('/me-admin', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = res.data[0]?.role || null;

      // Immediately sync to context
      setUser({ ...firebaseUser, role });
      setRole(role);

      // Return consistent response structure
      return {
        success: true,
        role,
        user: firebaseUser,
      };
    } catch (error) {
      console.error('Login failed:', error);
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const loginDistributor = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      // Fetch role from backend
      const res = await api.get('/me-distributor', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = res.data[0]?.role || null;

      // Immediately sync to context
      setUser({ ...firebaseUser, role });
      setRole(role);

      return {
        success: true,
        role,
        user: firebaseUser,
      };
    } catch (error) {
      console.error('Distributor login failed:', error);
      return { success: false, message: error.message };
    }
  };

  const loginCorporate = async (email, password) => {
    try {
      const credential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      // fetch role from backend
      const res = await api.get('/me-corporate', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const role = res.data[0]?.role || null;

      // Immediately sync to context
      setUser({ ...firebaseUser, role });
      setRole(role);

      return {
        success: true,
        role,
        user: firebaseUser,
      };
    } catch (error) {
      console.error('Corporate login failed:', error);
      return { success: false, message: error.message };
    }
  };

  const signup = async (username, email, password, userType = 'admin', mobileNumber) => {
    try {
      // 1. Create Firebase user
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = credential.user;
      const token = await firebaseUser.getIdToken();

      // 2. Create user in appropriate MySQL table
      const endpoint =
        userType === 'admin'
          ? '/signup-admin'
          : 'undefine-signup';

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

      return {
        success: true,
        role: res.data?.role || userType,
        userType: userType,
        message: res.data?.message,
      };
    } catch (error) {
      console.error('Signup failed:', error);

      // If Firebase user was created but MySQL failed, delete Firebase user
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
    }
  };

  const signupDistributor = async (usercode, updates, email, password) => {
  try {
    // 1. Create Firebase user
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    const token = await firebaseUser.getIdToken();

    // 2. Prepare data for MySQL update
    const updatePayload = {
      ...updates,
      firebase_uid: firebaseUser.uid, // Add Firebase UID to the update
      email: email // Ensure email is included
    };

    // 3. Update distributor in MySQL database
    const res = await api.put(
      `/distributors/${usercode}`,
      updatePayload,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { 
      success: true, 
      message: res.data?.message,
      affectedRows: res.data?.affectedRows 
    };
  } catch (error) {
    console.error("Distributor update failed:", error);
    // Clean up Firebase user if MySQL update fails
    if (auth.currentUser) await auth.currentUser.delete();
    return {
      success: false,
      message: error.response?.data?.error || error.message
    };
  }
};

const signupDirectOrder = async (usercode, updates, email, password) => {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = credential.user;
    const token = await firebaseUser.getIdToken();

    const updatePayload = {
      ...updates,
      firebase_uid: firebaseUser.uid,
      email: email,
    };

    const res = await api.put(
      `/corporates/${usercode}`,
      updatePayload,
      { headers: { Authorization: `Bearer ${token}` }}
    );

    return {
      success: true,
      message: res.data?.message,
      affectedRows: res.data?.affectedRows
    };
  } catch (error) {
    console.error('Direct Order update failed:', error);

    if(auth.currentUser) await auth.currentUser.delete();
    return {
      success: false,
      message: error.response?.data?.error || error.message
    };
  }
};

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{ 
        role, 
        user, 
        distributorUser,
        signup, 
        signupDistributor,
        signupDirectOrder,
        login, 
        loginDistributor, 
        loginCorporate, 
        logout,
        loading // You might want to expose this too
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default ContextProvider;