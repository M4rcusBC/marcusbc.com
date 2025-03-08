// WebAuthn functionality for registration and login
import { startRegistration, startAuthentication } from 'https://cdn.jsdelivr.net/npm/@simplewebauthn/browser@7.1.0/dist/bundle/index.js';

// Session constants
const SESSION_COOKIE_NAME = 'authSession';
const USERNAME_COOKIE_NAME = 'username';
const SESSION_DURATION_DAYS = 7; // Cookie expiration time

// Handle WebAuthn registration
export async function handleRegistration(username, turnstileToken) {
    const statusElement = document.getElementById('register-status');

    try {
        statusElement.textContent = 'Starting registration...';
        statusElement.className = 'status-message info';

        // 1. Request registration options from the server
        const resp = await fetch('/webauthn/register/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                turnstileToken // Add the Turnstile token only in the first request
            }),
        });

        if (!resp.ok) {
            const error = await resp.json();
            throw new Error(error.error || 'Failed to get registration options');
        }

        // 2. Get options from server response
        const options = await resp.json();
        console.log('Received registration options:', options);

        // 3. Start the WebAuthn registration process in the browser
        statusElement.textContent = 'Please follow your device prompts to create passkey...';
        const attResp = await startRegistration(options);
        console.log('Registration response from browser:', attResp);

        // 4. Send the response to the server for verification
        statusElement.textContent = 'Verifying registration...';
        const verificationResp = await fetch('/webauthn/register/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                attResp
            }),
        });

        if (!verificationResp.ok) {
            const error = await verificationResp.json();
            throw new Error(error.error || 'Registration verification failed');
        }

        // 5. Registration successful!
        statusElement.textContent = 'Registration successful! You can now sign in.';
        statusElement.className = 'status-message success';

        // Reset Turnstile widget
        if (window.turnstile) {
            window.turnstile.reset('#register-turnstile');
        }

        // Switch to login tab after successful registration
        setTimeout(() => {
            const loginTab = document.querySelector('.tab[data-tab="login"]');
            if (loginTab) loginTab.click();

            // Pre-fill the login username field
            const loginUsernameField = document.getElementById('login-username');
            if (loginUsernameField) {
                loginUsernameField.value = username;
                loginUsernameField.dispatchEvent(new Event('input'));
            }
        }, 2000);

    } catch (error) {
        console.error('Registration error:', error);
        statusElement.textContent = `Registration failed: ${error.message}`;
        statusElement.className = 'status-message error';

        // Reset Turnstile widget on error
        if (window.turnstile) {
            window.turnstile.reset('#register-turnstile');
        }
    }
}

// Handle WebAuthn login
export async function handleLogin(username, turnstileToken) {
    const statusElement = document.getElementById('login-status');

    try {
        statusElement.textContent = 'Starting authentication...';
        statusElement.className = 'status-message info';

        // 1. Request authentication options from the server
        const resp = await fetch('/webauthn/login/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                turnstileToken // Only send token in first request
            }),
        });

        if (!resp.ok) {
            const error = await resp.json();
            throw new Error(error.error || 'Failed to get authentication options');
        }

        // 2. Get options from server response
        const options = await resp.json();
        console.log('Received authentication options:', options);

        // Check if we received valid options
        if (!options || Object.keys(options).length === 0) {
            throw new Error('Received empty authentication options from server');
        }

        if (!options.challenge) {
            throw new Error('Authentication options missing challenge');
        }

        // 3. Start the WebAuthn authentication process in the browser
        statusElement.textContent = 'Please follow your device prompts to verify your passkey...';
        const authResp = await startAuthentication(options);
        console.log('Authentication response from browser:', authResp);

        // 4. Send the response to the server for verification
        statusElement.textContent = 'Verifying login...';
        const verificationResp = await fetch('/webauthn/login/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                authResp
                // turnstileToken already verified
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

        // Reset Turnstile widget
        if (window.turnstile) {
            window.turnstile.reset('#login-turnstile');
        }

        // Store authentication session information
        setSessionCookies(username, result.sessionToken);

        // Refresh the page to update UI
        setTimeout(() => {
            window.location.reload();
        }, 1500);

    } catch (error) {
        console.error('Login error:', error);
        statusElement.textContent = `Login failed: ${error.message}`;
        statusElement.className = 'status-message error';

        // Reset Turnstile widget on error
        if (window.turnstile) {
            window.turnstile.reset('#login-turnstile');
        }
    }
}

// Session management functions
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

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

/**
 * Checks if a username exists in the system
 * @param {string} username - The username to check
 * @returns {Promise<boolean>} - Promise that resolves to true if username exists, false otherwise
 */
export async function checkUsernameExists(username) {
    if (!username || username.trim() === '') {
        return false;
    }

    try {
        const response = await fetch('/webauthn/check-username', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // Usernames standardized to lowercase for case-insensitive checks
            body: JSON.stringify({ username: username.trim().toLowerCase() }),
        });

        if (!response.ok) {
            console.error('Error checking username:', response.statusText);
            return false;
        }

        const data = await response.json();
        return data.exists;
    } catch (error) {
        console.error('Error checking if username exists:', error);
        return false;
    }
}
