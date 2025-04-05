import React, { useState, useEffect } from 'react';
import './Player.css';

const PlayerSchedule = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/matches/player', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }

            const data = await response.json();
            setMatches(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading matches...</div>;
    }

    return (
        <div className="player-container">
            <h2>My Match Schedule</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="matches-list">
                <table>
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
                        {matches.map(match => (
                            <tr key={match.id}>
                                <td>{match.tournamentName}</td>
                                <td>
                                    {match.player1Id === localStorage.getItem('userId') 
                                        ? match.player2Name 
                                        : match.player1Name}
                                </td>
                                <td>{new Date(match.matchDate).toLocaleString()}</td>
                                <td>{match.court}</td>
                                <td>{match.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerSchedule; 