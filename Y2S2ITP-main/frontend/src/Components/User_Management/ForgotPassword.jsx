import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './style.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post('http://localhost:8175/user/forgot-password', { email })
      .then((result) => {
        console.log(result);
        if (result) {
          // Display alert for successful email sent
          Swal.fire({
            title: "Email sent successfully!",
            text: "Please check your inbox to reset your password",
            icon: "success"
          });
          Cookies.set('token', result.data.token, { expires: 1 }); // Expires in 1 day
          Cookies.set('userEmail', email, { expires: 1 }); // Expires in 1 day
          // Navigate the user to the appropriate page
          navigate('/verify-otp');
        } else if (result.data.status === 'no record existed') {
          // Display alert for email not found
          alert('Email does not exist. Please register.');
        } else {
          // Display alert for unexpected response
          alert('An error occurred. Please try again later.');
        }
      })
      .catch((err) => {
        console.log(err);
        // Display alert for general error
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Email is wrong",
          
        });
      });
  };

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
        {/* Contact Form Section */}
        <div className="contact-form">
          <span className="circle one"></span>
          <span className="circle two"></span>
          {/* Form */}
          <form onSubmit={handleSubmit} autoComplete="off">
            <h3 className="title">Forgot Password</h3>
            <div className="input-container">
              <input type="email" name="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
              <label htmlFor="">Email</label>
              <span>Email</span>
            </div>
            <button type="submit" className="btn">Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
