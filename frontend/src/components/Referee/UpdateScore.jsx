import React, { useState, useEffect } from 'react';
import { getRefereeMatches, updateMatchScore } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Referee.css';

const UpdateScore = () => {
    const { token, username } = getCurrentUser();
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMatchId, setEditMatchId] = useState(null);
    const [score1, setScore1] = useState('');
    const [score2, setScore2] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getRefereeMatches(username, token);
                setMatches(data);
            } catch (err) {
                setError('Failed to load matches');
            } finally {
                setLoading(false);
            }
        };

        if (username && token) {
            fetchMatches();
        }
    }, [username, token]);

    const handleEditClick = (match) => {
        setEditMatchId(match.matchId);
        setScore1(match.scorePlayer1);
        setScore2(match.scorePlayer2);
        setError('');
        setSuccess('');
    };

    const handleCancelEdit = () => {
        setEditMatchId(null);
        setScore1('');
        setScore2('');
    };

    const handleSaveClick = async (matchId) => {
        if (score1 < 0 || score2 < 0) {
            setError('Scores must be zero or positive');
            return;
        }

        try {
            await updateMatchScore(matchId, {
                matchId: matchId,
                scorePlayer1: parseInt(score1),
                scorePlayer2: parseInt(score2)
            }, token);

            const updated = matches.map(m =>
                m.matchId === matchId
                    ? { ...m, scorePlayer1: parseInt(score1), scorePlayer2: parseInt(score2) }
                    : m
            );
            setMatches(updated);
            setSuccess('Score updated successfully');
            handleCancelEdit();
        } catch (err) {
            setError(err.message || 'Failed to update score');
        }
    };

    if (loading) return <div className="loading-container">Loading matches...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Update Match Scores</h1>
            </div>

            {error && <div className="error-container">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {matches.length === 0 ? (
                <p>No matches assigned to you.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Tournament</th>
                            <th>Players</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Score</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {matches.map((match) => (
                            <tr key={match.matchId}>
                                <td>{match.tournamentName}</td>
                                <td>{match.player1Name} vs {match.player2Name}</td>
                                <td>{new Date(match.startDate).toLocaleDateString()}</td>
                                <td>{new Date(match.startDate).toLocaleTimeString()}</td>
                                <td>
                                    {editMatchId === match.matchId ? (
                                        <>
                                            <input
                                                type="number"
                                                min="0"
                                                value={score1}
                                                onChange={(e) => setScore1(e.target.value)}
                                                className="score-input"
                                            />
                                            {' - '}
                                            <input
                                                type="number"
                                                min="0"
                                                value={score2}
                                                onChange={(e) => setScore2(e.target.value)}
                                                className="score-input"
                                            />
                                        </>
                                    ) : (
                                        `${match.scorePlayer1} - ${match.scorePlayer2}`
                                    )}
                                </td>
                                <td>
                                    {editMatchId === match.matchId ? (
                                        <>
                                            <button className="button button-primary" onClick={() => handleSaveClick(match.matchId)}>Save</button>
                                            <button className="button button-secondary" onClick={handleCancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <button className="button button-primary" onClick={() => handleEditClick(match)}>Edit</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UpdateScore;
