import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRefereeMatches, updateMatchScore } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Referee.css';

const BEST_OF_SETS = 3;

const UpdateScore = () => {
    const { token, username } = getCurrentUser();
    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [editMatchId, setEditMatchId] = useState(null);
    const [sets, setSets] = useState([]);

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
        if (match.sets && match.sets.length > 0) {
            const initSets = match.sets.map(s => ({
                player1Games: s.player1Games != null ? s.player1Games.toString() : '',
                player2Games: s.player2Games != null ? s.player2Games.toString() : ''
            }));
            while (initSets.length < BEST_OF_SETS) {
                initSets.push({ player1Games: '', player2Games: '' });
            }
            setSets(initSets);
        } else {
            setSets(Array.from({ length: BEST_OF_SETS }, () => ({ player1Games: '', player2Games: '' })));
        }
        setError('');
        setSuccess('');
    };

    const handleCancelEdit = () => {
        setEditMatchId(null);
        setSets([]);
    };

    const handleSetChange = (setIndex, player, value) => {
        const numericValue = value === '' ? '' : parseInt(value, 10);
        if (value === '' || (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 7)) {
            const updatedSets = sets.map((setObj, idx) =>
                idx === setIndex ? { ...setObj, [player]: value } : setObj
            );
            setSets(updatedSets);
        }
    };

    const handleSaveClick = async (matchId) => {
        setError('');
        setSuccess('');

        const processedSets = sets
            .map(s => ({
                player1Games: s.player1Games !== '' ? parseInt(s.player1Games, 10) : null,
                player2Games: s.player2Games !== '' ? parseInt(s.player2Games, 10) : null
            }))
            .filter(s => s.player1Games !== null && s.player2Games !== null);

        if (processedSets.length === 0) {
            setError('At least one complete set must be entered');
            return;
        }

        for (let s of processedSets) {
            if (s.player1Games === s.player2Games) {
                setError('Scores cannot be equal in a set');
                return;
            }
            if (Math.max(s.player1Games, s.player2Games) < 6) {
                setError('Winning score must be at least 6');
                return;
            }
            if (Math.max(s.player1Games, s.player2Games) === 6 && Math.min(s.player1Games, s.player2Games) > 4) {
                setError('Invalid 6-x score');
                return;
            }
            if (
                Math.max(s.player1Games, s.player2Games) === 7 &&
                ![5, 6].includes(Math.min(s.player1Games, s.player2Games))
            ) {
                setError('Invalid 7-x score');
                return;
            }
        }

        const body = {
            matchId: matchId,
            sets: processedSets
        };

        try {
            await updateMatchScore(matchId, body, token);
            setSuccess('Match score updated successfully!');
            const updatedMatches = matches.map((m) =>
                m.matchId === matchId ? { ...m, sets: processedSets } : m
            );
            setMatches(updatedMatches);
            handleCancelEdit();
        } catch (err) {
            setError(err.message || 'Failed to update match score');
        }
    };

    const renderSetScores = (match) => {
        if (Array.isArray(match.sets) && match.sets.length > 0) {
            return match.sets
                .map((s, i) => {
                    const p1 = s?.player1Games ?? '-';
                    const p2 = s?.player2Games ?? '-';
                    return (
                        <div key={i}>
                            <strong>Set {i + 1}:</strong> {p1} - {p2}
                        </div>
                    );
                });
        } else {
            return 'No scores yet';
        }
    };

    if (loading) return <div className="loading-container">Loading matches...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Manage Match Scores</h1>
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
                        {matches.map(match => (
                            <tr key={match.matchId}>
                                <td>{match.tournamentName}</td>
                                <td>{match.player1Name} vs {match.player2Name}</td>
                                <td>{new Date(match.startDate).toLocaleDateString()}</td>
                                <td>{new Date(match.startDate).toLocaleTimeString()}</td>
                                <td>
                                    {editMatchId === match.matchId ? (
                                        sets.map((s, index) => (
                                            <div key={index} className="set-inputs">
                                                <strong>Set {index + 1}:</strong>
                                                <input
                                                    type="number"
                                                    value={s.player1Games}
                                                    onChange={(e) => handleSetChange(index, 'player1Games', e.target.value)}
                                                    min="0"
                                                    max="7"
                                                    placeholder="P1 Games"
                                                    required
                                                />
                                                <span> - </span>
                                                <input
                                                    type="number"
                                                    value={s.player2Games}
                                                    onChange={(e) => handleSetChange(index, 'player2Games', e.target.value)}
                                                    min="0"
                                                    max="7"
                                                    placeholder="P2 Games"
                                                    required
                                                />
                                            </div>
                                        ))
                                    ) : (
                                        renderSetScores(match)
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
