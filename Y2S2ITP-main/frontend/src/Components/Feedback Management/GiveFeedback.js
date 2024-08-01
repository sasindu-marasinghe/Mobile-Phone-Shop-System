import React, { useState } from "react";
import UserNav from '../Nav/userNav';
import Footer from '../Nav/footer';
//import './AddAForm.css';
import axios from 'axios';

export default function GiveFeedback() {
  const [feedbackType, setFeedbackType] = useState("");
  const [descript, setDescription] = useState("");


      
  function sendData(e) {
    e.preventDefault();

    const newFeedback = {
    
        feedbackType,
      descript
    }

    axios.post("http://localhost:8175/feedback/add", newFeedback)
      .then(() => {
        alert("Feedback Successfully Submitted");
        // Clear input fields after successful submission
        
        setDescription("");
        setFeedbackType("");
      })
      .catch((err) => {
        alert(err);
      });
  }

  return (
    <>
      <UserNav />
      <div className="container">
        <form onSubmit={sendData}>
          <h2>Give your feedback</h2>
          

          <div class="dropdown show">
  <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="FeedbackType" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown link
  </a>

  <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    <a class="dropdown-item" href="#">Product</a>
    <a class="dropdown-item" href="#">Repair Services</a>
    <a class="dropdown-item" href="#">Delivery Services</a>
    <a class="dropdown-item" href="#">Promotional</a>

    value={feedbackType}
              onChange={(e) => setFeedbackType(e.target.value)}
  </div>
</div>

          


          <div>
            <label htmlFor="description">Description:</label><h4>Insert a </h4>
            <textarea
              id="descript"
              name="descript"
              //t
              value={descript}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">Submit</button>
        </form>
      </div>
      <Footer />
    </>
  );
}