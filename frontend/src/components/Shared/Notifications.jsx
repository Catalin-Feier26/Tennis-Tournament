import React, { useState, useEffect } from 'react';
import {
    getUserNotifications,
    markNotificationAsRead
} from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Notifications.css';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const { username, token } = getCurrentUser();

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const data = await getUserNotifications(username, token);
            setNotifications(data);
        } catch (err) {
            setError('Failed to load notifications.');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id, token);
            fetchNotifications();
        } catch (err) {
            setError('Failed to mark notification as read.');
        }
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">My Notifications</h1>
            </div>

            {error && <div className="error-container">{error}</div>}

            <div className="dashboard-card">
                {notifications.length === 0 ? (
                    <p>No notifications.</p>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Message</th>
                                <th>Timestamp</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {notifications.map((n) => (
                                <tr key={n.id}>
                                    <td>{n.message}</td>
                                    <td>{new Date(n.timestamp).toLocaleString()}</td>
                                    <td>{n.read ? 'Read' : 'Unread'}</td>
                                    <td>
                                        {!n.read && (
                                            <button
                                                className="button button-primary"
                                                onClick={() => handleMarkAsRead(n.id)}
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
