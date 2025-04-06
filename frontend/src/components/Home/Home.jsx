import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isAuthenticated } from '../../utils/auth';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();
    const authenticated = isAuthenticated();
    const role = sessionStorage.getItem('role');

    return (
        <div className="home">
            <nav className="navbar">
                <div className="logo">Tennis Tournament</div>
                <div className="nav-buttons">
                    {authenticated ? (
                        <button
                            onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)}
                            className="nav-button"
                        >
                            Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/register')}
                                className="nav-button"
                            >
                                Register
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="nav-button"
                            >
                                Login
                            </button>
                        </>
                    )}
                </div>
            </nav>
            <main className="main-content">
                <h1>Welcome to the Tennis Tournament App</h1>
                <p>
                    Get ready to serve and smash! Join our tournament for an unforgettable experience on the court.
                </p>
                <div className="cta-buttons">
                    {authenticated ? (
                        <button
                            onClick={() => navigate(`/${role.toLowerCase()}/dashboard`)}
                            className="cta-button"
                        >
                            Go to Dashboard
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/register')}
                                className="cta-button"
                            >
                                Join Now
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="cta-button secondary"
                            >
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Home;
