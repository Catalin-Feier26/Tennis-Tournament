import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getRefereeMatches, updateMatchScore } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Referee.css';

const UpdateScore = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { token, username } = getCurrentUser();
    const queryParams = new URLSearchParams(location.search);
    const matchId = queryParams.get('matchId');

    const [match, setMatch] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [scores, setScores] = useState({
        player1Sets: ['', '', ''],
        player2Sets: ['', '', '']
    });

    useEffect(() => {
        fetchMatch();
    }, [matchId]);

    const fetchMatch = async () => {
        try {
            const matches = await getRefereeMatches(username, token);
            const selectedMatch = matches.find(m => m.id.toString() === matchId);
            
            if (!selectedMatch) {
                throw new Error('Match not found');
            }
            
            setMatch(selectedMatch);
        } catch (error) {
            setError('Failed to load match details. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleScoreChange = (player, setIndex, value) => {
        const numericValue = value === '' ? '' : parseInt(value, 10);
        if (value === '' || (numericValue >= 0 && numericValue <= 7)) {
            setScores(prev => ({
                ...prev,
                [`player${player}Sets`]: prev[`player${player}Sets`].map(
                    (score, i) => i === setIndex ? value : score
                )
            }));
        }
    };

    const validateScores = () => {
        const sets = [];
        for (let i = 0; i < 3; i++) {
            const p1Score = parseInt(scores.player1Sets[i]);
            const p2Score = parseInt(scores.player2Sets[i]);
            
            if (!isNaN(p1Score) && !isNaN(p2Score)) {
                if (p1Score === p2Score) {
                    return 'Scores cannot be equal in a set';
                }
                if (Math.max(p1Score, p2Score) < 6) {
                    return 'Winning score must be at least 6';
                }
                if (Math.max(p1Score, p2Score) === 6 && Math.min(p1Score, p2Score) > 4) {
                    return 'Invalid score combination';
                }
                if (Math.max(p1Score, p2Score) === 7 && Math.min(p1Score, p2Score) !== 5 && Math.min(p1Score, p2Score) !== 6) {
                    return 'Invalid score combination';
                }
                sets.push({ player1Score: p1Score, player2Score: p2Score });
            }
        }
        
        if (sets.length === 0) {
            return 'At least one set must be completed';
        }
        
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const validationError = validateScores();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const scoreData = {
                sets: scores.player1Sets.map((_, index) => ({
                    player1Score: parseInt(scores.player1Sets[index]),
                    player2Score: parseInt(scores.player2Sets[index])
                })).filter(set => !isNaN(set.player1Score) && !isNaN(set.player2Score))
            };

            await updateMatchScore(matchId, scoreData, token);
            setSuccess('Match score updated successfully');
            setTimeout(() => {
                navigate('/referee/dashboard');
            }, 2000);
        } catch (error) {
            setError(error.message || 'Failed to update match score');
        }
    };

    if (loading) {
        return <div className="loading-container">Loading match details...</div>;
    }

    if (!match) {
        return <div className="error-container">Match not found</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Update Match Score</h1>
            </div>

            <form className="score-form" onSubmit={handleSubmit}>
                <div className="match-info-header">
                    <p><strong>Tournament:</strong> {match.tournament.name}</p>
                    <p><strong>Date:</strong> {new Date(match.matchDate).toLocaleDateString()}</p>
                    <p><strong>Court:</strong> {match.court}</p>
                </div>

                {error && <div className="error-container">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <div className="score-inputs">
                    <div className="player-score">
                        <h3>{match.player1.username}</h3>
                        <div className="set-inputs">
                            {scores.player1Sets.map((score, index) => (
                                <input
                                    key={index}
                                    type="number"
                                    className="set-input"
                                    value={score}
                                    onChange={(e) => handleScoreChange(1, index, e.target.value)}
                                    min="0"
                                    max="7"
                                    placeholder={`Set ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="player-score">
                        <h3>{match.player2.username}</h3>
                        <div className="set-inputs">
                            {scores.player2Sets.map((score, index) => (
                                <input
                                    key={index}
                                    type="number"
                                    className="set-input"
                                    value={score}
                                    onChange={(e) => handleScoreChange(2, index, e.target.value)}
                                    min="0"
                                    max="7"
                                    placeholder={`Set ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <button type="submit" className="submit-score">
                    Update Score
                </button>
            </form>
        </div>
    );
};

export default UpdateScore; 