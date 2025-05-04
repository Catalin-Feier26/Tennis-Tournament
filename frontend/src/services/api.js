import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const handleResponse = async (response) => {
    if (!response.ok) {
        if (response.status === 403) {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('role');
            sessionStorage.removeItem('username');
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

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
        return response.json();
    } else {
        return response.text();
    }
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

export const deleteUser = async (username, token) => {
    const response = await fetch(`${API_BASE_URL}/users/${username}`, {
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

export const getRefereeMatches = async (refereeUsername, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/referee/username/${refereeUsername}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};



export const updateMatchScore = async (matchId, scoreData, token) => {
    // scoreData should be like: { matchId: 1, sets: [{ player1Games: 6, player2Games: 4 }, ...] }
    const response = await fetch(`${API_BASE_URL}/matches/score`, {
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
    try {
        // matchData must include sets: [{ player1Games: x, player2Games: y }, ...]
        const response = await axios.post(`${API_BASE_URL}/matches`, matchData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to create match');
    }
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

export const deleteMatch = async (id, token) => {
    const res = await fetch(`${API_BASE_URL}/matches/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!res.ok) {
        const errorMessage = await res.text();
        const error = new Error(errorMessage || 'Failed to delete match');
        error.status = res.status;
        throw error;
    }

    return await res.text();
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
export const getMatchesByTournament = async (tournamentId, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/tournament/${tournamentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const exportMatches = async (token) => {
    const response = await fetch(`${API_BASE_URL}/matches/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return response.blob();
};
export const exportMatchesByTournament = async (tournamentId, token) => {
    const response = await fetch(`${API_BASE_URL}/matches/export/tournament/${tournamentId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to export matches.');
    }

    return await response.blob(); // returns the CSV as a Blob
};

export const getRegisteredPlayersByTournament = async (tournamentId, token) => {
    const response = await fetch(`${API_BASE_URL}/registrations/tournament/${tournamentId}/players`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const getRegistrationsByTournament = async (tournamentId, token) => {
    const response = await fetch(`${API_BASE_URL}/registrations/tournament/${tournamentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const getPendingRegistrationsByTournament = async (tournamentId, token) => {
    const response = await fetch(`${API_BASE_URL}/registrations/tournament/${tournamentId}/pending`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const approveRegistration = async (registrationId, token) => {
    const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const denyRegistration = async (registrationId, token) => {
    const response = await fetch(`${API_BASE_URL}/registrations/${registrationId}/deny`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const getUserNotifications = async (username, token) => {
    const response = await fetch(`${API_BASE_URL}/notifications/user/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const markNotificationAsRead = async (notificationId, token) => {
    const response = await fetch(`${API_BASE_URL}/notifications/mark-as-read/${notificationId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};
export const getTennisPlayers = async (token) => {
    const response = await fetch(`${API_BASE_URL}/users/role/TENNIS_PLAYER`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const searchPlayersByName = async (name, token) => {
    const response = await fetch(`${API_BASE_URL}/users/players/search?name=${name}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const getPlayersByRegistrationPeriod = async (startDate, endDate, token) => {
    const response = await fetch(`${API_BASE_URL}/users/players/registered?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

