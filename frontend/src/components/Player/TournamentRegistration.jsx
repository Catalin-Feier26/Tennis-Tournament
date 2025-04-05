import React, { useState, useEffect } from 'react';
import './Player.css';

const TournamentRegistration = () => {
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/tournaments', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch tournaments');
            }

            const data = await response.json();
            setTournaments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (tournamentId) => {
        try {
            const response = await fetch('http://localhost:9090/api/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    tournamentId: tournamentId,
                    playerId: localStorage.getItem('userId') // You'll need to store userId during login
                })
            });

            if (!response.ok) {
                throw new Error('Failed to register for tournament');
            }

            setSuccess('Successfully registered for tournament');
            fetchTournaments(); // Refresh the list
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading tournaments...</div>;
    }

    return (
        <div className="player-container">
            <h2>Tournament Registration</h2>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="tournaments-list">
                {tournaments.map(tournament => (
                    <div key={tournament.id} className="tournament-card">
                        <h3>{tournament.name}</h3>
                        <p>Start Date: {new Date(tournament.startDate).toLocaleDateString()}</p>
                        <p>End Date: {new Date(tournament.endDate).toLocaleDateString()}</p>
                        <p>Location: {tournament.location}</p>
                        <p>Status: {tournament.status}</p>
                        <button 
                            onClick={() => handleRegister(tournament.id)}
                            disabled={tournament.status !== 'OPEN'}
                        >
                            Register
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TournamentRegistration; 