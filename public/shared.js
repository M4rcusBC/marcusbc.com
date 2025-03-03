import {showSitemap} from "./sitemap.js";
import {handleRegistration, handleLogin, handleLogout, isUserLoggedIn, checkUsernameExists} from "./auth.js";

export function loadNav() {
    const body = document.body;
    const header = document.createElement("header");
    const nav = document.createElement("nav");

    // Add modal styles inline
    addModalStyles();

    // Logo
    const logo = document.createElement("h1");
    logo.className = "logo";
    logo.textContent = "Welcome to marcusbc.com";
    logo.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    // Navigation Links
    const navLinks = document.createElement("ul");
    navLinks.className = "nav-links";

    const links = ["Tools", "Projects", "Contact"];
    links.forEach((link) => {
        const li = document.createElement("li");
        li.textContent = link.toLowerCase();
        li.addEventListener("click", () => {
            window.location.href = `./${link.toLowerCase()}.html`;
        });
        navLinks.appendChild(li);
    });

    // Login link - changes based on auth state
    const loginLi = document.createElement("li");
    loginLi.style.position = "relative"; // Add position relative for the dropdown

    if (isUserLoggedIn()) {
        // User is logged in, show username
        const username = getCookie("username");
        loginLi.textContent = username || "account";
        loginLi.className = "user-account"; // Add class for styling

        // Make it look clickable
        loginLi.style.cursor = "pointer";

        // Add an indicator that this is a dropdown
        const indicator = document.createElement("span");
        indicator.innerHTML = " ▼"; // Down arrow
        indicator.style.fontSize = "0.8em";
        indicator.style.opacity = "0.7";
        loginLi.appendChild(indicator);

        loginLi.addEventListener("click", (e) => {
            e.stopPropagation();
            console.log("Account clicked - toggle dropdown");

            // Show a dropdown with logout option
            const existingDropdown = document.getElementById('user-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }

            const dropdown = document.createElement('div');
            dropdown.id = 'user-dropdown';
            dropdown.className = 'user-dropdown';

            // Fix positioning
            dropdown.style.position = "absolute";
            dropdown.style.top = "100%";
            dropdown.style.right = "0";
            dropdown.style.minWidth = "120px";
            dropdown.style.backgroundColor = "white";
            dropdown.style.border = "1px solid #ddd";
            dropdown.style.borderRadius = "5px";
            dropdown.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
            dropdown.style.zIndex = "1000"; // Ensure high z-index

            const logoutOption = document.createElement('div');
            logoutOption.className = 'dropdown-option';
            logoutOption.textContent = 'Logout';
            logoutOption.style.padding = "10px 15px";
            logoutOption.style.cursor = "pointer";

            logoutOption.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                console.log("Logout option clicked");
                handleLogout();
                window.location.reload();
            });

            // Hover effect
            logoutOption.addEventListener('mouseover', () => {
                logoutOption.style.backgroundColor = "#f5f5f5";
            });

            logoutOption.addEventListener('mouseout', () => {
                logoutOption.style.backgroundColor = "transparent";
            });

            dropdown.appendChild(logoutOption);
            loginLi.appendChild(dropdown);

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.remove();
            }, { once: true });
        });
    } else {
        // User is not logged in, show login option
        loginLi.textContent = "login";
        loginLi.addEventListener("click", () => {
            showAuthModal();
        });
    }
    navLinks.appendChild(loginLi);

    // Burger menu
    const burger = document.createElement("div");
    burger.className = "burger";
    for (let i = 0; i < 3; i++) {
        const line = document.createElement("div");
        line.className = "burger-line";
        burger.appendChild(line);
    }

    // Mobile backdrop for nav
    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "modal-backdrop";
    modalBackdrop.style.display = "none";

    burger.addEventListener("click", () => {
        navLinks.classList.toggle("nav-active");
        burger.classList.toggle("toggle");
        if (navLinks.classList.contains("nav-active") && window.innerWidth <= 768) {
            modalBackdrop.style.display = "block";
        } else {
            modalBackdrop.style.display = "none";
        }
    });

    modalBackdrop.addEventListener("click", () => {
        navLinks.classList.remove("nav-active");
        burger.classList.remove("toggle");
        modalBackdrop.style.display = "none";
    });

    nav.appendChild(logo);
    nav.appendChild(navLinks);
    nav.appendChild(burger);
    header.appendChild(nav);

    body.insertBefore(modalBackdrop, body.firstChild);
    body.insertBefore(header, body.firstChild);

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            modalBackdrop.style.display = "none";
        } else if (navLinks.classList.contains("nav-active")) {
            modalBackdrop.style.display = "block";
        }
    });

    // Create auth modal but keep it hidden
    createAuthModal();
}

