import React, { useState } from "react";
import UserNav from '../Nav/userNav';
import Footer from '../Nav/footer';
//import './AddAForm.css';
import axios from 'axios';

export default function AddAForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [telephone, setTelephone] = useState("");
  const [phoneType, setPhoneType] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

      
  function sendData(e) {
    e.preventDefault();

    const newappointment = {
      name,
      email,
      telephone,
      phoneType,
      serviceType,
      date,
      description
    }

    axios.post("http://localhost:8175/appointment/add", newappointment)
      .then(() => {
        alert("Appointment Successfully Submitted");
        // Clear input fields after successful submission
        setName("");
        setEmail("");
        setTelephone("");
        setPhoneType("");
        setServiceType("");
        setDescription("");
        setDate("");
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
          <h2>Appointment For Repair Services</h2>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="telephone">Telephone:</label>
            <input
              type="tel"
              id="telephone"
              name="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
            />
          </div>

          <div>
            <label>Phone Type:</label><br/>
            <input
              type="checkbox"
              id="android"
              name="phoneType"
              value="Android"
              onChange={(e) => setPhoneType(e.target.value)}
            />
            <label htmlFor="android">Android</label><br/>
            <input
              type="checkbox"
              id="apple"
              name="phoneType"
              value="Apple"
              onChange={(e) => setPhoneType(e.target.value)}
            />
            <label htmlFor="apple">Apple</label><br/>
            <input
              type="checkbox"
              id="windows"
              name="phoneType"
              value="Windows"
              onChange={(e) => setPhoneType(e.target.value)}
            />
            <label htmlFor="windows">Windows</label>
          </div>

          <div>
            <label>Service Type:</label><br/>
            <input
              type="checkbox"
              id="display"
              name="serviceType"
              value="Display Services"
              onChange={(e) => setServiceType(e.target.value)}
            />
            <label htmlFor="display">Display Services</label><br/>
            <input
              type="checkbox"
              id="motherboard"
              name="serviceType"
              value="Motherboard Services"
              onChange={(e) => setServiceType(e.target.value)}
            />
            <label htmlFor="motherboard">Motherboard Services</label><br/>
            <input
              type="checkbox"
              id="other"
              name="serviceType"
              value="Other Services"
              onChange={(e) => setServiceType(e.target.value)}
            />
            <label htmlFor="other">Other Services</label>
          </div>

          <div>
            <label htmlFor="date">Date:</label>
            <input
              type="date"
              id="date"
              name="date"
              //required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="description">Description:</label><h4>Insert a </h4>
            <textarea
              id="description"
              name="description"
              //required
              value={description}
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