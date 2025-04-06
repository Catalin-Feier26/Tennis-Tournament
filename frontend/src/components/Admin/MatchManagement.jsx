import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getTournaments,
    getMatchesByTournament,
    createMatch,
    updateMatch,
    deleteMatch,
    getAllUsers
} from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Admin.css';

const MatchManagement = () => {
    // State for tournaments
    const [tournaments, setTournaments] = useState([]);
    // State for selected tournament (if any)
    const [selectedTournament, setSelectedTournament] = useState(null);
    // State for matches belonging to the selected tournament
    const [matches, setMatches] = useState([]);
    // State for users (to populate drop-downs)
    const [users, setUsers] = useState([]);
    // Other UI state variables
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [formData, setFormData] = useState({
        player1Username: '',
        player2Username: '',
        refereeUsername: '',
        courtNumber: '',
        matchDate: '',
        matchTime: ''
    });

    const { token } = getCurrentUser();
    const navigate = useNavigate();

    // On mount, fetch tournaments and users
    useEffect(() => {
        fetchTournaments();
        fetchUsers();
        setLoading(false);
    }, []);

    const fetchTournaments = async () => {
        try {
            const data = await getTournaments(token);
            setTournaments(data);
        } catch (err) {
            setError('Failed to load tournaments.');
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await getAllUsers(token);
            setUsers(data);
        } catch (err) {
            setError('Failed to load users.');
        }
    };

    const fetchMatchesForTournament = async (tournamentId) => {
        try {
            const data = await getMatchesByTournament(tournamentId, token);
            setMatches(data);
        } catch (err) {
            setError('Failed to load matches for the selected tournament.');
        }
    };

    // Called when a tournament row is clicked
    const handleTournamentSelect = (tournament) => {
        setSelectedTournament(tournament);
        fetchMatchesForTournament(tournament.id);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Combine matchDate and matchTime into an ISO string, and include tournament id
        const matchData = {
            ...formData,
            matchDateTime: `${formData.matchDate}T${formData.matchTime}`,
            tournamentId: selectedTournament.id
        };

        try {
            if (selectedMatch) {
                await updateMatch(selectedMatch.id, matchData, token);
                setSuccess('Match updated successfully');
            } else {
                await createMatch(matchData, token);
                setSuccess('Match created successfully');
            }
            // Refresh matches list for this tournament
            fetchMatchesForTournament(selectedTournament.id);
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred');
        }
    };

    const handleDelete = async (matchId) => {
        if (window.confirm('Are you sure you want to delete this match?')) {
            try {
                await deleteMatch(matchId, token);
                setSuccess('Match deleted successfully');
                fetchMatchesForTournament(selectedTournament.id);
            } catch (err) {
                setError('Failed to delete match');
            }
        }
    };

    const resetForm = () => {
        setSelectedMatch(null);
        setFormData({
            player1Username: '',
            player2Username: '',
            refereeUsername: '',
            courtNumber: '',
            matchDate: '',
            matchTime: ''
        });
    };

    // Return to the tournaments list view
    const clearTournamentSelection = () => {
        setSelectedTournament(null);
        setMatches([]);
        resetForm();
    };

    if (loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Match Management</h1>
                {selectedTournament && (
                    <button className="button button-secondary" onClick={clearTournamentSelection}>
                        Back to Tournaments
                    </button>
                )}
            </div>

            {error && <div className="error-container">{error}</div>}
            {success && <div className="success-container">{success}</div>}

            {/* If no tournament is selected, display the tournaments list */}
            {!selectedTournament ? (
                <div className="dashboard-card">
                    <h3>Select a Tournament</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Tournament Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tournaments.map(tournament => (
                                <tr key={tournament.id}>
                                    <td>{tournament.name}</td>
                                    <td>{new Date(tournament.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(tournament.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="button button-primary"
                                            onClick={() => handleTournamentSelect(tournament)}
                                        >
                                            View Matches
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <>
                    {/* When a tournament is selected, show matches and the match form */}
                    <div className="dashboard-card">
                        <h3>Matches for {selectedTournament.name}</h3>
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>Players</th>
                                    <th>Referee</th>
                                    <th>Court</th>
                                    <th>Date & Time</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {matches.map(match => (
                                    <tr key={match.id}>
                                        <td>
                                            {match.player1Username} vs {match.player2Username}
                                        </td>
                                        <td>{match.refereeUsername}</td>
                                        <td>{match.courtNumber}</td>
                                        <td>{new Date(match.matchDateTime).toLocaleString()}</td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="button button-secondary"
                                                    onClick={() => {
                                                        setSelectedMatch(match);
                                                        const dt = new Date(match.matchDateTime);
                                                        setFormData({
                                                            player1Username: match.player1Username,
                                                            player2Username: match.player2Username,
                                                            refereeUsername: match.refereeUsername,
                                                            courtNumber: match.courtNumber,
                                                            matchDate: dt.toISOString().split('T')[0],
                                                            matchTime: dt.toTimeString().slice(0, 5)
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="button button-danger"
                                                    onClick={() => handleDelete(match.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="dashboard-card">
                        <h3>{selectedMatch ? 'Edit Match' : 'Create New Match'}</h3>
                        <form onSubmit={handleSubmit} className="match-form">
                            <div className="form-group">
                                <label htmlFor="player1Username">Player 1</label>
                                <select
                                    id="player1Username"
                                    name="player1Username"
                                    value={formData.player1Username}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Player 1</option>
                                    {users.filter(user => user.role === 'TENNIS_PLAYER').map(user => (
                                        <option key={user.username} value={user.username}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="player2Username">Player 2</label>
                                <select
                                    id="player2Username"
                                    name="player2Username"
                                    value={formData.player2Username}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Player 2</option>
                                    {users.filter(user => user.role === 'TENNIS_PLAYER').map(user => (
                                        <option key={user.username} value={user.username}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="refereeUsername">Referee</label>
                                <select
                                    id="refereeUsername"
                                    name="refereeUsername"
                                    value={formData.refereeUsername}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Referee</option>
                                    {users.filter(user => user.role === 'REFEREE').map(user => (
                                        <option key={user.username} value={user.username}>
                                            {user.username}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="courtNumber">Court Number</label>
                                <input
                                    type="number"
                                    id="courtNumber"
                                    name="courtNumber"
                                    value={formData.courtNumber}
                                    onChange={handleInputChange}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="matchDate">Match Date</label>
                                <input
                                    type="date"
                                    id="matchDate"
                                    name="matchDate"
                                    value={formData.matchDate}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="matchTime">Match Time</label>
                                <input
                                    type="time"
                                    id="matchTime"
                                    name="matchTime"
                                    value={formData.matchTime}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="button button-primary">
                                    {selectedMatch ? 'Update Match' : 'Create Match'}
                                </button>
                                {selectedMatch && (
                                    <button
                                        type="button"
                                        className="button button-secondary"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default MatchManagement;
