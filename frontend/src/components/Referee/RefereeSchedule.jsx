import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRefereeMatches } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Referee.css';

const RefereeSchedule = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: 'all',
        tournament: 'all'
    });

    const { token, username } = getCurrentUser();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const data = await getRefereeMatches(username, token);
                const sorted = data.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
                setMatches(sorted);
            } catch (err) {
                setError('Failed to load matches. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (username && token) {
            fetchMatches();
        }
    }, [username, token]);

    const getMatchStatus = (match) => {
        const matchDate = new Date(match.startDate);
        const now = new Date();

        if (matchDate > now) return 'upcoming';
        if (match.scorePlayer1 != null && match.scorePlayer2 != null) return 'completed';
        return 'in-progress';
    };

    const filterMatches = () => {
        return matches.filter(match => {
            const statusMatch = filters.status === 'all' || getMatchStatus(match) === filters.status;
            const tournamentMatch = filters.tournament === 'all' || match.tournamentName === filters.tournament;
            return statusMatch && tournamentMatch;
        });
    };

    const getTournaments = () => {
        const names = matches.map(m => m.tournamentName).filter(Boolean);
        return Array.from(new Set(names));
    };

    const renderMatchStatus = (match) => {
        const status = getMatchStatus(match);
        return <span className={`status ${status}`}>
            {status === 'upcoming' ? 'Upcoming' :
                status === 'completed' ? 'Completed' : 'In Progress'}
        </span>;
    };

    const filteredMatches = filterMatches();
    const tournamentOptions = getTournaments();

    if (loading) return <div className="loading-container">Loading schedule...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Match Schedule</h1>
            </div>

            {error && <div className="error-container">{error}</div>}

            <div className="schedule-filters">
                <div className="filter-group">
                    <label htmlFor="status">Status</label>
                    <select
                        id="status"
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    >
                        <option value="all">All Matches</option>
                        <option value="upcoming">Upcoming</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label htmlFor="tournament">Tournament</label>
                    <select
                        id="tournament"
                        className="filter-select"
                        value={filters.tournament}
                        onChange={(e) => setFilters(prev => ({ ...prev, tournament: e.target.value }))}
                    >
                        <option value="all">All Tournaments</option>
                        {tournamentOptions.map(tournament => (
                            <option key={tournament} value={tournament}>{tournament}</option>
                        ))}
                    </select>
                </div>
            </div>

            {filteredMatches.length === 0 ? (
                <p>No matches found matching the selected filters.</p>
            ) : (
                <div className="table-container">
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>Tournament</th>
                            <th>Players</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Court</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredMatches.map(match => (
                            <tr key={match.matchId}>
                                <td>{match.tournamentName}</td>
                                <td>{match.player1Name} vs {match.player2Name}</td>
                                <td>{new Date(match.startDate).toLocaleDateString()}</td>
                                <td>{new Date(match.startDate).toLocaleTimeString()}</td>
                                <td>{match.courtNumber}</td>
                                <td>{renderMatchStatus(match)}</td>
                                <td>
                                    {(match.scorePlayer1 == null || match.scorePlayer2 == null) && (
                                        <Link
                                            to={`/referee/matches?matchId=${match.matchId}`}
                                            className="button button-primary"
                                        >
                                            Update Score
                                        </Link>
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

export default RefereeSchedule;
