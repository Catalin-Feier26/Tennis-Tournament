import React, { useState, useEffect } from 'react';
import './Player.css';

const TournamentRegistration = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');

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
                const availableTournaments = data.filter(tournament =>
                    tournament.registrationDeadline && new Date(tournament.registrationDeadline) >= new Date(currentDate)
                );
                // Sort by registrationDeadline (closest first)
                availableTournaments.sort((a, b) => new Date(a.registrationDeadline) - new Date(b.registrationDeadline));
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
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`http://localhost:9090/api/registrations`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    playerUsername: username,
                    tournamentId: tournamentId
                })
            });

            if (response.ok) {
                // Read the response JSON so we can show its message if available
                const data = await response.json();
                // If the backend returned a message, use it; otherwise, use a default message.
                const message = data.message ? data.message : 'Successfully registered for the tournament!';
                setSuccess(message);
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

    const currentDate = new Date();

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
                        const deadlineDate = new Date(tournament.registrationDeadline);
                        const isExpired = deadlineDate < currentDate;
                        return (
                            <div key={tournament.id} className={`tournament-card ${isExpired ? 'expired' : ''}`}>
                                <h3>{tournament.name}</h3>
                                <div className="tournament-info">
                                    <p><strong>Start Date:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
                                    <p><strong>End Date:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                                    <p>
                                        <strong>Registration Deadline:</strong>{' '}
                                        {tournament.registrationDeadline ? new Date(tournament.registrationDeadline).toLocaleDateString() : 'N/A'}
                                    </p>
                                    <p><strong>Players:</strong> {tournament.currentParticipants}/{tournament.maxParticipants}</p>
                                    <button
                                        className="register-button"
                                        onClick={() => handleRegister(tournament.id)}
                                        disabled={
                                            tournament.currentParticipants >= tournament.maxParticipants ||
                                            tournament.isRegistered ||
                                            isExpired
                                        }
                                    >
                                        {tournament.isRegistered ? 'Already Registered' : isExpired ? 'Registration Closed' : 'Register'}
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
