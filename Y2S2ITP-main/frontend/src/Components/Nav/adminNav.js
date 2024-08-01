import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './adminNav.css';
import Cookies from 'js-cookie';

function AdminNav() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const logout = () => {
    // Clear frontend cookies
    Cookies.remove('token');
    Cookies.remove('userEmail');
    Cookies.remove('userId');
    Cookies.remove('role');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  return (
    <>
      <header className="admin-header">
        <button className="burger-menu" onClick={toggleSidebar}>
         
        </button>
        <div className="logo">
          <Link to="/admin">Admin Dashboard</Link>
        </div>
        <div className="profile">
          <img src="profile.jpg" alt="Profile" />
          <span>Admin User</span>
          <div className="dropdown">
            <button className="dropbtn">▼</button>
            <div className="dropdown-content">
              <Link to="/AccountDetails">Profile</Link>
              <Link to="#">Settings</Link>
              <Link onClick={logout}>Logout</Link> {/* Call logout function */}
            </div>
          </div>
        </div>
      </header>

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <ul>
          <li className={activeLink === '/admin' ? 'active' : ''}>
            <Link to="/admin">Dashboard</Link>
          </li>
          <li className={activeLink === '/userdetails' ? 'active' : ''}>
            <Link to="/userdetails">Users</Link>
          </li>
          <li className={activeLink === '/staffdetails' ? 'active' : ''}>
            <Link to="/staffdetails">staff</Link>
          </li>
          <li className={activeLink === '/admin/productsList' ? 'active' : ''}>
            <Link to="/admin/productsList">Products</Link>
          </li>
          <li className={activeLink === '/orders' ? 'active' : ''}>
            <Link to="/orders">Orders</Link>
          </li>
          <li className={activeLink === '/appoinment' ? 'active' : ''}>
            <Link to="/appoinment">Appoinment</Link>
          </li>
          <li className={activeLink==='/financial-analysis' ? 'active': ''}>
          <Link to="/financial-analysis"> Finance Management</Link>
        </ul>
      </aside>
    </>
  );
}

export default AdminNav;
