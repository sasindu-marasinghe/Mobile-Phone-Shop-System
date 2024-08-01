import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import './style.css';

function Login() {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
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
        axios.post('http://localhost:8175/user/login', { email, password })
            .then((result) => {
                console.log(result);
                if (result.data.status === 'success') {
                   // Cookies.set('token', result.data.token, { expires: 1 });
                    Cookies.set('userEmail', email, { expires: 1 });
                    Cookies.set('userId', result.data.userId, { expires: 1 }); // Store user ID in cookies
                    Cookies.set('role', result.data.role, { expires: 1 });
                    const isAdmin = result.data.isAdmin;
                    const isStaff = result.data.isStaff; // New
    
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Login successful",
                        showConfirmButton: false,
                        timer: 1500
                    });
    
                    if (isAdmin) {
                        navigate('/admin');
                    } else if (isStaff) { // Check if user is staff
                        navigate('/staff'); // Navigate to staff page
                    } else {
                        navigate('/');
                    }
                } else if (result.data.status === 'no record existed') {
                    alert('Email does not exist. Please register.');
                } else {
                    alert('Unexpected response from the server');
                }
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Email or password incorrect please enter valid password or email",
                });
            });
    }
    
    return (
        <div class="login-wrapper">
    

        <div className="container">
            <span className="big-circle"></span>
            <img src="img/shape.png" className="square" alt="" />
            <div className="form">
                <div className="contact-info">
                    <h3 className="title">Tech-Connect</h3>
                    <p className="text">
                       
                    Tech-Connect: Top tech hub, latest smartphones, expert advice, innovation, convenience, reliability. Upgrade your mobile lifestyle!
                    </p>
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
                <div className="contact-form">
                    <span className="circle one"></span>
                    <span className="circle two"></span>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <h3 className="title">Login</h3>
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
                        <input type="submit" value="Login" className="btn" />
                    </form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                    <p><Link to="/forgot-password">Forgot Password?</Link></p>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Login;
