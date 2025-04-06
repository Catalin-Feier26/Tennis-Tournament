import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPlayerMatches } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Player.css';

const PlayerDashboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, username } = getCurrentUser();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const data = await getPlayerMatches(username, token);
            // Sort matches by date, showing upcoming matches first
            const sortedMatches = data.sort((a, b) => 
                new Date(a.matchDate) - new Date(b.matchDate)
            );
            setMatches(sortedMatches);
        } catch (error) {
            setError('Failed to load matches. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const renderMatchStatus = (match) => {
        const matchDate = new Date(match.matchDate);
        const now = new Date();

        if (matchDate > now) {
            return <span className="status upcoming">Upcoming</span>;
        } else if (match.winner) {
            return <span className="status completed">Completed</span>;
        } else {
            return <span className="status in-progress">In Progress</span>;
        }
    };

    if (loading) {
        return <div className="loading-container">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Player Dashboard</h1>
                <div className="dashboard-actions">
                    <Link to="/player/tournaments" className="button button-primary">
                        Register for Tournament
                    </Link>
                </div>
            </div>

            {error && <div className="error-container">{error}</div>}

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>Upcoming Matches</h2>
                    {matches.length === 0 ? (
                        <p>No upcoming matches scheduled.</p>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tournament</th>
                                        <th>Opponent</th>
                                        <th>Date</th>
                                        <th>Court</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {matches.map((match) => (
                                        <tr key={match.id}>
                                            <td>{match.tournament.name}</td>
                                            <td>
                                                {match.player1.username === username
                                                    ? match.player2.username
                                                    : match.player1.username}
                                            </td>
                                            <td>
                                                {new Date(match.matchDate).toLocaleDateString()}
                                            </td>
                                            <td>{match.court}</td>
                                            <td>{renderMatchStatus(match)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="dashboard-card">
                    <h2>Quick Links</h2>
                    <div className="quick-links">
                        <Link to="/player/schedule" className="quick-link">
                            View Full Schedule
                        </Link>
                        <Link to="/player/scores" className="quick-link">
                            View Match History
                        </Link>
                        <Link to="/profile" className="quick-link">
                            Update Profile
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlayerDashboard; 