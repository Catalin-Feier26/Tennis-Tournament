// Constants for user roles
export const ROLES = {
    ADMINISTRATOR: 'ADMINISTRATOR',
    REFEREE: 'REFEREE',
    TENNIS_PLAYER: 'TENNIS_PLAYER'
};

// Store user data in sessionStorage
export const setUserData = (data) => {
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('username', data.username);
    sessionStorage.setItem('role', data.role);
};

// Clear user data from sessionStorage
export const clearUserData = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('role');
};

// Get current user data
export const getCurrentUser = () => {
    return {
        token: sessionStorage.getItem('token') || '',
        role: sessionStorage.getItem('role') || '',
        username: sessionStorage.getItem('username') || ''
    };
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    return !!token;
};

// Check if user has specific role
export const hasRole = (role) => {
    const userRole = sessionStorage.getItem('role');
    return userRole === role;
};

// Role-based route protection
export const checkAccess = (allowedRoles) => {
    const userRole = sessionStorage.getItem('role');
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