export function loadFooter(parentElement) {
    const footer = document.createElement("footer");
    footer.className = "site-footer";

    const footerNav = document.createElement("nav");
    const footerLinks = [
        {
            name: "Source (GitHub)",
            link: "https://github.com/M4rcusBC/marcusbc.com",
            target: "_blank",
        },
        {name: "Sitemap", link: "./sitemap.html", target: "_self"},
        {name: "Privacy Policy", link: "./privacy-policy.html", target: "_self"},
    ];

    footerLinks.forEach((fl) => {
        const a = document.createElement("a");
        a.textContent = fl.name;
        if (fl.name !== "Sitemap") {
            a.href = fl.link;
        } else {
            a.style.cursor = "pointer";
            a.addEventListener("click", () => {
                showSitemap();
            });
        }
        a.target = fl.target;
        footerNav.appendChild(a);

        // Add icon for external links
        if (fl.target === "_blank") {
            a.textContent += " ";
            const icon = document.createElement("i");
            icon.className = "fa-solid fa-arrow-up-right-from-square";
            a.appendChild(icon);
        }
    });

    footer.appendChild(footerNav);

    const footerLegal = document.createElement("div");
    footerLegal.className = "footer-legal";
    footerLegal.textContent = "© 2025 Marcus Clements. All rights reserved.";
    footer.appendChild(footerLegal);

    parentElement.appendChild(footer);
}

// Add CSS styles directly to the document head
function addModalStyles() {
    if (document.getElementById('auth-modal-styles')) return;

    const styleEl = document.createElement('style');
    styleEl.id = 'auth-modal-styles';
    styleEl.textContent = `
        /* Auth Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
        }

        .modal-content {
            background-color: #fff;
            margin: 10% auto;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            width: 90%;
            max-width: 500px;
            position: relative;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
        }

        .close:hover {
            color: #333;
        }

        .auth-tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid #ddd;
        }

        .tab {
            padding: 10px 20px;
            cursor: pointer;
            margin-right: 5px;
            border-radius: 5px 5px 0 0;
            transition: background-color 0.2s;
        }

        .tab:hover {
            background-color: #f5f5f5;
        }

        .tab.active {
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            border-bottom: none;
            font-weight: bold;
        }

        .auth-form {
            display: none;
        }

        .auth-form.active {
            display: block;
        }

        .form-group {
            margin-bottom: 15px;
            position: relative;
        }

        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }

        .form-group input.valid-input {
            border-color: #4CAF50;
            background-color: #f8fff8;
        }

        .form-group input.invalid-input {
            border-color: #F44336;
            background-color: #fff8f8;
        }

        .validation-message {
            position: absolute;
            font-size: 12px;
            margin-top: 6px;
            margin-bottom: 6px;
            transition: all 0.2s;
        }

        .validation-message.error {
            color: #F44336;
        }

        .validation-message.success {
            color: #4CAF50;
        }

        .auth-button {
            display: block;
            width: 100%;
            padding: 12px;
            background-color: #4285F4;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.2s;
            margin-top: 2em;
        }

        .auth-button:hover {
            background-color: #3367D6;
        }

        .auth-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
        }

        .auth-button i {
            margin-right: 8px;
        }

        .status-message {
            margin-top: 15px;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
        }

        .status-message.info {
            background-color: #e3f2fd;
            color: #0d47a1;
        }

        .status-message.success {
            background-color: #e8f5e9;
            color: #1b5e20;
        }

        .status-message.error {
            background-color: #ffebee;
            color: #b71c1c;
        }

        /* User dropdown styles */
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            min-width: 120px;
            z-index: 100;
        }

        .dropdown-option {
            padding: 10px 15px;
            cursor: pointer;
        }

        .dropdown-option:hover {
            background-color: #f5f5f5;
        }
    `;

    document.head.appendChild(styleEl);
}

// Create the authentication modal
function createAuthModal() {
    // Check if modal already exists
    if (document.getElementById('auth-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'auth-modal';
    modal.className = 'modal';
    modal.style.display = 'none';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="auth-tabs">
                <div class="tab active" data-tab="login">Sign In</div>
                <div class="tab" data-tab="register">Register</div>
            </div>
            
            <div id="login-form" class="auth-form active">
                <h2>Sign In</h2>
                <div class="form-group">
                    <label for="login-username">Username</label>
                    <input type="text" id="login-username" placeholder="Enter your username">
                    <div id="login-validation" class="validation-message"></div>
                </div>
                <button id="login-button" class="auth-button">
                    <i class="fa-solid fa-key"></i> Continue with Passkey
                </button>
                <div id="login-status" class="status-message"></div>
            </div>
            
            <div id="register-form" class="auth-form">
                <h2>Register with a Passkey</h2>
                <div class="form-group">
                    <label for="register-username">Username</label>
                    <input type="text" id="register-username" placeholder="Choose a username">
                    <div id="register-validation" class="validation-message"></div>
                </div>
                <button id="register-button" class="auth-button">
                    <i class="fa-solid fa-key"></i> Register
                </button>
                <div id="register-status" class="status-message"></div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners for modal interactions
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Tab switching functionality
    const tabs = modal.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.getAttribute('data-tab');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update active form
            modal.querySelectorAll('.auth-form').forEach(form => {
                form.classList.remove('active');
            });
            modal.querySelector(`#${tabName}-form`).classList.add('active');
        });
    });

    // Setup username validation
    setupUsernameValidation();

    // Setup Enter key submission
    setupEnterKeySubmission();

    // Attach WebAuthn handlers
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', () => {
        attemptLogin();
    });

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', () => {
        attemptRegistration();
    });
}

