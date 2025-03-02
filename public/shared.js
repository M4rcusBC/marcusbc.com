import {showSitemap} from "./sitemap.js";
import {handleRegistration, handleLogin, handleLogout, isUserLoggedIn} from "./auth.js";

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
    if (isUserLoggedIn()) {
        // User is logged in, show username
        const username = getCookie("username");
        loginLi.textContent = username || "account";
        loginLi.addEventListener("click", (e) => {
            e.stopPropagation();

            // Show a dropdown with logout option
            const existingDropdown = document.getElementById('user-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }

            const dropdown = document.createElement('div');
            dropdown.id = 'user-dropdown';
            dropdown.className = 'user-dropdown';

            const logoutOption = document.createElement('div');
            logoutOption.className = 'dropdown-option';
            logoutOption.textContent = 'Logout';
            logoutOption.addEventListener('click', () => {
                handleLogout();
                window.location.reload();
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
            margin-top: 20px;
        }

        .auth-button:hover {
            background-color: #3367D6;
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
                <div class="tab" data-tab="register">Sign Up</div>
            </div>
            
            <div id="login-form" class="auth-form active">
                <h2>Sign In with Passkey</h2>
                <div class="form-group">
                    <label for="login-username">Username</label>
                    <input type="text" id="login-username" placeholder="Enter your username">
                </div>
                <button id="login-button" class="auth-button">
                    <i class="fa-solid fa-key"></i> Continue with Passkey
                </button>
                <div id="login-status" class="status-message"></div>
            </div>
            
            <div id="register-form" class="auth-form">
                <h2>Register with Passkey</h2>
                <div class="form-group">
                    <label for="register-username">Username</label>
                    <input type="text" id="register-username" placeholder="Choose a username">
                </div>
                <button id="register-button" class="auth-button">
                    <i class="fa-solid fa-key"></i> Register with Passkey
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

    // Attach WebAuthn handlers
    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', () => {
        const username = document.getElementById('login-username').value;
        if (!username) {
            document.getElementById('login-status').textContent = 'Please enter a username';
            return;
        }
        handleLogin(username);
    });

    const registerButton = document.getElementById('register-button');
    registerButton.addEventListener('click', () => {
        const username = document.getElementById('register-username').value;
        if (!username) {
            document.getElementById('register-status').textContent = 'Please enter a username';
            return;
        }
        handleRegistration(username);
    });
}

// Function to show the authentication modal
export function showAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Helper function to get cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}