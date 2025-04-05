import React, { useState, useEffect } from 'react';
import './Admin.css';

const MatchManagement = () => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exportFormat, setExportFormat] = useState('csv');

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const response = await fetch('http://localhost:9090/api/matches', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch matches');
            }

            const data = await response.json();
            setMatches(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const response = await fetch(`http://localhost:9090/api/matches/export?format=${exportFormat}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to export matches');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `matches.${exportFormat}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading matches...</div>;
    }

    return (
        <div className="admin-container">
            <h2>Match Management</h2>
            {error && <div className="error-message">{error}</div>}

            <div className="export-controls">
                <select 
                    value={exportFormat} 
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="export-select"
                >
                    <option value="csv">CSV</option>
                    <option value="txt">TXT</option>
                </select>
                <button onClick={handleExport} className="export-button">
                    Export Matches
                </button>
            </div>

            <div className="matches-list">
                <table>
                    <thead>
                        <tr>
                            <th>Tournament</th>
                            <th>Player 1</th>
                            <th>Player 2</th>
                            <th>Date</th>
                            <th>Court</th>
                            <th>Status</th>
                            <th>Winner</th>
                        </tr>
                    </thead>
                    <tbody>
                        {matches.map(match => (
                            <tr key={match.id}>
                                <td>{match.tournamentName}</td>
                                <td>{match.player1Name}</td>
                                <td>{match.player2Name}</td>
                                <td>{new Date(match.matchDate).toLocaleString()}</td>
                                <td>{match.court}</td>
                                <td>{match.status}</td>
                                <td>{match.winnerName || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MatchManagement; 