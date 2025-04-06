// Constants for user roles
// utils/auth.js
export const ROLES = {
    ADMINISTRATOR: 'ADMINISTRATOR',
    REFEREE: 'REFEREE',
    TENNIS_PLAYER: 'TENNIS_PLAYER'
};

// Store user data in localStorage
export const setUserData = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
};

// Clear user data from localStorage
export const clearUserData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
};

// Get current user data
export const getCurrentUser = () => {
    return {
        token: localStorage.getItem('token') || '',
        role: localStorage.getItem('role') || '',
        username: localStorage.getItem('username') || ''
    };
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

// Check if user has specific role
export const hasRole = (role) => {
    const userRole = localStorage.getItem('role');
    return userRole === role;
};

// Role-based route protection
export const checkAccess = (allowedRoles) => {
    const userRole = localStorage.getItem('role');
    return allowedRoles.includes(userRole);
};

// Format validation error messages
export const getValidationMessage = (type) => {
    switch (type) {
        case 'required':
            return 'This field is required';
        case 'username':
            return 'Username must be 3-20 characters long and can only contain letters, numbers, and underscores';
        case 'password':
            return 'Password must be at least 6 characters long';
        case 'email':
            return 'Please enter a valid email address';
        default:
            return 'Invalid input';
    }
};

// Validate email format
export const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validate password strength
export const isValidPassword = (password) => {
    return password.length >= 6;
};

// Validate username format
export const isValidUsername = (username) => {
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}; 