// WebAuthn functionality for registration and login
import { startRegistration, startAuthentication } from 'https://cdn.jsdelivr.net/npm/@simplewebauthn/browser@latest/dist/bundle/index.js';

// Session constants
const SESSION_COOKIE_NAME = 'authSession';
const USERNAME_COOKIE_NAME = 'username';
const SESSION_DURATION_DAYS = 7; // Cookie expiration time

// Handle WebAuthn registration
export async function handleRegistration(username) {
    const statusElement = document.getElementById('register-status');

    try {
        statusElement.textContent = 'Starting registration...';
        statusElement.className = 'status-message info';

        // 1. Request registration options from the server
        const resp = await fetch('/webauthn/register/request', {  // <-- Fixed endpoint path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!resp.ok) {
            const error = await resp.json();
            throw new Error(error.error || 'Failed to get registration options');
        }

        // 2. Get options from server response
        const options = await resp.json();

        // 3. Start the WebAuthn registration process in the browser
        statusElement.textContent = 'Please follow your device prompts to create passkey...';
        const attResp = await startRegistration(options);

        // 4. Send the response to the server for verification
        statusElement.textContent = 'Verifying registration...';
        const verificationResp = await fetch('/webauthn/register/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                attResp,
            }),
        });

        if (!verificationResp.ok) {
            const error = await verificationResp.json();
            throw new Error(error.error || 'Registration verification failed');
        }

        // 5. Registration successful!
        statusElement.textContent = 'Registration successful! You can now sign in.';
        statusElement.className = 'status-message success';

        // Switch to login tab after successful registration
        setTimeout(() => {
            const loginTab = document.querySelector('.tab[data-tab="login"]');
            if (loginTab) loginTab.click();

            // Pre-fill the login username field
            const loginUsernameField = document.getElementById('login-username');
            if (loginUsernameField) loginUsernameField.value = username;
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        statusElement.textContent = `Registration failed: ${error.message}`;
        statusElement.className = 'status-message error';
    }
}

// Handle WebAuthn login
export async function handleLogin(username) {
    const statusElement = document.getElementById('login-status');

    try {
        statusElement.textContent = 'Starting authentication...';
        statusElement.className = 'status-message info';

        // 1. Request authentication options from the server
        const resp = await fetch('/webauthn/login/request', {  // <-- Fixed endpoint path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username }),
        });

        if (!resp.ok) {
            const error = await resp.json();
            throw new Error(error.error || 'Failed to get authentication options');
        }

        // 2. Get options from server response
        const options = await resp.json();

        // 3. Start the WebAuthn authentication process in the browser
        statusElement.textContent = 'Please follow your device prompts to verify your passkey...';
        const authResp = await startAuthentication(options);

        // 4. Send the response to the server for verification
        statusElement.textContent = 'Verifying login...';
        const verificationResp = await fetch('/webauthn/login/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                authResp,
            }),
        });

        if (!verificationResp.ok) {
            const error = await verificationResp.json();
            throw new Error(error.error || 'Authentication verification failed');
        }

        const result = await verificationResp.json();

        // 5. Login successful!
        statusElement.textContent = 'Login successful! Redirecting...';
        statusElement.className = 'status-message success';

        // Store authentication session information
        setSessionCookies(username, result.sessionToken || generateSessionToken());

        // Refresh the page to update UI
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        statusElement.textContent = `Login failed: ${error.message}`;
        statusElement.className = 'status-message error';
    }
}

// Rest of the functions remain the same
export function handleLogout() {
    clearSessionCookies();
}

export function isUserLoggedIn() {
    return !!getCookie(SESSION_COOKIE_NAME);
}

function setSessionCookies(username, sessionToken) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + SESSION_DURATION_DAYS);
    document.cookie = `${SESSION_COOKIE_NAME}=${sessionToken}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = `${USERNAME_COOKIE_NAME}=${username}; expires=${expirationDate.toUTCString()}; path=/; SameSite=Strict`;
}

function clearSessionCookies() {
    document.cookie = `${SESSION_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
    document.cookie = `${USERNAME_COOKIE_NAME}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict`;
}

function generateSessionToken() {
    return Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}