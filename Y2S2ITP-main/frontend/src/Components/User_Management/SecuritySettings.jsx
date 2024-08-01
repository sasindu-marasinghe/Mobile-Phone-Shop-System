import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SecuritySettings.css'
import Cookies from 'js-cookie';
import axios from 'axios';
import Swal from 'sweetalert2';

function SecuritySettings() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChangePassword = (e) => {
        e.preventDefault();
        const userId = Cookies.get('userId');

        if (newPassword !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'New password and confirm password must match.',
                confirmButtonText: 'OK'
            });
            return;
        }

        axios.post('http://localhost:8175/user/passwordchange', { userId, currentPassword, newPassword, confirmPassword })
            .then(response => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Password changed successfully!',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '/SecuritySettings';
                });
            })
            .catch(error => {
                if (error.response && error.response.status === 400 && error.response.data.message === 'Incorrect current password.') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Current password is incorrect.',
                        confirmButtonText: 'OK'
                    });
                } else {
                    console.error('Failed to change password:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'Failed to change password. Please try again.',
                        confirmButtonText: 'OK'
                    });
                }
            });
    }

    const handleDeleteAccount = () => {
        const userId = Cookies.get('userId');
    
        Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete my account'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete('http://localhost:8175/user/delete', { data: { userId } })
                    .then(response => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success',
                            text: 'Your account has been deleted.',
                            confirmButtonText: 'OK'
                        }).then(() => {
                            window.location.href = '/login';
                        });
                    })
                    .catch(error => {
                        console.error('Failed to delete account:', error);
                        Swal.fire({
                            icon: 'error',
                            title: 'Error',
                            text: 'Failed to delete account. Please try again.',
                            confirmButtonText: 'OK'
                        });
                    });
            }
        });
    }
    

    return (
        <div className="container-xl px-4 mt-4">
            {/* Account page navigation*/}
            <nav className="nav nav-borders">
                <button className="nav-link">
                    <Link to="/AccountDetails">Profile</Link>
                </button>
                <button className="nav-link">Billing</button>
                <button className="nav-link">Appoinment</button>
                
            </nav>
            <hr className="mt-0 mb-4" />

            {/* Change password card*/}
            <div className="card-header">Change Password</div>
            <form>
                {/* Form Group (current password)*/}
                <div className="mb-3">
                    <label className="small mb-1" htmlFor="currentPassword">Current Password</label>
                    <input
                        className="form-control"
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </div>
                {/* Form Group (new password)*/}
                <div className="mb-3">
                    <label className="small mb-1" htmlFor="newPassword">New Password</label>
                    <input
                        className="form-control"
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </div>
                {/* Form Group (confirm password)*/}
                <div className="mb-3">
                    <label className="small mb-1" htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        className="form-control"
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <button className="btn btn-primary" type="button" onClick={handleChangePassword}>Save</button>
            </form>

            <hr className="my-4" />

            {/* Delete account card */}
            <div className="card mb-4">
                <div className="card-header">Delete Account</div>
                <div className="card-body">
                    <p>Deleting your account is a permanent action and cannot be undone. If you are sure you want to delete your account, select the button below.</p>
                    <button className="btn btn-danger-soft text-danger" type="button" onClick={handleDeleteAccount}>I understand, delete my account</button>
                </div>
            </div>
        </div>
    );
}

export default SecuritySettings;
