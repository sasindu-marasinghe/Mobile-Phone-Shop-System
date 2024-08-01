import React, { useEffect, useState } from 'react';
import Navbar from "./NavBarFinance";
import axios from "axios";
import DisplayExpense from "./displayExpense";
import './FinanceCSS/DisplayDatabase.css';
import AddExpenseForm from "./AddExpenseForm";


const displayEXPENSESURL = "http://localhost:8080/expenses/";
const addEXPENSESURL = "http://localhost:8080/expenses/add";

//display expenses
const fetchHandler = async () => {
 const response = await axios.get(displayEXPENSESURL);
 return response.data;
}

function ExpendituresHome() {
 const [expenses, setExpenses] = useState([]);
 const [searchQuery, setSearchQuery] = useState("");
 const [searchResults, setSearchResults] = useState([]);
 const [showForm, setShowForm] = useState(false);
 const [loading, setLoading] = useState(false); // State for loading indicator
 const [reportType, setReportType] = useState("lastSevenDays"); // Default report type
 const [startDate, setStartDate] = useState(""); // State variable for start date
 const [endDate, setEndDate] = useState(""); // State variable for end date

 
  
 useEffect(() => {
    fetchHandler().then((data) =>{
      const latestExpenses = data;
      setExpenses(latestExpenses);
    });
 }, []);

 //insert an expense
 const handleAddExpense = async (expenseData) => {
  try {
    const response = await axios.post(addEXPENSESURL, expenseData);
    if (response.status === 201) {
      setShowForm(false);
      fetchHandler().then((data) => setExpenses(data));
    }
  } catch (error) {
    console.error("Error adding expense:", error);
  }
};

//delete function
const handleDelete = async () => {
  try {
    await fetchHandler().then((data) => {
      setExpenses(data);  // Update the expenses state with the fetched data after deletion
    });
  } catch (error) {
    console.error("Error fetching expenses after deletion:", error);
  }
};

//report generation
const handleGenerateReport = async () => {
  try {
    setLoading(true); // Set loading state to true
    let url = `http://localhost:8080/expenses/generate-report`;

    // Set start and end dates based on report type
    let calculatedStartDate;
    let calculatedEndDate = new Date().toISOString().split('T')[0]; // Today's date

    switch (reportType) {
      case "lastSevenDays":
        calculatedStartDate = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0]; // 7 days ago
        break;
      case "lastThirtyDays":
        calculatedStartDate = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]; // 30 days ago
        break;
      case "thisMonth":
        calculatedStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]; // Start of current month
        break;
      default:
        if (startDate && endDate) {
          calculatedStartDate = startDate;
          calculatedEndDate = endDate;
        } else {
          console.error("Invalid report type or missing dates.");
          return;
        }
    }

    if (calculatedStartDate && calculatedEndDate) {
      url += `?startDate=${calculatedStartDate}&endDate=${calculatedEndDate}`;
    }

    console.log("Generating report with URL:", url);
    setTimeout(async () => {
      try {
        const response = await axios.get(url, { responseType: 'blob' });

        console.log("Report Response:", response);

        if (response && response.data) {
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const urlObject = URL.createObjectURL(blob);
          window.open(urlObject, '_blank');
        } else {
          throw new Error("Empty response or data from server.");
        }
      } catch (error) {
        console.error("Error generating report:", error);
      } finally {
        setLoading(false); // Set loading state to false
      }
    }, 3000);

  } catch (error) {
    console.error("Error generating report:", error);
    setLoading(false); // Set loading state to false
  }
};

//search functionality
const handleSearch = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/expenses/search?query=${searchQuery}`);
    setSearchResults(response.data);
  } catch (error) {
    console.error("Error searching expenses:", error);
  }
};

const handleCloseSearch = () => {
  setSearchResults([]);
};



 return (
    <div>
      <Navbar />
      <div className = "welcomemsg">
        <h1 >You're currently in the expense management page..</h1>
       
      </div>
      
      <div className='new-rec-button'>
        <button onClick={()=> setShowForm(true)}>Add New Expense</button>
        <button>Calculate Expense</button>
      </div>

      {showForm && (
        <AddExpenseForm
        onCancel={()=>setShowForm(false)}
        onAdd={handleAddExpense}
        />

      )}

<div className='search-section'>
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
            <th>Expense ID</th>
            <th>Date</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Payment Method</th>
            <th>Description</th>
            <th>Receipt No</th>
            <th>Name</th>
            <th>Location</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((expense, i) => (
            <DisplayExpense key={i} expense={expense} onDelete={handleDelete}/>
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

      <div>
        <table className="expense-table">
          <thead>
            <tr className="header-row">
              <th>Expense ID</th>
              <th>Date</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Payment Method</th>
              <th>Description</th>
              <th>Receipt No</th>
              <th>Name</th>
              <th>Location</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, i) => (
              <DisplayExpense key={i} expense={expense} onDelete={handleDelete}/>
            ))}
          </tbody>
        </table>
      </div>
      <div className="reports-section">
        <h2>Generate Reports</h2>
        
        <select onChange={(e)=>setReportType(e.target.value)}>
          <option value="lastSevenDays">Last 07 Days</option>
          <option value="lastThirtyDays">Last 30 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="custom">Custom</option>
        </select>
        
        {reportType === "custom" && (
          <div className="custom-dates">
            <label>Start Date: </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <label>End Date: </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        )}
        
        <div className='generate-report-button-container'>
          <button className='generate-report-button' onClick={handleGenerateReport}>
            Generate Report
            {loading && <span className='loading-circle'></span>} {/* Loading circle */}
          </button>
        </div>
      </div>
      
    </div>
    
 );
}

export default ExpendituresHome;
