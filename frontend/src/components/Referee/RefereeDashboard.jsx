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
        const fetchMatches = async () => {
            try {
                // Fetch by referee username using the updated API endpoint (see api.js)
                const data = await getRefereeMatches(username, token);
                // Sort matches by startDate
                const sortedMatches = data.sort(
                    (a, b) => new Date(a.startDate) - new Date(b.startDate)
                );
                setMatches(sortedMatches);
            } catch (err) {
                setError('Failed to load matches. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (username && token) {
            fetchMatches();
        }
    }, [username, token]);

    const renderMatchStatus = (match) => {
        const matchDate = new Date(match.startDate);
        const now = new Date();

        if (matchDate > now) {
            return <span className="status upcoming">Upcoming</span>;
        } else if (match.sets && match.sets.length > 0) {
            return <span className="status completed">Completed</span>;
        } else {
            return <span className="status in-progress">In Progress</span>;
        }
    };

    if (loading) {
        return <div className="loading-container">Loading dashboard...</div>;
    }

    // Filter today's and upcoming matches as before (using startDate)
    const today = new Date().toDateString();
    const todayMatches = matches.filter(m =>
        new Date(m.startDate).toDateString() === today
    );
    const upcomingMatches = matches.filter(
        m => new Date(m.startDate) > new Date()
    );

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
                {/* Today's Matches */}
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
                                {todayMatches.map(match => (
                                    <tr key={match.matchId}>
                                        <td>{match.tournamentName}</td>
                                        <td>{match.player1Name} vs {match.player2Name}</td>
                                        <td>{new Date(match.startDate).toLocaleTimeString()}</td>
                                        <td>{match.courtNumber}</td>
                                        <td>{renderMatchStatus(match)}</td>
                                        <td>
                                            {/* The update score button is shown regardless of match status so referee may update scores */}
                                            <Link
                                                to={`/referee/matches?matchId=${match.matchId}`}
                                                className="button button-primary"
                                            >
                                                Update Score
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Upcoming Matches */}
                <div className="dashboard-card">
                    <h2>Upcoming Matches</h2>
                    {upcomingMatches.length === 0 ? (
                        <p>No upcoming matches.</p>
                    ) : (
                        <div className="upcoming-matches">
                            {upcomingMatches.slice(0, 5).map(match => (
                                <div key={match.matchId} className="match-card">
                                    <div className="match-header">
                                        <span className="tournament-name">{match.tournamentName}</span>
                                        <span className="match-date">
                                            {new Date(match.startDate).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="match-details">
                                        <div className="players">
                                            {match.player1Name} vs {match.player2Name}
                                        </div>
                                        <div className="match-info">
                                            <span>Court {match.courtNumber}</span>
                                            <span>{new Date(match.startDate).toLocaleTimeString()}</span>
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
