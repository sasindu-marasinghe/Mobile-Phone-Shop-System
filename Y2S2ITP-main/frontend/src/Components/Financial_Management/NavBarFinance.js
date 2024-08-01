import React, {useState} from 'react'
import { NavLink } from 'react-router-dom'
import './FinanceCSS/NavCSS.css';

function NavBarFinance() {

const [activeTab, setActiveTab] = useState('');
const handleMouseEnter = (tabName) => {
    setActiveTab(tabName);
};

const handleMouseLeave = () => {
    setActiveTab('');
};


  return (
    <div className="navbar">
      <NavLink
        to="/financial-analysis"
        className={`nav-item ${activeTab === 'Financial Analysis' ? 'active' : ''}`}
        onMouseEnter={() => handleMouseEnter('Financial Analysis')}
        onMouseLeave={handleMouseLeave}
      >
        Financial Analysis
      </NavLink>
      <NavLink
        to="/expenditures"
        className={`nav-item ${activeTab === 'Expenditures' ? 'active' : ''}`}
        onMouseEnter={() => handleMouseEnter('Expenditures')}
        onMouseLeave={handleMouseLeave}
      >
        Expenditures
      </NavLink>
      <NavLink
        to="/salary-management"
        className={`nav-item ${activeTab === 'Salary Management' ? 'active' : ''}`}
        onMouseEnter={() => handleMouseEnter('Salary Management')}
        onMouseLeave={handleMouseLeave}
      >
        Salary Management
      </NavLink>
    </div>
  );
}

export default NavBarFinance
