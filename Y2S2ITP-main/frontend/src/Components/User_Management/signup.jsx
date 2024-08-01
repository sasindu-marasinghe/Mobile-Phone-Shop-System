//import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import "./style1s.css"
import React, { useState, useEffect } from "react";



function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [number, setNumber] = useState(""); // Assuming this is for mobile number
    const navigate = useNavigate();

    useEffect(() => {
        const inputs = document.querySelectorAll(".input");

        function focusFunc() {
            let parent = this.parentNode;
            parent.classList.add("focus");
        }

        function blurFunc() {
            let parent = this.parentNode;
            if (this.value === "") {
                parent.classList.remove("focus");
            }
        }

        inputs.forEach((input) => {
            input.addEventListener("focus", focusFunc);
            input.addEventListener("blur", blurFunc);

            // Cleanup function to remove event listeners when component unmounts
            return () => {
                input.removeEventListener("focus", focusFunc);
                input.removeEventListener("blur", blurFunc);
            };
        });
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password || !reenterPassword || !number) {
          alert("All fields must be filled");
          return;
      }

        // Validate name (should contain only letters)
        const nameRegex = /^[a-zA-Z\s]+$/;
        if (!name.match(nameRegex)) {
            alert("Name should only contain letters");
            return;
        }
     

        // Check if passwords match
        if (password !== reenterPassword) {
            alert("Passwords do not match");
            return;
        }

        

        const validNumberLength = 10;
        if (number.length !== validNumberLength) {
            alert("Mobile number should be 10 digits");
            return;
        }
        const gmailPattern = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!email.match(gmailPattern)) {
            alert("Please enter a valid Gmail address");
            return;
        }

        axios
          .post('http://localhost:8175/user/register', {
            name,
            email,
            password,
            number,
          })
          .then((result) => {
            console.log(result);
            navigate('/login');
          })
          .catch((err) => {
            if (
              err.response &&
              err.response.data.error === 'Email is already in use'
            ) {
              alert('Email is already in use. Please use a different email.');
            } else {
              console.log(err);
            }
          });

      
    }

    return (
        <div className="container">
        <span className="big-circle"></span>
        <img src="img/shape.png" className="square" alt="" />
        <div className="form">
            {/* Contact Info Section */}
            <div className="contact-info">
                <h3 className="title">Tech-Connect</h3>
                <p className="text">
                Tech-Connect: Top tech hub, latest smartphones, expert advice, innovation, convenience, reliability. Upgrade your mobile lifestyle!
                </p>
                {/* Information */}
                <div className="info">
                <div className="information d-flex align-items-center">
                   <i className="bi bi-geo-alt-fill fs-5 me-3"></i>
                   
                   <p className="mb-0">92 Cherry Drive Uniondale, NY 11553</p>
                 </div>
                    <div className="information">
                    <i className="bi bi-envelope-fill fs-5 me-3"></i>
                        <p className="mb-0">lorem@ipsum.com</p>
                    </div>
                    <div className="information">
                    <i className="bi bi-telephone-fill fs-5 me-3"></i>
                        <p className="mb-0">123-456-789</p>
                    </div>
                </div>
                {/* Social Media Links */}
                <div className="social-media">
                  
                    <div className="social-media">
                        <p>Connect with us :</p>
                        <div className="social-icons d-flex justify-content-center">
                            <button onClick={() => {}} className="me-3">
                                <i className="bi bi-facebook fs-5"></i>
                            </button>
                            <button onClick={() => {}}>
                                <i className="bi bi-whatsapp fs-5"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Contact Form Section */}
            <div className="contact-form">
                <span className="circle one"></span>
                <span className="circle two"></span>
                {/* Form */}
                <form onSubmit={handleSubmit} autoComplete="off">
                    <h3 className="title">Sign in</h3>
                    <div className="input-container">
                        <input type="text" name="name" className="input" value={name} onChange={(e) => setName(e.target.value)} />
                        <label htmlFor="">Username</label>
                        <span>Username</span>
                    </div>
                    <div className="input-container">
                        <input type="email" name="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <label htmlFor="">Email</label>
                        <span>Email</span>
                    </div>
                    <div className="input-container">
                        <input type="password" name="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
                        <label htmlFor="">Password</label>
                        <span>Password</span>
                    </div>
                    <div className="input-container">
                        <input type="password" name="reenterPassword" className="input" value={reenterPassword} onChange={(e) => setReenterPassword(e.target.value)} />
                        <label htmlFor="">Re-enter Password</label>
                        <span>Re-enter Password</span>
                    </div>
                    <div className="input-container">
                        <input type="number" name="number" className="input" value={number} onChange={(e) => setNumber(e.target.value)} />
                        <label htmlFor="">Mobile Number</label>
                        <span>Mobile Number</span>
                    </div>
                    <input type="submit" value="Sign Up" className="btn" />
                </form>
                <p>Already have an account? <Link to="/login">Login</Link></p>
            </div>
        </div>
    </div>

    );
}

export default Signup;
