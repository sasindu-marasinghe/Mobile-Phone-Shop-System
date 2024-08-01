import React, { useState, useEffect } from 'react';
import './FinanceCSS/AddExpenseForm.css'; 

function AddExpenseForm({ onCancel, onAdd }) {
  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    payment_method: '',
    description: '',
    receipt_no: '',
    name: '',
    location: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setShowPopup(true);

    setTimeout(() => {
      onAdd(formData);
      setIsLoading(false);
      setIsSuccess(true);
    }, 3000);
  };

 useEffect(() => {
  if (isSuccess) {
    setShowPopup(true);
    const timer = setTimeout(() => {
      setShowPopup(false); // Hide the popup after 3 seconds
      setIsSuccess(false); // Reset success state
    }, 2000);

    return () => clearTimeout(timer); // Clear the timer if component unmounts
  }
}, [isSuccess]);

  return (
    <div className="form-container">
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Category1">Category1</option>
            <option value="Category2">Category2</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="form-row">
          <label>Amount:</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Payment Method:</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-row">
          <label>Receipt No:</label>
          <input
            type="text"
            name="receipt_no"
            value={formData.receipt_no}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <button type="submit" className="submit-button">Submit</button>
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>

        {/* Popup Screen */}
      {showPopup && (
        <div className="popup-screen">
          <div className="popup-content">
            {isLoading ? (
              <>
                <div className="loading-circle"></div>
                <p>Record is adding...</p>
              </>
            ) : (
              <>
                <p>Record added successfully.</p>
                
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

export default AddExpenseForm;
