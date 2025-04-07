import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROLES, clearUserData, getCurrentUser } from '../../utils/auth';
import './Shared.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ role: '', username: '' });

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    const handleLogout = () => {
        clearUserData();
        navigate('/login');
    };

    const getNavLinks = () => {
        switch (user.role) {
            case ROLES.ADMINISTRATOR:
                return [
                    { to: '/admin/dashboard', text: 'Dashboard' },
                    { to: '/admin/users', text: 'User Management' },
                    { to: '/admin/matches', text: 'Match Management' }
                ];
            case ROLES.REFEREE:
                return [
                    { to: '/referee/dashboard', text: 'Dashboard' },
                    { to: '/referee/schedule', text: 'My Schedule' },
                    { to: '/referee/matches', text: 'Update Scores' }
                ];
            case ROLES.TENNIS_PLAYER:
                return [
                    { to: '/player/dashboard', text: 'Dashboard' },
                    { to: '/player/tournaments', text: 'Tournaments' },
                    { to: '/player/schedule', text: 'My Schedule' },
                    { to: '/player/scores', text: 'My Scores' },
                    { to: '/player/view-matches', text: 'See Matches' }
                ];

            default:
                return [];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <Link to="/">Tennis Tournament</Link>
            </div>

            <div className="navbar-menu">
                {navLinks.map((link, index) => (
                    <Link key={index} to={link.to} className="nav-link">
                        {link.text}
                    </Link>
                ))}
            </div>

            <div className="navbar-end">
                <div className="user-info">
                    <Link to="/profile" className="nav-link">
                        {user.username}
                    </Link>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
