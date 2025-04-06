import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRefereeMatches } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Referee.css';

const RefereeDashboard = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { token, username } = getCurrentUser();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const data = await getRefereeMatches(username, token);
            // Sort matches by date
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

    const upcomingMatches = matches.filter(match => new Date(match.matchDate) > new Date());
    const todayMatches = matches.filter(match => {
        const matchDate = new Date(match.matchDate);
        const today = new Date();
        return matchDate.toDateString() === today.toDateString();
    });

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Referee Dashboard</h1>
                <div className="dashboard-actions">
                    <Link to="/referee/schedule" className="button button-primary">
                        View Full Schedule
                    </Link>
                </div>
            </div>

            {error && <div className="error-container">{error}</div>}

            <div className="dashboard-grid">
                <div className="dashboard-card">
                    <h2>Today's Matches</h2>
                    {todayMatches.length === 0 ? (
                        <p>No matches scheduled for today.</p>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Tournament</th>
                                        <th>Players</th>
                                        <th>Time</th>
                                        <th>Court</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {todayMatches.map((match) => (
                                        <tr key={match.id}>
                                            <td>{match.tournament.name}</td>
                                            <td>
                                                {match.player1.username} vs {match.player2.username}
                                            </td>
                                            <td>
                                                {new Date(match.matchDate).toLocaleTimeString()}
                                            </td>
                                            <td>{match.court}</td>
                                            <td>{renderMatchStatus(match)}</td>
                                            <td>
                                                {!match.winner && (
                                                    <Link 
                                                        to={`/referee/matches?matchId=${match.id}`}
                                                        className="button button-primary"
                                                    >
                                                        Update Score
                                                    </Link>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="dashboard-card">
                    <h2>Upcoming Matches</h2>
                    {upcomingMatches.length === 0 ? (
                        <p>No upcoming matches assigned.</p>
                    ) : (
                        <div className="upcoming-matches">
                            {upcomingMatches.slice(0, 5).map((match) => (
                                <div key={match.id} className="match-card">
                                    <div className="match-header">
                                        <span className="tournament-name">{match.tournament.name}</span>
                                        <span className="match-date">
                                            {new Date(match.matchDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="match-details">
                                        <div className="players">
                                            {match.player1.username} vs {match.player2.username}
                                        </div>
                                        <div className="match-info">
                                            <span>Court {match.court}</span>
                                            <span>
                                                {new Date(match.matchDate).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {upcomingMatches.length > 5 && (
                                <Link to="/referee/schedule" className="view-all-link">
                                    View all {upcomingMatches.length} upcoming matches
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RefereeDashboard; 