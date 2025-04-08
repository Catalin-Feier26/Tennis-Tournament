import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMatchesByTournament } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Player.css';

const TournamentMatches = () => {
    const { token } = getCurrentUser();
    const { tournamentId } = useParams();
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getMatchesByTournament(tournamentId, token);
                setMatches(data);
            } catch (err) {
                setError('Failed to load matches.');
            }
        };

        fetchMatches();
    }, [tournamentId, token]);

    return (
        <div className="dashboard-container">
            <h2>Matches for Tournament</h2>
            {error && <div className="error-container">{error}</div>}

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Player 1</th>
                        <th>Player 2</th>
                        <th>Referee</th>
                        <th>Date & Time</th>
                        <th>Score</th>
                    </tr>
                    </thead>
                    <tbody>
                    {matches.map((match, idx) => (
                        <tr key={idx}>
                            <td>{match.player1Name}</td>
                            <td>{match.player2Name}</td>
                            <td>{match.refereeName}</td>
                            <td>{new Date(match.startDate).toLocaleString()}</td>
                            <td>
                                {match.sets && match.sets.length > 0
                                    ? match.sets.map((s) => `${s.player1Games} - ${s.player2Games}`).join(' | ')
                                    : 'TBD'}
                            </td>

                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TournamentMatches;
