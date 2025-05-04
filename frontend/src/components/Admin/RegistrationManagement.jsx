import React, { useState, useEffect } from 'react';
import {
    getTournaments,
    getPendingRegistrationsByTournament,
    approveRegistration,
    denyRegistration
} from '../../services/api';
import { getCurrentUser } from '../../utils/auth';
import './Admin.css';

const RegistrationManagement = () => {
    const [tournaments, setTournaments] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [pendingRegistrations, setPendingRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { token } = getCurrentUser();

    useEffect(() => {
        fetchTournaments();
    }, []);

    const fetchTournaments = async () => {
        try {
            const data = await getTournaments(token);
            setTournaments(data);
        } catch (err) {
            setError('Failed to load tournaments.');
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingRegistrations = async (tournamentId) => {
        try {
            const data = await getPendingRegistrationsByTournament(tournamentId, token);
            setPendingRegistrations(data);
        } catch (err) {
            setError('Failed to load pending registrations.');
        }
    };

    const handleTournamentSelect = (tournament) => {
        setSelectedTournament(tournament);
        fetchPendingRegistrations(tournament.id);
    };

    const handleApprove = async (registrationId) => {
        try {
            await approveRegistration(registrationId, token);
            setSuccess('Registration approved.');
            fetchPendingRegistrations(selectedTournament.id);
        } catch (err) {
            setError('Failed to approve registration.');
        }
    };

    const handleDeny = async (registrationId) => {
        try {
            await denyRegistration(registrationId, token);
            setSuccess('Registration denied.');
            fetchPendingRegistrations(selectedTournament.id);
        } catch (err) {
            setError('Failed to deny registration.');
        }
    };

    const goBack = () => {
        setSelectedTournament(null);
        setPendingRegistrations([]);
        setError('');
        setSuccess('');
    };

    if (loading) return <div className="loading-container">Loading...</div>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 className="dashboard-title">Registration Management</h1>
                {selectedTournament && (
                    <button className="button button-secondary" onClick={goBack}>
                        Back to Tournaments
                    </button>
                )}
            </div>

            {error && <div className="error-container">{error}</div>}
            {success && <div className="success-container">{success}</div>}

            {!selectedTournament ? (
                <div className="dashboard-card">
                    <h3>Select a Tournament</h3>
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {tournaments.map((t) => (
                                <tr key={t.id}>
                                    <td>{t.name}</td>
                                    <td>{new Date(t.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(t.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <button
                                            className="button button-primary"
                                            onClick={() => handleTournamentSelect(t)}
                                        >
                                            View Pending
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="dashboard-card">
                    <h3>Pending Registrations for {selectedTournament.name}</h3>
                    <div className="table-container">
                        {pendingRegistrations.length === 0 ? (
                            <p>No pending registrations.</p>
                        ) : (
                            <table className="data-table">
                                <thead>
                                <tr>
                                    <th>Player</th>
                                    <th>Registration Date</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pendingRegistrations.map((reg) => (
                                    <tr key={reg.id || `${reg.playerName}-${reg.tournamentName}`}>
                                        <td>{reg.playerName}</td>
                                        <td>
                                            {new Date(reg.registrationDate).toLocaleString()}
                                        </td>
                                        <td>{reg.status}</td>
                                        <td>
                                            <button
                                                className="button button-success"
                                                onClick={() =>
                                                    handleApprove(reg.id)
                                                }
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="button button-danger"
                                                onClick={() =>
                                                    handleDeny(reg.id)
                                                }
                                            >
                                                Deny
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RegistrationManagement;
