import React, { useState, useEffect } from 'react'; 
import './AccountDetails.css';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';
import { BsPersonFill } from 'react-icons/bs'; 

function AccountDetails() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [number, setNumber] = useState("");
    const navigate = useNavigate(); 
    const [File, setFile] = useState("");
    const [userImage, setUserImage] = useState(null); // 

    const handleUpload = (e) => {
        e.preventDefault();
        const userEmail = Cookies.get('userEmail');
        const formData = new FormData();
        formData.append('file', File);
        formData.append('email', userEmail);

        axios.post("http://localhost:8175/user/upload-image", formData)
            .then(res => {
                console.log(res);
                window.location.reload();
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        const userId = Cookies.get('userId');
        if (userId) {
            axios.get(`http://localhost:8175/user/getUsers/${userId}`)
                .then(result => {
                    setName(result.data.name);
                    setEmail(result.data.email);
                    setNumber(result.data.number);
                    setUserImage(result.data.image);
                })
                .catch(err => console.log(err));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:8175/user/AccountDetails', {
                name,
                email,
                number,
                userEmail: Cookies.get('userEmail'),
                userId: Cookies.get('userId')
            })
            .then((result) => {
                console.log(result);
                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Update successful",
                    showConfirmButton: false,
                    timer: 1500
                });
                navigate('/AccountDetails'); 
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

    const handleRemovePhoto = () => {
        axios.post(`http://localhost:8175/user/remove-image`, { userId: Cookies.get('userId') })
            .then(res => {
                console.log(res);
                setUserImage(null);
            })
            .catch(err => console.log(err));
    };
    
    const handleClickProfilePicture = () => {
   
    Swal.fire({
        imageUrl: `http://localhost:3000/image/${userImage}`,
        imageAlt: 'Profile Picture',
        showCloseButton: true,
        showConfirmButton: false,
        width: '20%',
        height: 'auto',
    });
};
    
    return (
        <div className="container-xl px-4 mt-4">
            <nav className="nav nav-borders">
                <button className="nav-link active ms-0">Profile</button>
                <button className="nav-link">Billing</button>
                <button className="nav-link">Appoinment</button>
                <button className="nav-link">
                    <Link to="/SecuritySettings">Security</Link>
                </button>
            </nav>
            <hr className="mt-0 mb-4" />
            <div className="row">
                <div className="col-xl-4">
                    <div className="card mb-4 mb-xl-0">
                        <div className="card-header">Profile Picture</div>
                        <div className="card-body text-center">
    {userImage ? (
        <img
            src={`http://localhost:3000/image/${userImage}`}
            alt="Profile"
            style={{ borderRadius: '50%', cursor: 'pointer' }} 
            onClick={handleClickProfilePicture} 
        />
    ) : (
        <BsPersonFill size={100} color="#adb5bd"  />
    )}
                            <div className="small font-italic text-muted mb-4">
                                <input type="file" onChange={e => setFile(e.target.files[0])}/> 
                                <button className="btn btn-primary mt-2" onClick={handleUpload}>Upload new image</button>
                                {userImage && (
                                    <button className="btn btn-danger mt-2" onClick={handleRemovePhoto}>Remove photo</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xl-8">
                    <div className="card mb-4">
                        <div className="card-header">Account Details</div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                                    <input className="form-control" id="inputUsername" type="text" placeholder="Enter your username" value={name} onChange={(e) => setName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                                    <input className="form-control" id="inputEmailAddress" type="email" placeholder="Enter your email address" value={email} onChange={(e) => setEmail(e.target.value)} disabled />
                                </div>
                                <div className="row gx-3 mb-3">
                                    <div className="col-md-6">
                                        <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                                        <input className="form-control" id="inputPhone" type="tel" placeholder="Enter your phone number" value={number} onChange={(e) => setNumber(e.target.value)} />
                                    </div>
                                </div>
                                <button className="btn btn-primary" type="submit">Save changes</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountDetails;
