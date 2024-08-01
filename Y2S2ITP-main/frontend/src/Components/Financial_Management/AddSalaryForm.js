import React, { useState, useEffect } from 'react';
import './FinanceCSS/AddExpenseForm.css'; 

function AddSalaryForm({ onCancel, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    base_salary: '',
    ot_payment: '',
    bonus: '',
    deduction: '',
    net_salary: '',
    pay_period: '',
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
      <h2>Add New Salary Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Employee Name:</label>
          <input
            type="text"
            name="name"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Position:</label>
          <select
            name="position"
            value={formData.position}
            onChange={handleChange}
            required
          >
            <option value="">Select Position</option>
            <option value="Manager">Manager</option>
            <option value="Technician">Technician</option>
            <option value="Accountant">Accountant</option>
            <option value="Cleaner">Cleaner</option>
            {/* Add more categories as needed */}
          </select>
        </div>
        <div className="form-row">
          <label>Base Salary:</label>
          <input
            type="text"
            name="base_salary"
            value={formData.base_salary}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Over-Time Pay:</label>
          <input
            type="text"
            name="ot_payment"
            value={formData.ot_payment}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Bonuses:</label>
          <input
          type="text"
            name="bonus"
            value={formData.bonus}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-row">
          <label>Deductions:</label>
          <input
            type="text"
            name="deduction"
            value={formData.deduction}
            onChange={handleChange}
            required
          />
        </div>
       
        <div className="form-row">
          <label>Pay Period:</label>
          <select
            name="pay_period"
            value={formData.pay_period}
            onChange={handleChange}
            required
          >
            <option value="">Select Pay-Period</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            {/* Add more categories as needed */}
          </select>
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

export default AddSalaryForm;
