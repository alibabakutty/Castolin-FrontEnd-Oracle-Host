import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/ContextProvider';
import { useCredentials } from '../hooks-credentials-history/userCredentials';
import { toast } from 'react-toastify';

const CorporateAuthForm = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCredentialsHistory, setShowCredentialsHistory] = useState(false);

  const { loginCorporate } = useAuth();
  const { credentialsHistory, saveCredentials, removeCredential } = useCredentials('corporate');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // validation
    if (!username.trim() || !password.trim()) {
      toast.error('Please enter both username and password!', {
        position: 'bottom-right',
        autoClose: 3000
      })
      setIsLoading(false);
      return;
    }

    try {
      // For login, use username as email if it contains '@' otherwise it's just username
      const loginEmail = username.includes('@') ? username : username;
      const result = await loginCorporate(loginEmail, password);

      if (result.success) {
        // save credentials after successful login
        await saveCredentials(loginEmail, password, username);

        if (result.role === 'corporate') {
          navigate('/corporate');
        } else if (result.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/unauthorized')
        }
      } else {
        toast.error(result.message || 'Login Failed!', {
          position: 'bottom-right',
          autoClose: 3000
        })
      }
    } catch (err) {
      toast.error(err.message || 'Login failed. please try again.');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const useCredential = (credential) => {
    setUsername(credential.email || credential.username || '');
    setPassword(credential.password);
    setShowCredentialsHistory(false);
  }

  const handleRemoveCredential = (email) => {
    removeCredential(email);
    toast.info('Credential removed from history', {
      position: 'bottom-right',
      autoClose: 3000
    });
  }

  const isFormValid = () => {
    return username.trim() !== '' && password.trim() !== '';
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Header */}
          <div className="text-center">
            <h3 className="text-xl font-amasis text-white">
              Corporate Login
            </h3>
            <p className="text-white/70 text-xs mt-1 font-amasis">
              Welcome back! Please login to continue
            </p>
          </div>

          {/* Credentials History Dropdown */}
          {credentialsHistory.length > 0 && (
            <div className="space-y-2 font-amasis">
              <button
                type="button"
                onClick={() => setShowCredentialsHistory(!showCredentialsHistory)}
                className="w-full text-left p-2 bg-white/5 border border-white/20 rounded-lg text-white/80 text-sm hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span>📋 Show saved credentials ({credentialsHistory.length})</span>
                  <span>{showCredentialsHistory ? '▲' : '▼'}</span>
                </div>
              </button>

              {showCredentialsHistory && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {credentialsHistory.map((credential, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-white/5 border border-white/10 rounded-lg"
                    >
                      <button
                        type="button"
                        onClick={() => useCredential(credential)}
                        className="flex-1 text-left text-white/80 text-sm hover:text-white transition-colors"
                      >
                        <div className="font-medium">{credential.email || credential.username}</div>
                        <div className="text-xs text-white/60">••••••••</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveCredential(credential.email)}
                        className="p-1 text-white/50 hover:text-red-400 transition-colors"
                        title="Remove from history"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-white/80 text-xs font-amasis mb-1">
                Username / Email
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                placeholder="Enter your username or email"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-white/80 text-xs font-amasis mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 outline-none focus:border-blue-400 text-sm font-amasis"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="text-right">
              <button type="button" className="text-blue-300 hover:text-blue-200 text-xs font-amasis">
                Forgot Password?
              </button>
            </div>

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
                  Logging in...
                </div>
              ) : (
                "Login as Corporate"
              )}
            </button>

            <div className="text-center">
              <p className="text-white/70 text-xs font-amasis">
                Don't have an corporate account?{" "}
                <span className="text-white/50 text-xs font-amasis">
                  Contact administrator
                </span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CorporateAuthForm