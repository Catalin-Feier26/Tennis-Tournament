import React, { useState, useEffect } from 'react';
import {
    getTennisPlayers,
    searchPlayersByName,
} from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Referee.css';

const PlayerManagement = () => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const { token } = getCurrentUser();
    const [searchTimeout, setSearchTimeout] = useState(null);

    useEffect(() => {
        fetchAllPlayers();
    }, []);

    useEffect(() => {
        if (nameFilter === '') {
            fetchAllPlayers();
            return;
        }

        if (searchTimeout) clearTimeout(searchTimeout);

        const timeout = setTimeout(() => {
            handleNameSearch();
        }, 2000);

        setSearchTimeout(timeout);

        return () => clearTimeout(timeout);
    }, [nameFilter]);

    const fetchAllPlayers = async () => {
        try {
            const data = await getTennisPlayers(token);
            setPlayers(data);
            setError('');
        } catch (err) {
            setError('Failed to load players.');
        } finally {
            setLoading(false);
        }
    };

    const handleNameSearch = async () => {
        try {
            const data = await searchPlayersByName(nameFilter, token);
            setPlayers(data);
            setError('');
        } catch (err) {
            setError('Failed to search players by name.');
        }
    };

    if (loading) return <div className="loading-container">Loading players...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Filter Tennis Players</h1>
            </div>

            {error && <div className="error-container">{error}</div>}

            <div className="schedule-filters">
                <input
                    type="text"
                    placeholder="Search by name"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <button className="button button-secondary" onClick={fetchAllPlayers}>
                    Reset
                </button>
            </div>

            <div className="table-container">
                <table className="data-table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Name</th>
                        <th>Role</th>
                    </tr>
                    </thead>
                    <tbody>
                    {players.map((player) => (
                        <tr key={player.username}>
                            <td>{player.username}</td>
                            <td>{player.name}</td>
                            <td>{player.role}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PlayerManagement;
