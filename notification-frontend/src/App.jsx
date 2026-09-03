import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import Auth from './components/Auth';
import './styles/App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    if (userId && username) {
      setCurrentUser({ id: userId, username });
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setCurrentUser({
      id: userData.user_id,
      username: userData.username,
    });
    const userIsAdmin = Boolean(userData.is_staff);
    localStorage.setItem('isAdmin', String(userIsAdmin));
    setIsAdmin(userIsAdmin);
  };

  const handleLogout = () => {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    setCurrentUser(null);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <h1>🔔 Notification System</h1>
            <nav className="nav">
              <Link to="/" className="nav-link">Home</Link>
              {isAdmin && <Link to="/admin" className="nav-link">Admin Panel</Link>}
              {currentUser && (
                <span className="user-badge">
                  👤 {currentUser.username}
                  <button onClick={handleLogout} className="logout-link">
                    (Logout)
                  </button>
                </span>
              )}
            </nav>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route 
              path="/" 
              element={
                <Auth 
                  onLoginSuccess={handleLoginSuccess}
                  currentUser={currentUser}
                />
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAdmin ? (
                  <AdminPanel />
                ) : (
                  <div className="unauthorized">
                    <h2>Access Denied</h2>
                    <p>You must be logged in as admin to access this page.</p>
                    <Link to="/" className="btn btn-primary">Go to Login</Link>
                  </div>
                )
              } 
            />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>
            Multi-channel Notification System • 
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"> GitHub</a>
          </p>
          <div className="footer-info">
            <span>Channels: WhatsApp 📱 | Email 📧 | Web Push 🔔</span>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
