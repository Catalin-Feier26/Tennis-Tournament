import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 403) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('username');
            window.location.href = '/login';
            throw new Error('Session expired. Please login again.');
        }
        let error;
        try {
            error = await response.json();
        } catch {
            error = { message: 'An error occurred' };
        }
        throw new Error(error.message || 'Something went wrong');
    }
    return response.json();
};


// Authentication API calls
export const login = async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
    });
    return handleResponse(response);
};

export const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

// User API calls
export const getAllUsers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const updateUser = async (userId, userData, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

export const deleteUser = async (userId, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

// Tournament API calls
export const getTournaments = async (token) => {
    const response = await fetch(`${API_BASE_URL}/tournaments`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const registerForTournament = async (tournamentId, token) => {
    const response = await fetch(`${API_BASE_URL}/tournaments/${tournamentId}/register`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

// Match API calls
export const getAllMatches = async (token) => {
    const response = await fetch(`${API_BASE_URL}/matches`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const getPlayerMatches = async (username, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/player/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const getRefereeMatches = async (token) => {
    const response = await fetch(`${API_BASE_URL}/matches/referee`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const updateMatchScore = async (matchId, scoreData, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}/score`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scoreData)
    });
    return handleResponse(response);
};

export const createMatch = async (matchData, token) => {
    const response = await fetch(`${API_BASE_URL}/matches`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(matchData)
    });
    return handleResponse(response);
};

export const updateMatch = async (matchId, matchData, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(matchData)
    });
    return handleResponse(response);
};

export const deleteMatch = async (matchId, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/${matchId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

// Admin API calls
export const createUser = async (userData, token) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
    });
    return handleResponse(response);
};

export const exportMatches = async (token) => {
    const response = await fetch(`${API_BASE_URL}/matches/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.blob();
}; 