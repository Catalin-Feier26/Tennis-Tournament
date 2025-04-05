import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const role = localStorage.getItem('role');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Tennis Tournament</Link>
            </div>
            <div className="navbar-menu">
                {role ? (
                    <>
                        {role === 'ADMIN' && (
                            <>
                                <Link to="/admin/users" className="nav-link">Manage Users</Link>
                                <Link to="/admin/matches" className="nav-link">Manage Matches</Link>
                            </>
                        )}
                        {role === 'PLAYER' && (
                            <>
                                <Link to="/player/tournaments" className="nav-link">Tournaments</Link>
                                <Link to="/player/schedule" className="nav-link">Schedule</Link>
                                <Link to="/player/scores" className="nav-link">Scores</Link>
                            </>
                        )}
                        {role === 'REFEREE' && (
                            <>
                                <Link to="/referee/schedule" className="nav-link">My Schedule</Link>
                                <Link to="/referee/scores" className="nav-link">Manage Scores</Link>
                            </>
                        )}
                        <div className="user-info">
                            <span className="username">{username}</span>
                            <button onClick={handleLogout} className="logout-button">Logout</button>
                        </div>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="nav-link">Login</Link>
                        <Link to="/register" className="nav-link">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar; 