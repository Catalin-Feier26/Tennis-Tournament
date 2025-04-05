import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Referee.css';

const UpdateScore = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        player1Score: '',
        player2Score: '',
        winner: ''
    });

    useEffect(() => {
        fetchMatchDetails();
    }, [matchId]);

    const fetchMatchDetails = async () => {
        try {
            const response = await fetch(`http://localhost:9090/api/matches/${matchId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch match details');
            }

            const data = await response.json();
            setMatch(data);
            setFormData({
                player1Score: data.player1Score || '',
                player2Score: data.player2Score || '',
                winner: data.winner || ''
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:9090/api/matches/score', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    matchId: matchId,
                    player1Score: formData.player1Score,
                    player2Score: formData.player2Score,
                    winner: formData.winner
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update score');
            }

            navigate('/referee/schedule');
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading match details...</div>;
    }

    if (!match) {
        return <div className="error-message">Match not found</div>;
    }

    return (
        <div className="referee-container">
            <h2>Update Match Score</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="match-details">
                <h3>Match Details</h3>
                <p>Tournament: {match.tournamentName}</p>
                <p>Player 1: {match.player1Name}</p>
                <p>Player 2: {match.player2Name}</p>
                <p>Date: {new Date(match.matchDate).toLocaleString()}</p>
                <p>Court: {match.court}</p>
            </div>

            <form onSubmit={handleSubmit} className="score-form">
                <div className="form-group">
                    <label htmlFor="player1Score">{match.player1Name} Score</label>
                    <input
                        type="number"
                        id="player1Score"
                        name="player1Score"
                        value={formData.player1Score}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="player2Score">{match.player2Name} Score</label>
                    <input
                        type="number"
                        id="player2Score"
                        name="player2Score"
                        value={formData.player2Score}
                        onChange={handleChange}
                        min="0"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="winner">Winner</label>
                    <select
                        id="winner"
                        name="winner"
                        value={formData.winner}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select winner</option>
                        <option value={match.player1Id}>{match.player1Name}</option>
                        <option value={match.player2Id}>{match.player2Name}</option>
                    </select>
                </div>
                <div className="form-actions">
                    <button type="submit">Update Score</button>
                    <button type="button" onClick={() => navigate('/referee/schedule')}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UpdateScore; 