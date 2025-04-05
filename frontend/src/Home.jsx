import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
    return (
        <div className="home">
            <nav className="navbar">
                <div className="logo">Tennis Tournament</div>
                <div className="nav-buttons">
                    <Link to="/register" className="nav-button">
                        Register
                    </Link>
                    <Link to="/login" className="nav-button">
                        Login
                    </Link>
                </div>
            </nav>
            <main className="main-content">
                <h1>Welcome to the Tennis Tournament App</h1>
                <p>
                    Get ready to serve and smash! Join our tournament for an unforgettable
                    experience on the court.
                </p>
                <div className="tennis-image-container">
                    <img
                        src="tennis-banner.jpg"
                        alt="Tennis action"
                    />
                </div>
                <button className="cta-button">Learn More</button>
            </main>
        </div>
    );
};

export default Home;
