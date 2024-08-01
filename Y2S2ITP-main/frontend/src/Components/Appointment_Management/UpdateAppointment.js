import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateAppointment = ({ appointmentId }) => {
  const [appointment, setAppointment] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // Add other appointment fields here
  
  // Fetch the appointment data by ID
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:8175/appointment/get/${appointmentId}`);
        setAppointment(response.data.appointment);
      } catch (error) {
        console.error('Error fetching appointment:', error);
      }
    };
    fetchAppointment();
  }, [appointmentId]);

  // Function to handle appointment update
  const handleUpdate = async () => {
    const updatedAppointment = {
      name,
      email,
      // Add other appointment fields here
    };

    try {
      await axios.put(`http://localhost:8175/appointment/update/${appointmentId}`, updatedAppointment);
      alert('Appointment updated successfully');
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  return (
    <div>
      <h2>Update Appointment</h2>
      <form onSubmit={handleUpdate}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <label>Email:</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {/* Add other input fields for appointment details */}
        <button type="submit">Update Appointment</button>
      </form>
    </div>
  );
};

export default UpdateAppointment;