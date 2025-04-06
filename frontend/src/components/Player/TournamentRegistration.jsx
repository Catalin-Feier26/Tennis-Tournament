import React, { useState, useEffect } from 'react';
import './Player.css';

const TournamentRegistration = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

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

            if (response.ok) {
                const data = await response.json();
                const currentDate = new Date().toISOString().split('T')[0];
                // Optionally filter tournaments based on registrationDeadline instead of endDate
                const availableTournaments = data.filter(tournament =>
                    tournament.registrationDeadline && new Date(tournament.registrationDeadline) >= new Date(currentDate)
                );
                setTournaments(availableTournaments);
            } else if (response.status === 403) {
                setError('Access denied. Please log in again.');
                window.location.href = '/login';
            } else {
                throw new Error('Failed to fetch tournaments');
            }
        } catch (err) {
            setError('Failed to load tournaments');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (tournamentId) => {
        try {
            const response = await fetch(`http://localhost:9090/api/tournaments/${tournamentId}/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: username })
            });

            if (response.ok) {
                setSuccess('Successfully registered for the tournament!');
                fetchTournaments();
            } else if (response.status === 403) {
                setError('Access denied. Please log in again.');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to register for tournament');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading tournaments...</div>;
    }

    return (
        <div className="player-container">
            <h2>Available Tournaments</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            {tournaments.length === 0 ? (
                <p>No tournaments available for registration.</p>
            ) : (
                <div className="tournaments-grid">
                    {tournaments.map(tournament => {
                        const isRegistrationClosed = tournament.registrationDeadline ? new Date(tournament.registrationDeadline) < new Date() : false;
                        return (
                            <div key={tournament.name} className="tournament-card">
                                <h3>{tournament.name}</h3>
                                <div className="tournament-info">
                                    <p><strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                                    <p>
                                        <strong>Registration Deadline:</strong> {tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p><strong>Players:</strong> {tournament.currentParticipants}/{tournament.maxParticipants}</p>
                                    <button
                                        className="register-button"
                                        onClick={() => handleRegister(tournament.id)}
                                        disabled={tournament.currentParticipants >= tournament.maxParticipants || tournament.isRegistered || isRegistrationClosed}
                                    >
                                        {tournament.isRegistered ? 'Already Registered' : isRegistrationClosed ? 'Registration Closed' : 'Register'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default TournamentRegistration;
