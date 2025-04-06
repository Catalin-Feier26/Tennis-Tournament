import React, { useState, useEffect } from 'react';
import './Player.css';

const PlayerSchedule = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/matches/player/${username}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setMatches(data);
                } else if (response.status === 403) {
                    setError('Access denied. Please log in again.');
                    window.location.href = '/login';
                } else {
                    throw new Error('Failed to fetch matches');
                }
            } catch (err) {
                setError('Failed to load matches');
            } finally {
                setLoading(false);
            }
        };

        if (token && username) {
            fetchMatches();
        }
    }, [token, username]);

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="schedule-container">
            <h2>My Match Schedule</h2>
            {matches.length === 0 ? (
                <p>No matches scheduled.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tournament</th>
                                <th>Opponent</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Court</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {matches.map(match => (
                                <tr key={match.id}>
                                    <td>{match.tournament.name}</td>
                                    <td>
                                        {match.player1.username === username 
                                            ? match.player2.username 
                                            : match.player1.username}
                                    </td>
                                    <td>{new Date(match.matchDate).toLocaleDateString()}</td>
                                    <td>{new Date(match.matchDate).toLocaleTimeString()}</td>
                                    <td>{match.court}</td>
                                    <td>{match.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PlayerSchedule; 