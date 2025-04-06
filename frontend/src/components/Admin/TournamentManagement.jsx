import React, { useState, useEffect } from 'react';
import './Admin.css';

const TournamentManagement = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
        maxParticipants: 32
    });

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/tournaments', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch tournaments');
            const data = await response.json();
            setTournaments(data);
        } catch (err) {
            setError('Failed to load tournaments');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:9090/api/tournaments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to create tournament');

            setSuccess('Tournament created successfully');
            setFormData({
                name: '',
                startDate: '',
                endDate: '',
                registrationDeadline: '',
                maxParticipants: 32
            });
            fetchTournaments();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (tournamentId) => {
        if (!window.confirm('Are you sure you want to delete this tournament?')) return;

        try {
            const response = await fetch(`http://localhost:9090/api/tournaments/${tournamentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete tournament');

            setSuccess('Tournament deleted successfully');
            fetchTournaments();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-content">
                <h2>Tournament Management</h2>
                
                {/* Create Tournament Form */}
                <div className="create-form">
                    <h3>Create New Tournament</h3>
                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">Tournament Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="startDate">Start Date</label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="endDate">End Date</label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="registrationDeadline">Registration Deadline</label>
                            <input
                                type="date"
                                id="registrationDeadline"
                                name="registrationDeadline"
                                value={formData.registrationDeadline}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="maxParticipants">Maximum Participants</label>
                            <input
                                type="number"
                                id="maxParticipants"
                                name="maxParticipants"
                                value={formData.maxParticipants}
                                onChange={handleChange}
                                min="2"
                                max="128"
                                required
                            />
                        </div>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Tournament'}
                        </button>
                    </form>
                </div>

                {/* Tournament List */}
                <div className="tournament-list">
                    <h3>Existing Tournaments</h3>
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Registration Deadline</th>
                                    <th>Max Participants</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tournaments.map(tournament => (
                                    <tr key={tournament.id}>
                                        <td>{tournament.name}</td>
                                        <td>{new Date(tournament.startDate).toLocaleDateString()}</td>
                                        <td>{new Date(tournament.endDate).toLocaleDateString()}</td>
                                        <td>{new Date(tournament.registrationDeadline).toLocaleDateString()}</td>
                                        <td>{tournament.maxParticipants}</td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(tournament.id)}
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>
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

export default TournamentManagement; 