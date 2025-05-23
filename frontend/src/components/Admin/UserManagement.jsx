import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Admin.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        newPassword: '',
        name: '',
        role: 'TENNIS_PLAYER'
    });

    const { token } = getCurrentUser();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const usernameToEdit = queryParams.get('username');

    useEffect(() => {
        fetchUsers();
        if (usernameToEdit) {
            const user = users.find(u => u.username === usernameToEdit);
            if (user) {
                setSelectedUser(user);
                setFormData({
                    username: user.username,
                    newPassword: '',
                    name: user.name,
                    role: user.role
                });
            }
        }
    }, [usernameToEdit]);

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers(token);
            setUsers(data);
        } catch (error) {
            setError('Failed to load users. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (selectedUser) {
                await updateUser(selectedUser.username, formData, token);
                setSuccess('User updated successfully');
            } else {
                // Rename newPassword to password before creation
                const submissionData = { ...formData, password: formData.newPassword };
                delete submissionData.newPassword;
                await createUser(submissionData, token);
                setSuccess('User created successfully');
            }
            fetchUsers();
            resetForm();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleDelete = async (username) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(username, token);
                setSuccess('User deleted successfully');
                setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
            } catch (error) {
                setError('Failed to delete user');
            }
        }
    };

    const resetForm = () => {
        setSelectedUser(null);
        setFormData({
            username: '',
            newPassword: '',
            name: '',
            role: 'TENNIS_PLAYER'
        });
        navigate('/admin/users');
    };

    // Sorting functions
    const sortByField = (field) => {
        const sortedUsers = [...users].sort((a, b) => {
            const fieldA = a[field].toLowerCase();
            const fieldB = b[field].toLowerCase();
            if (fieldA < fieldB) return -1;
            if (fieldA > fieldB) return 1;
            return 0;
        });
        setUsers(sortedUsers);
    };

    if (loading) {
        return <div className="loading-container">Loading users...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">User Management</h1>
            </div>

            {error && <div className="error-container">{error}</div>}
            {success && <div className="success-container">{success}</div>}

            {/* Sorting Buttons */}
            <div className="sort-buttons">
                <button className="button button-secondary" onClick={() => sortByField('username')}>
                    Sort by Username
                </button>
                <button className="button button-secondary" onClick={() => sortByField('role')}>
                    Sort by Role
                </button>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>{selectedUser ? 'Edit User' : 'Create New User'}</h3>
                    <form onSubmit={handleSubmit} className="user-form">
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                disabled={selectedUser}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">
                                {selectedUser ? 'New Password (leave blank to keep current)' : 'Password'}
                            </label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                required={!selectedUser}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="TENNIS_PLAYER">Tennis Player</option>
                                <option value="REFEREE">Referee</option>
                                <option value="ADMINISTRATOR">Admin</option>
                            </select>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="button button-primary">
                                {selectedUser ? 'Update User' : 'Create User'}
                            </button>
                            {selectedUser && (
                                <button
                                    type="button"
                                    className="button button-secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                <div className="dashboard-card">
                    <h3>User List</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(user => (
                                <tr key={user.username}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <div className="table-actions">
                                            <button
                                                className="button button-secondary"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setFormData({
                                                        username: user.username,
                                                        newPassword: '',
                                                        name: user.name,
                                                        role: user.role
                                                    });
                                                    navigate(`/admin/users?username=${user.username}`);
                                                }}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="button button-danger"
                                                onClick={() => handleDelete(user.username)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
