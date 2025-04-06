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
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const data = await getRefereeMatches(username, token);
            // Sort matches by date
            const sortedMatches = data.sort((a, b) => 
                new Date(a.matchDate) - new Date(b.matchDate)
            );
            setMatches(sortedMatches);
        } catch (error) {
            setError('Failed to load matches. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const getMatchStatus = (match) => {
        const matchDate = new Date(match.matchDate);
        const now = new Date();

        if (matchDate > now) {
            return 'upcoming';
        } else if (match.winner) {
            return 'completed';
        } else {
            return 'in-progress';
        }
    };

    const filterMatches = () => {
        return matches.filter(match => {
            if (filters.status !== 'all' && getMatchStatus(match) !== filters.status) {
                return false;
            }
            if (filters.tournament !== 'all' && match.tournament.name !== filters.tournament) {
                return false;
            }
            return true;
        });
    };

    const getTournaments = () => {
        const tournaments = new Set(matches.map(match => match.tournament.name));
        return Array.from(tournaments);
    };

    const renderMatchStatus = (match) => {
        const status = getMatchStatus(match);
        return <span className={`status ${status}`}>
            {status === 'upcoming' ? 'Upcoming' :
             status === 'completed' ? 'Completed' : 'In Progress'}
        </span>;
    };

    if (loading) {
        return <div className="loading-container">Loading schedule...</div>;
    }

    const filteredMatches = filterMatches();
    const tournaments = getTournaments();

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
                        {tournaments.map(tournament => (
                            <option key={tournament} value={tournament}>
                                {tournament}
                            </option>
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
                            {filteredMatches.map((match) => (
                                <tr key={match.id}>
                                    <td>{match.tournament.name}</td>
                                    <td>
                                        {match.player1.username} vs {match.player2.username}
                                    </td>
                                    <td>
                                        {new Date(match.matchDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {new Date(match.matchDate).toLocaleTimeString()}
                                    </td>
                                    <td>{match.court}</td>
                                    <td>{renderMatchStatus(match)}</td>
                                    <td>
                                        {!match.winner && (
                                            <Link 
                                                to={`/referee/matches?matchId=${match.id}`}
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