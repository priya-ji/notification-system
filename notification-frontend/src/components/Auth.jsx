import { useEffect, useState } from 'react';
import { getApiErrorMessage, userAPI } from '../services/api';
import '../styles/Auth.css';

const Auth = ({ onLoginSuccess, currentUser }) => {
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    email: '',
  });

  const handlePhoneChange = (value) => {
    setFormData({
      ...formData,
      phone_number: value.replace(/\D/g, '').slice(0, 10),
    });
  };

  // Logout is only meaningful for an authenticated user. Reset a stale mode
  // whenever the user session is cleared (including from the header button).
  useEffect(() => {
    if (!currentUser) {
      setMode('login');
    }
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (mode === 'login') {
        const response = await userAPI.login(
          formData.username,
          formData.password,
          formData.phone_number,
          formData.email
        );

        if (response.data.success) {
          localStorage.setItem('userId', response.data.user_id);
          localStorage.setItem('username', response.data.username);
          setMessage('✅ Login successful! Check your notifications.');
          setFormData({
            username: '',
            password: '',
            confirm_password: '',
            phone_number: '',
            email: '',
          });

          // Wait a second then call parent callback
          setTimeout(() => {
            onLoginSuccess && onLoginSuccess(response.data);
          }, 1000);
        }
      } else if (mode === 'register') {
        if (formData.password !== formData.confirm_password) {
          setMessage('❌ Passwords do not match');
          return;
        }

        const response = await userAPI.register(
          formData.username,
          formData.password,
          formData.email,
        );

        if (response.data.success) {
          localStorage.setItem('userId', response.data.user_id);
          localStorage.setItem('username', response.data.username);
          localStorage.setItem('isAdmin', String(Boolean(response.data.is_staff)));
          setMessage('✅ Account created and logged in successfully!');
          setFormData({
            username: '',
            password: '',
            confirm_password: '',
            phone_number: '',
            email: '',
          });
          setMode('login');
          onLoginSuccess && onLoginSuccess(response.data);
        }
      } else {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setMessage('❌ Not logged in');
          return;
        }

        const response = await userAPI.logout(
          userId,
          formData.phone_number,
          formData.email
        );

        if (response.data.success) {
          localStorage.removeItem('userId');
          localStorage.removeItem('username');
          setMessage('✅ Logout successful! Check your notifications.');
          setFormData({
            username: '',
            password: '',
            confirm_password: '',
            phone_number: '',
            email: '',
          });

          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      if (mode === 'login' && error.response?.status === 404 && error.response?.data?.error === 'User not found') {
        setMode('register');
        setMessage('❌ Your temporary demo account has expired. Please create it again to continue.');
        return;
      }

      setMessage(`❌ ${getApiErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Login' : mode === 'register' ? 'Create account' : 'Logout'}</h2>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {currentUser && mode === 'login' ? (
          <div className="user-info">
            <p>Logged in as: <strong>{currentUser.username}</strong></p>
            <button 
              onClick={() => setMode('logout')}
              className="btn btn-logout"
            >
              Logout & Trigger Notification
            </button>
          </div>
        ) : currentUser ? (
          <form onSubmit={handleSubmit}>
            <p className="user-info">
              Log out as <strong>{currentUser.username}</strong> and trigger the Logout notification.
            </p>

            <div className="form-group">
              <label>Phone Number (for WhatsApp)</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="1234567890"
                value={formData.phone_number}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-logout" disabled={loading}>
                {loading ? 'Processing...' : 'Logout & Trigger Notification'}
              </button>
              <button type="button" className="link-button" onClick={() => setMode('login')}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                placeholder="admin"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                placeholder="password123"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {mode === 'register' && (
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>Phone Number (for WhatsApp)</label>
              <input
                type="tel"
                inputMode="numeric"
                pattern="[0-9]{10}"
                maxLength="10"
                placeholder="1234567890"
                value={formData.phone_number}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required={mode === 'register'}
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Processing...' : mode === 'register' ? 'Create Account' : 'Login & Trigger Notification'}
            </button>
          </form>
        )}

        {!currentUser && <div className="test-credentials">
          {mode === 'login' ? (
            <>

              <button type="button" className="link-button" onClick={() => setMode('register')}>
                Create a user account
              </button>
            </>
          ) : (
            <>
              <p>Already have an account?</p>
              <button type="button" className="link-button" onClick={() => setMode('login')}>
                Back to Login
              </button>
            </>
          )}
        </div>}
      </div>
    </div>
  );
};

export default Auth;
