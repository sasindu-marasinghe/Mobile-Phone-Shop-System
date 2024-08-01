import React, { useEffect, useState,useRef } from 'react';
import Navbar from "./NavBarFinance";
import axios from "axios";
import AddSalaryForm from "./AddSalaryForm";
import DisplaySalary from "./DisplaySalary";
import './FinanceCSS/DisplayDatabase.css';
import { useReactToPrint } from 'react-to-print';

const displaySalURL = "http://localhost:8080/salaries/";
const addSalURL = "http://localhost:8080/salaries/add";

//display salaries
const fetchHandler = async () => {
  const response = await axios.get(displaySalURL);
  return response.data;
 }

 

function SalaryHome() {
 const[salaries, setSalaries]=useState([]);
 const [showForm, setShowForm] = useState(false);
 const [searchQuery, setSearchQuery] = useState("");
 const [searchResults, setSearchResults] = useState([]);
 const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchSalaries = async () => {
      try {
        const response = await axios.get(displaySalURL);
        setSalaries(response.data);
      } catch (error) {
        console.error('Error fetching salaries:', error);
      }
    };

    fetchSalaries();
 },[]);

//insert salary record
const handleAddSalary = async (salaryData) => {
  try {
    const response = await axios.post(addSalURL, salaryData);
    if (response.status === 201) {
      setShowForm(false);
      fetchHandler().then((data) => setSalaries(data));
    }
  } catch (error) {
    console.error("Error adding salary:", error);
  }
};

//delete function
const handleDelete = async () => {
  try {
    await fetchHandler().then((data) => {
      setSalaries(data);  // Update the salary state with the fetched data after deletion
    });
  } catch (error) {
    console.error("Error fetching salary after deletion:", error);
  }
};

//search functionality
const handleSearch = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/salaries/search?query=${searchQuery}`);
    setSearchResults(response.data);
  } catch (error) {
    console.error("Error searching expenses:", error);
  }
};

const handleCloseSearch = () => {
  setSearchResults([]);
};


//printing report
const ComponentsRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    DocumentTitle: "Salary Report_Basic",
    onAfterPrint: () => alert("Salary Report Downloaded!"),
  });

  return (
    <div>
      <Navbar/>
      <div className='welcomemsg'>
      <h1>You're currently in the salary management page..</h1>
      </div>

      <div className='new-rec-button'>
        <button onClick={()=> setShowForm(true)}>Add New Salary</button>
        <button>Salary Definitions</button>
        <button>Over-Time Rates Definitions</button>
      </div>

      {showForm && (
        <AddSalaryForm
        onCancel={()=>setShowForm(false)}
        onAdd={handleAddSalary}
        />

      )}

<div className='search-section-salary'>
      <input className='search-input'
        type="text" 
        placeholder="Search expenses..." 
        value={searchQuery} 
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button className='search-button' 
      onClick={()=>{
        handleSearch();
        setSearchQuery('');
      }}
      >Search</button>
    </div>

    {/* Display search results */}
    {searchResults.length > 0 && (
  <div className='search-results-container'>
    <div className='search-results'>
      <h2>Search Results</h2>
      <table className="expense-table">
        <thead>
          <tr className="header-row">
          <th>Employee ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Base Salary</th>
              <th>OT Pay</th>
              <th>Bonuses</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Pay Period</th>
              <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((salary, i) => (
            <DisplaySalary key={i} salary={salary} onDelete={handleDelete}/>
          ))}
        </tbody>
      </table>
    </div>

    {/* Close button */}
    <div className='close-button-container'>
      <button className='close-button' onClick={handleCloseSearch}>Close</button>
    </div>
   </div>
    )}

<div ref={ComponentsRef}>
        <table className="expense-table">
          <thead>
            <tr className="header-row">
              <th>Employee ID</th>
              <th>Name</th>
              <th>Position</th>
              <th>Base Salary</th>
              <th>OT Pay</th>
              <th>Bonuses</th>
              <th>Deductions</th>
              <th>Net Salary</th>
              <th>Pay Period</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            
            {salaries.map((salary, i) => (
              <DisplaySalary key={i} salary={salary} onDelete={handleDelete}/>
            ))}
          </tbody>
        </table>
      </div>

      <div className='generate-report-button-container'>
          <button className='generate-report-button' onClick={handlePrint}>
            Generate Basic Report
            {loading && <span className='loading-circle'></span>} {/* Loading circle */}
          </button>
        </div>

    </div>

    
  );
}

export default SalaryHome;

