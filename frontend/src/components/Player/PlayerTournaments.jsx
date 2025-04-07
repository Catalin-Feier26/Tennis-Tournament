import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTournaments } from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Player.css';

const PlayerTournaments = () => {
    const [tournaments, setTournaments] = useState([]);
    const [error, setError] = useState('');
    const { token } = getCurrentUser();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getTournaments(token);
                setTournaments(data);
            } catch (err) {
                setError('Failed to load tournaments.');
            }
        };

        fetchData();
    }, [token]);

    return (
        <div className="dashboard-container">
            <h1>All Tournaments</h1>
            {error && <div className="error-container">{error}</div>}

            <div className="card-grid">
                {tournaments.map((tournament) => (
                    <div key={tournament.id} className="card">
                        <h3>{tournament.name}</h3>
                        <p><strong>Start:</strong> {new Date(tournament.startDate).toLocaleDateString()}</p>
                        <p><strong>End:</strong> {new Date(tournament.endDate).toLocaleDateString()}</p>
                        <button
                            onClick={() => navigate(`/player/view-matches/${tournament.id}`)}
                            className="button button-primary"
                        >
                            Matches
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlayerTournaments;
