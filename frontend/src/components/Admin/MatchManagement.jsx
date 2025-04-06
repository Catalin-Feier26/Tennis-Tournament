import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAllMatches, createMatch, updateMatch, deleteMatch, getAllUsers } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Admin.css';

const MatchManagement = () => {
    const [matches, setMatches] = useState([]);
    const [users, setUsers] = useState([]);
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
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const action = queryParams.get('action');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [matchesData, usersData] = await Promise.all([
                getAllMatches(token),
                getAllUsers(token)
            ]);
            setMatches(matchesData);
            setUsers(usersData);
        } catch (error) {
            setError('Failed to load data. Please try again later.');
        } finally {
            setLoading(false);
        }
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

        const matchData = {
            ...formData,
            matchDateTime: `${formData.matchDate}T${formData.matchTime}`
        };

        try {
            if (selectedMatch) {
                await updateMatch(selectedMatch.id, matchData, token);
                setSuccess('Match updated successfully');
            } else {
                await createMatch(matchData, token);
                setSuccess('Match created successfully');
            }
            fetchData();
            resetForm();
        } catch (error) {
            setError(error.response?.data?.message || 'An error occurred');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this match?')) {
            try {
                await deleteMatch(id, token);
                setSuccess('Match deleted successfully');
                fetchData();
            } catch (error) {
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
        navigate('/admin/matches');
    };

    const getPlayerOptions = () => {
        return users
            .filter(user => user.role === 'TENNIS_PLAYER')
            .map(user => (
                <option key={user.username} value={user.username}>
                    {user.username}
                </option>
            ));
    };

    const getRefereeOptions = () => {
        return users
            .filter(user => user.role === 'REFEREE')
            .map(user => (
                <option key={user.username} value={user.username}>
                    {user.username}
                </option>
            ));
    };

    if (loading) {
        return <div className="loading-container">Loading matches...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Match Management</h1>
            </div>

            {error && <div className="error-container">{error}</div>}
            {success && <div className="success-container">{success}</div>}

            <div className="dashboard-grid">
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
                                {getPlayerOptions()}
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
                                {getPlayerOptions()}
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
                                {getRefereeOptions()}
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

                <div className="dashboard-card">
                    <h3>Match List</h3>
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
                                        <td>
                                            {new Date(match.matchDateTime).toLocaleString()}
                                        </td>
                                        <td>
                                            <div className="table-actions">
                                                <button
                                                    className="button button-secondary"
                                                    onClick={() => {
                                                        setSelectedMatch(match);
                                                        const dateTime = new Date(match.matchDateTime);
                                                        setFormData({
                                                            player1Username: match.player1Username,
                                                            player2Username: match.player2Username,
                                                            refereeUsername: match.refereeUsername,
                                                            courtNumber: match.courtNumber,
                                                            matchDate: dateTime.toISOString().split('T')[0],
                                                            matchTime: dateTime.toTimeString().slice(0, 5)
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
            </div>
        </div>
    );
};

export default MatchManagement; 