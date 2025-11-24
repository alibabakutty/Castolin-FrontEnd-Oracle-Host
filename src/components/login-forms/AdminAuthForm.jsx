import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/ContextProvider";
import { useCredentials } from "../hooks-credentials-history/userCredentials";

const AdminAuthForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsHistory, setShowCredentialsHistory] = useState(false);

  const { login, signup } = useAuth();
  const { credentialsHistory, saveCredentials, removeCredential } = useCredentials('admin');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation (keep your existing validation)
    if (!isLogin && password !== confirmPassword) {
      toast.error("Passwords don't match!", {
        position: 'bottom-right',
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    if (!isLogin && password.length < 6) {
      toast.error("Password must be at least 6 characters!", {
        position: 'bottom-right', 
        autoClose: 3000,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // For login, use email (not username) since Firebase uses email
        const loginEmail = username.includes('@') ? username : email;
        const result = await login(loginEmail, password);
        
        if (result.success) {
          // Save credentials after successful login
          await saveCredentials(loginEmail, password, username);
          
          if (result.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/unauthorized');
          }
        } else {
          toast.error(result.message || 'Login failed!');
        }
      } else {
        // Signup
        const result = await signup(username, email, password, 'admin', mobileNumber);
        if (result.success) {
          toast.success("Account created successfully!", {
            position: 'bottom-right', 
            autoClose: 3000,
          });
          
          // Save credentials after successful signup
          await saveCredentials(email, password, username, mobileNumber);
          
          // Auto-login after successful signup
          const loginResult = await login(email, password);
          if (loginResult.success) {
            if (loginResult.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/unauthorized');
            }
          }
        } else {
          toast.error(result.message || 'Signup failed!', {
            position: 'bottom-right',
            autoClose: 3000
          });
        }
      }
    } catch (err) {
      toast.error(err.message || (isLogin ? 'Login failed!' : 'Signup failed. Please try again.'));
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername("");
    setPassword("");
    setConfirmPassword("");
    setEmail("");
    setShowCredentialsHistory(false);
  };

  const useCredential = (credential) => {
    setEmail(credential.email);
    setPassword(credential.password);
    setUsername(credential.username || '');
    setShowCredentialsHistory(false);
  };

  const handleRemoveCredential = (email) => {
    removeCredential(email);
    toast.info("Credential removed from history", {
      position: 'bottom-right',
      autoClose: 3000,
    });
  };

  const isFormValid = () => {
    if (isLogin) {
      return username.trim() !== '' && password.trim() !== '';
    } else {
      return (
        username.trim() !== '' &&
        password.trim() !== '' &&
        confirmPassword.trim() !== '' &&
        email.trim() !== '' &&
        password === confirmPassword &&
        password.length >= 6
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-xl font-amasis text-white">
              {isLogin ? "Admin Login" : "Admin Sign Up"}
            </h3>
            <p className="text-white/70 text-xs font-amasis mt-1">
              {isLogin ? "Welcome back!" : "Create your account"}
            </p>
          </div>
          

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-white/80 text-xs font-amasis mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                placeholder="Enter username"
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div>
              <label className="block text-white/80 text-xs font-amasis mb-1">
                Mobile Number
              </label>
              <input
                type="text"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                placeholder="Enter mobile number"
                disabled={isLoading}
              />
            </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-white/80 text-xs font-amasis mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                  placeholder="Enter email"
                  disabled={isLoading}
                />
              </div>
            )}

            <div>
              <label className="block text-white/80 text-xs font-amasis mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                placeholder="Enter password"
                disabled={isLoading}
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-white/80 text-xs font-amasis mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
                {/* Inline validation messages */}
                <div className="h-4 mt-1">
                  {password !== confirmPassword && confirmPassword !== '' && (
                    <p className="text-red-300 text-xs font-amasis">Passwords don't match</p>
                  )}
                  {password.length < 6 && password !== '' && (
                    <p className="text-red-300 text-xs font-amasis">Min 6 characters</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-blue-300 hover:text-blue-200 text-xs font-amasis">
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={!isFormValid() || isLoading}
              className={`w-full py-2 rounded-lg font-semibold text-white transition-colors text-sm ${
                !isFormValid() || isLoading
                  ? 'bg-white/10 cursor-not-allowed text-white/50' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  {isLogin ? "Logging in..." : "Signing up..."}
                </div>
              ) : (
                isLogin ? "Login" : "Sign Up"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAuthForm;