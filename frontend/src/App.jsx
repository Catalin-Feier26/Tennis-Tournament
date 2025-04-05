import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navigation/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import TournamentRegistration from './components/Player/TournamentRegistration';
import PlayerSchedule from './components/Player/PlayerSchedule';
import PlayerScores from './components/Player/PlayerScores';
import RefereeSchedule from './components/Referee/RefereeSchedule';
import UpdateScore from './components/Referee/UpdateScore';
import UserManagement from './components/Admin/UserManagement';
import MatchManagement from './components/Admin/MatchManagement';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <main className="main-content">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Admin Routes */}
                        <Route path="/admin/users" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <UserManagement />
                            </ProtectedRoute>
                        } />
                        <Route path="/admin/matches" element={
                            <ProtectedRoute allowedRoles={['ADMIN']}>
                                <MatchManagement />
                            </ProtectedRoute>
                        } />

                        {/* Player Routes */}
                        <Route path="/player/tournaments" element={
                            <ProtectedRoute allowedRoles={['PLAYER']}>
                                <TournamentRegistration />
                            </ProtectedRoute>
                        } />
                        <Route path="/player/schedule" element={
                            <ProtectedRoute allowedRoles={['PLAYER']}>
                                <PlayerSchedule />
                            </ProtectedRoute>
                        } />
                        <Route path="/player/scores" element={
                            <ProtectedRoute allowedRoles={['PLAYER']}>
                                <PlayerScores />
                            </ProtectedRoute>
                        } />

                        {/* Referee Routes */}
                        <Route path="/referee/schedule" element={
                            <ProtectedRoute allowedRoles={['REFEREE']}>
                                <RefereeSchedule />
                            </ProtectedRoute>
                        } />
                        <Route path="/referee/scores/:matchId" element={
                            <ProtectedRoute allowedRoles={['REFEREE']}>
                                <UpdateScore />
                            </ProtectedRoute>
                        } />

                        {/* Default Route */}
                        <Route path="/" element={
                            <div className="home-container">
                                <h1>Welcome to Tennis Tournament</h1>
                                <p>Please login or register to access the tournament features.</p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
