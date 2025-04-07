import React, { useState, useEffect } from 'react';
import { getPlayerMatches } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Player.css';

const PlayerDashboard = () => {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState('');
    const { username, token } = getCurrentUser();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getPlayerMatches(username, token);
                setMatches(data);
            } catch (err) {
                setError('Failed to load your matches');
            }
        };

        fetchMatches();
    }, [username, token]);

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Welcome, {username}!</h1>
                <p className="dashboard-subtitle">Here are your upcoming matches.</p>
            </div>

            {error && <div className="error-container">{error}</div>}

            {matches.length === 0 ? (
                <p>You have no upcoming or past matches yet.</p>
            ) : (
                <div className="dashboard-card">
                    <h3>Your Matches</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Opponent</th>
                                <th>Referee</th>
                                <th>Tournament</th>
                                <th>Date & Time</th>
                                <th>Score</th>
                            </tr>
                            </thead>
                            <tbody>
                            {matches.map((match, index) => {
                                const isPlayer1 = match.player1Name === username;
                                const opponent = isPlayer1 ? match.player2Name : match.player1Name;
                                const playerScore = isPlayer1 ? match.scorePlayer1 : match.scorePlayer2;
                                const opponentScore = isPlayer1 ? match.scorePlayer2 : match.scorePlayer1;
                                return (
                                    <tr key={index}>
                                        <td>{opponent}</td>
                                        <td>{match.refereeName}</td>
                                        <td>{match.tournamentName}</td>
                                        <td>{new Date(match.startDate).toLocaleString()}</td>
                                        <td>{playerScore != null && opponentScore != null ? `${playerScore} - ${opponentScore}` : 'TBD'}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlayerDashboard;
