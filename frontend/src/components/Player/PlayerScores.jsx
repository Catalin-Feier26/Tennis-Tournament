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
                            if (match.sets && match.sets.length > 0) {
                                let mySetsWon = 0;
                                let opponentSetsWon = 0;

                                match.sets.forEach((set) => {
                                    const p1 = set.player1Games;
                                    const p2 = set.player2Games;

                                    if (p1 != null && p2 != null) {
                                        if (isPlayer1 && p1 > p2) mySetsWon++;
                                        else if (!isPlayer1 && p2 > p1) mySetsWon++;

                                        if (isPlayer1 && p2 > p1) opponentSetsWon++;
                                        else if (!isPlayer1 && p1 > p2) opponentSetsWon++;
                                    }
                                });

                                if (mySetsWon > opponentSetsWon) result = 'Won';
                                else if (mySetsWon < opponentSetsWon) result = 'Lost';
                                else if (mySetsWon === opponentSetsWon && mySetsWon > 0) result = 'Draw';
                            }


                            return (
                                <tr key={idx}>
                                    <td>{match.player1Name}</td>
                                    <td>{match.player2Name}</td>
                                    <td>{match.refereeName}</td>
                                    <td>{match.tournamentName}</td>
                                    <td>{new Date(match.startDate).toLocaleString()}</td>
                                    <td>
                                        {match.sets && match.sets.length > 0
                                            ? match.sets.map((s) => `${s.player1Games} - ${s.player2Games}`).join(' | ')
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