// Setup real-time username validation
function setupUsernameValidation() {
    const loginUsernameInput = document.getElementById('login-username');
    const registerUsernameInput = document.getElementById('register-username');
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');

    // Add debounce function to avoid too many requests
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        }
    }

    // Login username validation
    loginUsernameInput.addEventListener('input', debounce(function() {
        const username = this.value.trim();
        const validationMsg = document.getElementById('login-validation');

        // Clear validation if empty
        if (!username) {
            validationMsg.textContent = '';
            this.classList.remove('valid-input', 'invalid-input');
            loginButton.disabled = true;
            return;
        }

        // Check if username exists
        checkUsernameExists(username)
            .then(exists => {
                if (exists) {
                    // Username exists, which is good for login
                    validationMsg.textContent = 'Username verified';
                    validationMsg.className = 'validation-message success';
                    this.classList.add('valid-input');
                    this.classList.remove('invalid-input');
                    loginButton.disabled = false;
                } else {
                    // Username doesn't exist, can't login
                    validationMsg.textContent = 'User does not exist';
                    validationMsg.className = 'validation-message error';
                    this.classList.add('invalid-input');
                    this.classList.remove('valid-input');
                    loginButton.disabled = true;
                }
            })
            .catch(error => {
                console.error('Username validation error:', error);
                validationMsg.textContent = 'Error checking username';
                validationMsg.className = 'validation-message error';
                loginButton.disabled = true;
            });
    }, 300));

    // Registration username validation
    registerUsernameInput.addEventListener('input', debounce(function() {
        const username = this.value.trim();
        const validationMsg = document.getElementById('register-validation');

        // Clear validation if empty
        if (!username) {
            validationMsg.textContent = '';
            this.classList.remove('valid-input', 'invalid-input');
            registerButton.disabled = true;
            return;
        }

        // Check if username exists
        checkUsernameExists(username)
            .then(exists => {
                if (exists) {
                    // Username exists, which is bad for registration
                    validationMsg.textContent = 'Username already taken';
                    validationMsg.className = 'validation-message error';
                    this.classList.add('invalid-input');
                    this.classList.remove('valid-input');
                    registerButton.disabled = true;
                } else {
                    // Username doesn't exist, can register
                    validationMsg.textContent = 'Username available';
                    validationMsg.className = 'validation-message success';
                    this.classList.add('valid-input');
                    this.classList.remove('invalid-input');
                    registerButton.disabled = false;
                }
            })
            .catch(error => {
                console.error('Username validation error:', error);
                validationMsg.textContent = 'Error checking username';
                validationMsg.className = 'validation-message error';
                registerButton.disabled = true;
            });
    }, 300));

    // Initial state
    loginButton.disabled = true;
    registerButton.disabled = true;
}

// Setup Enter key submission for both forms
function setupEnterKeySubmission() {
    const loginUsernameInput = document.getElementById('login-username');
    const registerUsernameInput = document.getElementById('register-username');

    loginUsernameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            attemptLogin();
        }
    });

    registerUsernameInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            attemptRegistration();
        }
    });
}

// Login helper function to reuse code
function attemptLogin() {
    const username = document.getElementById('login-username').value.trim();
    const statusElement = document.getElementById('login-status');

    if (!username) {
        statusElement.textContent = 'Please enter a username';
        statusElement.className = 'status-message error';
        return;
    }

    // Clear previous status messages
    statusElement.textContent = 'Authenticating...';
    statusElement.className = 'status-message info';

    // Call the login handler
    handleLogin(username);
}

// Registration helper function to reuse code
function attemptRegistration() {
    const username = document.getElementById('register-username').value.trim();
    const statusElement = document.getElementById('register-status');

    if (!username) {
        statusElement.textContent = 'Please enter a username';
        statusElement.className = 'status-message error';
        return;
    }

    // Clear previous status messages
    statusElement.textContent = 'Setting up your passkey...';
    statusElement.className = 'status-message info';

    // Call the registration handler
    handleRegistration(username);
}

// Function to show the authentication modal
export function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'block';
        // Focus the username field in the active tab
        const activeForm = modal.querySelector('.auth-form.active');
        if (activeForm) {
            const usernameInput = activeForm.querySelector('input[type="text"]');
            if (usernameInput) {
                usernameInput.focus();
            }
        }
    }
}

// Helper function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}