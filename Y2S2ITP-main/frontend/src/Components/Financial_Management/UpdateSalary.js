import React, { useEffect, useState} from 'react';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';
import './FinanceCSS/DisplayDatabase.css';

function UpdateSalary({ employeeId,onUpdate, onClose }) {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  

  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/salaries/get/${employeeId}`);
        setInputs(response.data.salary);
      } catch (error) {
        console.error('Error fetching expense:', error);
      }
    };
    fetchHandler();
  }, [employeeId]);

  const [formData, setFormData] = useState({
    employee_id: '',
    name: '',
    position: '',
    base_salary: '',
    ot_payment: '',
    bonus: '',
    deduction: '',
    net_salary: '',
    pay_period: '',
  });

  useEffect(() => {
    // Populate formData with inputs
    setFormData(inputs);
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
  
    try {
      await axios.put(`http://localhost:8080/salaries/update/${employeeId}`, formData);
      onUpdate(formData);
        onClose();
        history.push(``);
        

    } catch (error) {
      console.error('Error updating expense:', error);
      
    }
  };
  return (
    <div className="popup-container">
      <div className="popup">
        <h2>Update The Record</h2>
        <form >
          <div className="form-group">
            <label htmlFor="employeeId">Employee ID:</label>
            <input
              type="text"
              name="employeeId"
              value={formData.employee_id}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Employee Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="position">Position:</label>
            <select name="position" value={formData.position} onChange={handleChange}>
            <option value="">Select Position</option>
            <option value="Manager">Manager</option>
            <option value="Technician">Technician</option>
            <option value="Accountant">Accountant</option>
            <option value="Cleaner">Cleaner</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="base_salary">Base Salary:</label>
            <input
              type="text"
              name="base_salary"
              value={formData.base_salary}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="ot_payment">Over-Time Pay:</label>
            <input
              type="text"
              name="ot_payment"
              value={formData.ot_payment}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="bonus">Bonuses:</label>
            <input
              type="text"
              name="bonus"
              value={formData.bonus}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="deduction">Deductions:</label>
            <input
              type="text"
              name="deduction"
              value={formData.deduction}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="pay_period">Pay Period:</label>
            <select name="pay_period" value={formData.pay_period} onChange={handleChange}>
            <option value="">Select Pay-Period</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            </select>
            </div>
        
          <div className="button-group-update">
            <button type="button" className="submit-button-update" onClick={handleSubmit}>Submit</button>
            <button type="button" className="cancel-button-update" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateSalary;
