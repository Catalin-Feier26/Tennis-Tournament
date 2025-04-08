import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getTournaments,
    getMatchesByTournament,
    createMatch,
    updateMatch,
    deleteMatch,
    getAllUsers,
    getRegisteredPlayersByTournament
} from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Admin.css';

const MatchManagement = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [matches, setMatches] = useState([]);
    const [registeredPlayers, setRegisteredPlayers] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [selectedMatch, setSelectedMatch] = useState(null);

    // The admin only needs the basic form data (players, referee, court, date, time)
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

    useEffect(() => {
        fetchTournaments();
        fetchUsers();
        setLoading(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 1. Load Tournaments
    const fetchTournaments = async () => {
        try {
            const data = await getTournaments(token);
            // Sort by registration deadline if you wish
            data.sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline));
            setTournaments(data);
        } catch (err) {
            setError('Failed to load tournaments.');
        }
    };

    // 2. Load All Users (to pick referees)
    const fetchUsers = async () => {
        try {
            const data = await getAllUsers(token);
            setUsers(data);
        } catch (err) {
            setError('Failed to load users.');
        }
    };

    // 3. Load Matches for a chosen Tournament
    const fetchMatchesForTournament = async (tournamentId) => {
        try {
            const data = await getMatchesByTournament(tournamentId, token);
            setMatches(data);
        } catch (err) {
            setError('Failed to load matches for the selected tournament.');
        }
    };

    // 4. Load *registered* players for a chosen Tournament
    const fetchRegisteredPlayers = async (tournamentId) => {
        try {
            const data = await getRegisteredPlayersByTournament(tournamentId, token);
            setRegisteredPlayers(data);
        } catch (err) {
            setError('Failed to load registered players.');
        }
    };

    // Called when the admin selects a tournament row
    const handleTournamentSelect = (tournament) => {
        setSelectedTournament(tournament);
        fetchMatchesForTournament(tournament.id);
        fetchRegisteredPlayers(tournament.id);
        resetForm();
        setSelectedMatch(null);
    };

    // Basic input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    // Create or Update a match
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate
        if (
            !formData.player1Username ||
            !formData.player2Username ||
            !formData.refereeUsername ||
            !formData.courtNumber ||
            !formData.matchDate ||
            !formData.matchTime
        ) {
            setError('All fields are required.');
            return;
        }

        if (formData.player1Username === formData.player2Username) {
            setError('Players must be different.');
            return;
        }

        const matchData = {
            player1Username: formData.player1Username,
            player2Username: formData.player2Username,
            refereeUsername: formData.refereeUsername,
            courtNumber: parseInt(formData.courtNumber, 10),
            startDate: `${formData.matchDate}T${formData.matchTime}:00`,
            tournamentId: selectedTournament.id
        };

        try {
            if (selectedMatch) {
                // Note that we use selectedMatch.matchId now
                await updateMatch(selectedMatch.matchId, matchData, token);
                setSuccess('Match updated successfully.');
            } else {
                await createMatch(matchData, token);
                setSuccess('Match created successfully.');
            }
            // Refresh
            fetchMatchesForTournament(selectedTournament.id);
            resetForm();
        } catch (err) {
            setError(err.message || 'Failed to create/update match');
        }
    };

    // Delete match
    const handleDelete = async (matchId) => {
        if (window.confirm('Are you sure you want to delete this match?')) {
            try {
                await deleteMatch(matchId, token);
                setSuccess('Match deleted successfully.');
                fetchMatchesForTournament(selectedTournament.id);
            } catch (err) {
                setError('Failed to delete match');
            }
        }
    };

    // Reset form
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

    // Clear entire selection
    const clearTournamentSelection = () => {
        setSelectedTournament(null);
        setMatches([]);
        setRegisteredPlayers([]);
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
                    <button
                        className="button button-secondary"
                        onClick={clearTournamentSelection}
                    >
                        Back to Tournaments
                    </button>
                )}
            </div>

            {error && <div className="error-container">{error}</div>}
            {success && <div className="success-container">{success}</div>}

            {/* If no tournament is selected, display the list of tournaments */}
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
                            {tournaments.map((tournament) => (
                                <tr key={tournament.id}>
                                    <td>{tournament.name}</td>
                                    <td>
                                        {new Date(tournament.startDate).toLocaleDateString()}
                                    </td>
                                    <td>
                                        {new Date(tournament.endDate).toLocaleDateString()}
                                    </td>
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
                    {/* Display matches for the chosen tournament */}
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
                                {matches.map((match) => (
                                    <tr key={match.matchId}>
                                        <td>
                                            {match.player1Name} vs {match.player2Name}
                                        </td>
                                        <td>{match.refereeName}</td>
                                        <td>{match.courtNumber}</td>
                                        <td>
                                            {new Date(match.startDate).toLocaleString()}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="button button-secondary"
                                                    onClick={() => {
                                                        setSelectedMatch(match);
                                                        const dt = new Date(match.startDate);
                                                        setFormData({
                                                            player1Username:
                                                            match.player1Name,
                                                            player2Username:
                                                            match.player2Name,
                                                            refereeUsername:
                                                            match.refereeName,
                                                            courtNumber: match.courtNumber,
                                                            matchDate: dt
                                                                .toISOString()
                                                                .split('T')[0],
                                                            matchTime: dt
                                                                .toTimeString()
                                                                .slice(0, 5)
                                                        });
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="button button-danger"
                                                    onClick={() =>
                                                        handleDelete(match.matchId)
                                                    }
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

                    {/* Match creation/edit form */}
                    <div className="dashboard-card">
                        <h3>Create/Edit Match for {selectedTournament.name}</h3>
                        <form onSubmit={handleSubmit} className="match-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Player 1</label>
                                    <select
                                        name="player1Username"
                                        value={formData.player1Username}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Player 1</option>
                                        {registeredPlayers.map((player) => (
                                            <option key={player} value={player}>
                                                {player}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Player 2</label>
                                    <select
                                        name="player2Username"
                                        value={formData.player2Username}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Player 2</option>
                                        {registeredPlayers.map((player) => (
                                            <option key={player} value={player}>
                                                {player}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Referee</label>
                                    <select
                                        name="refereeUsername"
                                        value={formData.refereeUsername}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">Select Referee</option>
                                        {users
                                            .filter((user) => user.role === 'REFEREE')
                                            .map((user) => (
                                                <option
                                                    key={user.username}
                                                    value={user.username}
                                                >
                                                    {user.username}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Court Number</label>
                                    <input
                                        type="number"
                                        name="courtNumber"
                                        value={formData.courtNumber}
                                        onChange={handleInputChange}
                                        min="1"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Match Date</label>
                                    <input
                                        type="date"
                                        name="matchDate"
                                        value={formData.matchDate}
                                        onChange={handleInputChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Match Time</label>
                                    <input
                                        type="time"
                                        name="matchTime"
                                        value={formData.matchTime}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="button button-primary">
                                    {selectedMatch ? 'Update Match' : 'Create Match'}
                                </button>
                                <button
                                    type="button"
                                    className="button button-secondary"
                                    onClick={resetForm}
                                >
                                    Reset Form
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            )}
        </div>
    );
};

export default MatchManagement;
