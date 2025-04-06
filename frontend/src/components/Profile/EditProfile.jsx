import React, { useState, useEffect } from 'react';
import './Profile.css';
import { Navigate } from 'react-router-dom';

const EditProfile = () => {
    const [formData, setFormData] = useState({
        name: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/users/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (response.ok) {
                    const userData = await response.json();
                    setFormData(prev => ({
                        ...prev,
                        name: userData.name
                    }));
                } else if (response.status === 403) {
                    setError('Access denied. Please log in again.');
                    window.location.href = '/login';
                } else {
                    throw new Error('Failed to load user data');
                }
            } catch (err) {
                setError('Failed to load user data');
            }
        };

        if (token && username) {
            fetchUserData();
        }
    }, [token, username]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            setError('New passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:9090/api/users/${username}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: formData.name,
                    oldPassword: formData.currentPassword,
                    newPassword: formData.newPassword || undefined
                }),
            });

            if (response.ok) {
                setSuccess('Profile updated successfully');
                sessionStorage.setItem('name', formData.name);
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                }));
            } else if (response.status === 403) {
                setError('Access denied. Please log in again.');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!token || !username) {
        return <Navigate to="/login" />;
    }

    return (
        <div className="profile-container">
            <div className="profile-card">
                <h2>Edit Profile</h2>
                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}
                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            disabled
                            className="disabled-input"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="password-section">
                        <h3>Change Password</h3>
                        <div className="form-group">
                            <label htmlFor="currentPassword">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Updating...' : 'Update Profile'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
