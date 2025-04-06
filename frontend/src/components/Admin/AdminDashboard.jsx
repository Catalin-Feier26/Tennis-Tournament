import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Admin.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token } = getCurrentUser();

    useEffect(() => {
        fetchUsers();
    }, []);

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

    const getUserStats = () => {
        const stats = {
            total: users.length,
            players: users.filter(user => user.role === 'TENNIS_PLAYER').length,
            referees: users.filter(user => user.role === 'REFEREE').length,
            admins: users.filter(user => user.role === 'ADMINISTRATOR').length
        };
        return stats;
    };

    if (loading) {
        return <div className="loading-container">Loading dashboard...</div>;
    }

    const stats = getUserStats();

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <div className="dashboard-actions">
                    <Link to="/admin/users" className="button button-primary">
                        Manage Users
                    </Link>
                    <Link to="/admin/matches" className="button button-primary">
                        Manage Matches
                    </Link>
                    {/* New button for Tournament Management */}
                    <Link to="/admin/tournaments" className="button button-primary">
                        Manage Tournaments
                    </Link>
                </div>
            </div>

            {error && <div className="error-container">{error}</div>}

            <div className="stats-grid">
                <div className="stats-card">
                    <h3>Total Users</h3>
                    <div className="stats-number">{stats.total}</div>
                    <div className="stats-breakdown">
                        <div className="stats-item">
                            <span className="stats-label">Players</span>
                            <span className="stats-value">{stats.players}</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-label">Referees</span>
                            <span className="stats-value">{stats.referees}</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-label">Admins</span>
                            <span className="stats-value">{stats.admins}</span>
                        </div>
                    </div>
                </div>

                <div className="stats-card">
                    <h3>Quick Actions</h3>
                    <div className="quick-actions">
                        <Link to="/admin/users?action=new" className="action-link">
                            Add New User
                        </Link>
                        <Link to="/admin/matches?action=export" className="action-link">
                            Export Match Data
                        </Link>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h3>Recent Users</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.slice(0, 5).map(user => (
                                <tr key={user.username}>
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <Link
                                            to={`/admin/users?username=${user.username}`}
                                            className="button button-secondary"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    {users.length > 5 && (
                        <Link to="/admin/users" className="view-all-link">
                            View all users
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
