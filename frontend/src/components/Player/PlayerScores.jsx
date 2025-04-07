import React, { useState, useEffect } from 'react';
import './Player.css';

const PlayerScores = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch(`http://localhost:9090/api/matches/player/${username}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) throw new Error('Failed to fetch matches');

                const data = await response.json();

                // Sort by date ascending
                const sorted = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setMatches(sorted);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMatches();
    }, [token, username]);

    if (loading) {
        return <div className="loading">Loading matches...</div>;
    }

    return (
        <div className="scores-container">
            <h2 className="schedule-title">My Match Scores</h2>

            {error && <div className="error-message">{error}</div>}

            {matches.length === 0 ? (
                <p className="loading">No matches found.</p>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                        <tr>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Referee</th>
                            <th>Tournament</th>
                            <th>Date & Time</th>
                            <th>Score</th>
                            <th>Result</th>
                        </tr>
                        </thead>
                        <tbody>
                        {matches.map((match, idx) => {
                            const isPlayer1 = match.player1Name === username;
                            const myScore = isPlayer1 ? match.scorePlayer1 : match.scorePlayer2;
                            const opponentScore = isPlayer1 ? match.scorePlayer2 : match.scorePlayer1;

                            let result = 'Not played yet';
                            if (myScore != null && opponentScore != null) {
                                result =
                                    myScore > opponentScore
                                        ? 'Won'
                                        : myScore < opponentScore
                                            ? 'Lost'
                                            : 'Draw';
                            }

                            return (
                                <tr key={idx}>
                                    <td>{match.player1Name}</td>
                                    <td>{match.player2Name}</td>
                                    <td>{match.refereeName}</td>
                                    <td>{match.tournamentName}</td>
                                    <td>{new Date(match.startDate).toLocaleString()}</td>
                                    <td>
                                        {myScore != null && opponentScore != null
                                            ? `${myScore} - ${opponentScore}`
                                            : 'TBD'}
                                    </td>
                                    <td>
                                            <span className={`status ${
                                                result === 'Won' ? 'won' :
                                                    result === 'Lost' ? 'lost' :
                                                        result === 'Draw' ? 'draw' :
                                                            'upcoming'
                                            }`}>
                                                {result}
                                            </span>
                                    </td>
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

export default PlayerScores;
