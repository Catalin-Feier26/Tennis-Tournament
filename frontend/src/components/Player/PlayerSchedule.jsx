import React, { useState, useEffect } from 'react';
import './Player.css';

const PlayerSchedule = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');

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
                        {matches.map((match, index) => {
                            const isPlayer1 = match.player1Name === username;
                            const opponent = isPlayer1 ? match.player2Name : match.player1Name;
                            const matchDate = new Date(match.startDate);
                            const now = new Date();

                            const isScored =
                                match.scorePlayer1 !== null &&
                                match.scorePlayer2 !== null &&
                                !(match.scorePlayer1 === 0 && match.scorePlayer2 === 0);

                            const hasStarted = matchDate <= now;

                            let status;
                            if (isScored && hasStarted) {
                                status = 'Completed';
                            } else if (!hasStarted) {
                                status = 'Upcoming';
                            } else {
                                status = 'Pending';
                            }

                            return (
                                <tr key={index}>
                                    <td>{match.tournamentName}</td>
                                    <td>{opponent}</td>
                                    <td>{matchDate.toLocaleDateString()}</td>
                                    <td>{matchDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td>{match.courtNumber}</td>
                                    <td>{status}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PlayerSchedule;
