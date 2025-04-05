import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Referee.css';

const RefereeSchedule = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/matches/referee', {
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

    const handleUpdateScore = (matchId) => {
        navigate(`/referee/scores/${matchId}`);
    };

    if (loading) {
        return <div className="loading">Loading matches...</div>;
    }

    return (
        <div className="referee-container">
            <h2>Match Schedule</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="matches-list">
                <table>
                    <thead>
                        <tr>
                            <th>Tournament</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Date</th>
                            <th>Court</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(match => (
                            <tr key={match.id}>
                                <td>{match.tournamentName}</td>
                                <td>{match.player1Name}</td>
                                <td>{match.player2Name}</td>
                                <td>{new Date(match.matchDate).toLocaleString()}</td>
                                <td>{match.court}</td>
                                <td>{match.status}</td>
                                <td>
                                    <button 
                                        onClick={() => handleUpdateScore(match.id)}
                                        disabled={match.status === 'COMPLETED'}
                                    >
                                        Update Score
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RefereeSchedule; 