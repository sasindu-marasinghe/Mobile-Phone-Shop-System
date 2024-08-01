import React, { useState } from 'react';
import axios from 'axios';

const UpdateFeedback = ({ feedbackId, initialData }) => {
  const [updatedFeedback, setUpdatedFeedback] = useState(initialData);

  const handleUpdate = () => {
    axios.put(`http://localhost:8175/feedback/update/${feedbackId}`, updatedFeedback)
      .then(response => {
        console.log(response.data);
        // Handle successful update, e.g., redirect or update UI
      })
      .catch(error => {
        console.error('Error updating feedback:', error);
        // Handle error, e.g., show error message
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedFeedback({ ...updatedFeedback, [name]: value });
  };

  return (
    <div>
      <input type="text" name="productId" value={updatedFeedback.productId} onChange={handleChange} />
      {/* Other input fields for feedback properties */}
      <button onClick={handleUpdate}>Update Feedback</button>
    </div>
  );
};

export default UpdateFeedback;