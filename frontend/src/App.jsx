import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, hasRole, ROLES } from './utils/auth';

// Auth components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';

// Shared components
import Navbar from './components/Shared/Navbar';

// Profile component
import EditProfile from './components/Profile/EditProfile';

// Player components
import PlayerDashboard from './components/Player/PlayerDashboard';
import TournamentRegistration from './components/Player/TournamentRegistration';
import PlayerSchedule from './components/Player/PlayerSchedule';
import PlayerScores from './components/Player/PlayerScores';

// Referee components
import RefereeDashboard from './components/Referee/RefereeDashboard';
import RefereeSchedule from './components/Referee/RefereeSchedule';
import UpdateScore from './components/Referee/UpdateScore';

// Admin components
import AdminDashboard from './components/Admin/AdminDashboard';
import UserManagement from './components/Admin/UserManagement';
import MatchManagement from './components/Admin/MatchManagement';
import TournamentManagement from './components/Admin/TournamentManagement'; // <-- Import TournamentManagement

// Protected Route component
const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" />;
    }
    if (allowedRoles && !allowedRoles.some(role => hasRole(role))) {
        return <Navigate to="/" />;
    }
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

const App = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Profile route */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <EditProfile />
                    </ProtectedRoute>
                }
            />

            {/* Player routes */}
            <Route
                path="/player/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.TENNIS_PLAYER]}>
                        <PlayerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/player/tournaments"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.TENNIS_PLAYER]}>
                        <TournamentRegistration />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/player/schedule"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.TENNIS_PLAYER]}>
                        <PlayerSchedule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/player/scores"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.TENNIS_PLAYER]}>
                        <PlayerScores />
                    </ProtectedRoute>
                }
            />

            {/* Referee routes */}
            <Route
                path="/referee/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.REFEREE]}>
                        <RefereeDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/referee/schedule"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.REFEREE]}>
                        <RefereeSchedule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/referee/matches"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.REFEREE]}>
                        <UpdateScore />
                    </ProtectedRoute>
                }
            />

            {/* Admin routes */}
            <Route
                path="/admin/dashboard"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
                        <UserManagement />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/matches"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
                        <MatchManagement />
                    </ProtectedRoute>
                }
            />
            {/* New Admin Tournament Management route */}
            <Route
                path="/admin/tournaments"
                element={
                    <ProtectedRoute allowedRoles={[ROLES.ADMINISTRATOR]}>
                        <TournamentManagement />
                    </ProtectedRoute>
                }
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;
