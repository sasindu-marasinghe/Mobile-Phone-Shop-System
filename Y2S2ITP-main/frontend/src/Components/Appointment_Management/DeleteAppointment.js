import React from 'react';
import axios from 'axios';

const DeleteAppointment = ({ appointmentId }) => {
  // Function to handle appointment deletion
  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8175/appointment/delete/${appointmentId}`);
      alert('Appointment deleted successfully');
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <div>
      <h2>Delete Appointment</h2>
      <button onClick={handleDelete}>Delete Appointment</button>
    </div>
  );
};

export default DeleteAppointment;