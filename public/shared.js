import { showSitemap } from "./sitemap.js";
import {
  handleRegistration,
  handleLogin,
  handleLogout,
  isUserLoggedIn,
  checkUsernameExists,
} from "./auth.js";

// Helper function to load the Turnstile script
function loadTurnstileScript() {
  return new Promise((resolve) => {
    if (document.querySelector('script[src*="turnstile"]')) {
      // Script already loaded
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = resolve;
  });
}

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
      const existingDropdown = document.getElementById("user-dropdown");
      if (existingDropdown) {
        existingDropdown.remove();
        return;
      }

      const dropdown = document.createElement("div");
      dropdown.id = "user-dropdown";
      dropdown.className = "user-dropdown";

      // Fix positioning
      dropdown.style.position = "absolute";
      dropdown.style.top = "100%";
      dropdown.style.right = "0";
      dropdown.style.minWidth = "120px";
      dropdown.style.backgroundColor = "var(--color-background, white)";
      dropdown.style.border = "1px solid #ddd";
      dropdown.style.borderRadius = "var(--rounded, 5px)";
      dropdown.style.boxShadow = "var(--shadow, 0 2px 10px rgba(0, 0, 0, 0.1))";
      dropdown.style.zIndex = "1000";

      const logoutOption = document.createElement("div");
      logoutOption.className = "dropdown-option";
      logoutOption.textContent = "Logout";
      logoutOption.style.padding = "10px 15px";
      logoutOption.style.cursor = "pointer";

      logoutOption.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent event bubbling
        console.log("Logout option clicked");
        handleLogout();
        window.location.reload();
      });

      // Hover effect
      logoutOption.addEventListener("mouseover", () => {
        logoutOption.style.backgroundColor = "#f5f5f5";
      });

      logoutOption.addEventListener("mouseout", () => {
        logoutOption.style.backgroundColor = "transparent";
      });

      dropdown.appendChild(logoutOption);
      loginLi.appendChild(dropdown);

      // Close dropdown when clicking outside
      document.addEventListener(
        "click",
        () => {
          dropdown.remove();
        },
        { once: true }
      );
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

  // Load the Turnstile script ahead of time
  loadTurnstileScript().then(() => {
    console.log("Turnstile script loaded");
  });
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
    { name: "Sitemap", link: "./sitemap.html", target: "_self" },
    { name: "Privacy Policy", link: "./privacy-policy.html", target: "_self" },
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

function addModalStyles() {
  if (document.getElementById("auth-modal-styles")) return;

  const styleEl = document.createElement("style");
  styleEl.id = "auth-modal-styles";
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
            background-color: var(--color-white, #fff);
            margin: 10% auto;
            padding: var(--space-xl, 25px);
            border-radius: var(--border-radius-lg, 10px);
            box-shadow: var(--shadow-lg, 0 5px 15px rgba(0, 0, 0, 0.3));
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
            transition: var(--transition-fast, all 0.2s ease);
        }

        .close:hover {
            color: var(--color-text, #333);
        }

        .auth-tabs {
            display: flex;
            margin-bottom: var(--space-lg, 20px);
            border-bottom: 1px solid #ddd;
        }

        .tab {
            padding: var(--space-md, 10px) var(--space-lg, 20px);
            cursor: pointer;
            margin-right: var(--space-sm, 5px);
            border-radius: var(--border-radius, 5px) var(--border-radius, 5px) 0 0;
            transition: var(--transition-fast, background-color 0.2s);
        }

        .tab:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .tab.active {
            background-color: rgba(0, 0, 0, 0.05);
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
            margin-bottom: var(--space-lg, 15px);
            position: relative;
        }

        .form-group label {
            display: block;
            margin-bottom: var(--space-sm, 5px);
            font-weight: 500;
        }

        .form-group input {
            width: 100%;
            padding: var(--space-md, 10px);
            border: 1px solid #ddd;
            border-radius: var(--border-radius, 5px);
            font-size: var(--font-size, 16px);
            transition: var(--transition-fast, all 0.2s ease);
        }

        .form-group input:focus {
            outline: none;
            border-color: var(--color-primary);
            box-shadow: 0 0 0 2px rgba(92, 114, 133, 0.2);
        }

        .form-group input.valid-input {
            border-color: var(--color-success, #4CAF50);
            background-color: rgba(76, 175, 80, 0.05);
        }

        .form-group input.invalid-input {
            border-color: var(--color-error, #F44336);
            background-color: rgba(244, 67, 54, 0.05);
        }

        .validation-message {
            position: absolute;
            font-size: var(--font-size-sm, 12px);
            margin-top: 6px;
            margin-bottom: 6px;
            transition: var(--transition-fast, all 0.2s);
        }

        .validation-message.error {
            color: var(--color-error, #F44336);
        }

        .validation-message.success {
            color: var(--color-success, #4CAF50);
        }

        .auth-button {
            display: block;
            width: 100%;
            padding: var(--space-md, 12px);
            background-color: var(--color-primary, #4285F4);
            color: var(--color-white, white);
            border: none;
            border-radius: var(--border-radius, 5px);
            font-size: var(--font-size, 16px);
            cursor: pointer;
            transition: var(--transition-fast, background-color 0.2s);
            margin-top: var(--space-sm, 0.5em);
        }

        .auth-button:hover {
            background-color: var(--color-secondary, #3367D6);
            transform: translateY(-2px);
        }

        .auth-button:disabled {
            background-color: #cccccc;
            cursor: not-allowed;
            transform: none;
        }

        .auth-button i {
            margin-right: 8px;
        }

        .status-message {
            margin-top: var(--space-lg, 15px);
            padding: var(--space-md, 10px);
            border-radius: var(--border-radius, 5px);
            text-align: center;
        }

        .status-message.info {
            background-color: rgba(33, 150, 243, 0.1);
            color: #0d47a1;
        }

        .status-message.success {
            background-color: rgba(76, 175, 80, 0.1);
            color: #1b5e20;
        }

        .status-message.error {
            background-color: rgba(244, 67, 54, 0.1);
            color: #b71c1c;
        }

        /* User dropdown styles */
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background-color: var(--color-white, white);
            border: 1px solid #ddd;
            border-radius: var(--border-radius, 5px);
            box-shadow: var(--shadow-md, 0 2px 10px rgba(0, 0, 0, 0.1));
            min-width: 120px;
            z-index: 100;
        }

        .dropdown-option {
            padding: var(--space-md, 10px) var(--space-lg, 15px);
            cursor: pointer;
        }

        .dropdown-option:hover {
            background-color: var(--color-background, #f5f5f5);
        }
        
        /* Turnstile container styles */
        .turnstile-container {
            margin: var(--space-xl, 2em) 0 var(--space-md, 1em) 0;
            display: flex;
            justify-content: center;
        }
    `;

  document.head.appendChild(styleEl);
}

// Create the authentication modal
function createAuthModal() {
  // Check if modal already exists
  if (document.getElementById("auth-modal")) return;

  const modal = document.createElement("div");
  modal.id = "auth-modal";
  modal.className = "modal";
  modal.style.display = "none";

  modal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <div class="auth-tabs">
                <div class="tab active" data-tab="login">Sign In</div>
                <div class="tab" data-tab="register">Register</div>
            </div>
            
            <div id="login-form" class="auth-form active">
                <h2>Sign In with a Passkey</h2>
                <div class="form-group">
                    <label for="login-username">Username</label>
                    <input type="text" id="login-username" placeholder="Enter your username">
                    <div id="login-validation" class="validation-message"></div>
                </div>
                <div id="login-turnstile" class="turnstile-container"></div>
                <button id="login-button" class="auth-button">
                    <i class="fa-solid fa-key"></i> Continue
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
                <div id="register-turnstile" class="turnstile-container"></div>
                <button id="register-button" class="auth-button">
                    <i class="fa-solid fa-key"></i> Register
                </button>
                <div id="register-status" class="status-message"></div>
            </div>
        </div>
    `;

  document.body.appendChild(modal);

  // Add event listeners for modal interactions
  const closeBtn = modal.querySelector(".close");
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
  });

  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Tab switching functionality
  const tabs = modal.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.getAttribute("data-tab");

      // Update active tab
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      // Update active form
      modal.querySelectorAll(".auth-form").forEach((form) => {
        form.classList.remove("active");
      });
      modal.querySelector(`#${tabName}-form`).classList.add("active");

      // Render Turnstile for the active tab
      renderTurnstile(tabName);
    });
  });

  // Setup username validation
  setupUsernameValidation();

  // Setup Enter key submission
  setupEnterKeySubmission();

  // Attach WebAuthn handlers
  const loginButton = document.getElementById("login-button");
  loginButton.addEventListener("click", () => {
    attemptLogin();
  });

  const registerButton = document.getElementById("register-button");
  registerButton.addEventListener("click", () => {
    attemptRegistration();
  });
}

// Function to render Turnstile widgets when needed
function renderTurnstile(formType = "login") {
  // Check if Turnstile is loaded
  if (window.turnstile) {
    // Clear any existing Turnstile widgets
    const containerId = `${formType}-turnstile`;
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear the container
    container.innerHTML = "";

    // Render the Turnstile widget with explicit size and appearance settings
    window.turnstile.render(`#${containerId}`, {
      sitekey: "0x4AAAAAAA_KLLp_bz0X7eE3",
      theme: "light",
      size: "normal",
      callback: function (token) {
        console.log(
          `Turnstile token received for ${formType}: ${token.substring(
            0,
            15
          )}...`
        );

        // Store the token directly on the form and as a data attribute
        const form = document.getElementById(`${formType}-form`);

        // Create/update hidden input for form submission
        let tokenInput = form.querySelector('input[name="turnstile-token"]');
        if (!tokenInput) {
          tokenInput = document.createElement("input");
          tokenInput.type = "hidden";
          tokenInput.name = "turnstile-token";
          form.appendChild(tokenInput);
        }
        tokenInput.value = token;

        // Also store as data attribute as backup
        form.dataset.turnstileToken = token;

        // Enable the submit button if username is valid
        const button = document.getElementById(`${formType}-button`);
        const usernameInput = document.getElementById(`${formType}-username`);
        const isValidUsername = usernameInput.classList.contains("valid-input");

        if (isValidUsername) {
          button.disabled = false;
        }
      },
      "error-callback": function () {
        console.error(`Turnstile encountered an error on ${formType} form`);
        const button = document.getElementById(`${formType}-button`);
        button.disabled = true;
      },
    });
  }
}

// Setup real-time username validation
function setupUsernameValidation() {
  const loginUsernameInput = document.getElementById("login-username");
  const registerUsernameInput = document.getElementById("register-username");
  const loginButton = document.getElementById("login-button");
  const registerButton = document.getElementById("register-button");

  // Add debounce function to avoid too many requests
  function debounce(func, delay) {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  // Login username validation
  loginUsernameInput.addEventListener(
    "input",
    debounce(function () {
      const username = this.value.trim();
      const validationMsg = document.getElementById("login-validation");

      // Clear validation if empty
      if (!username) {
        validationMsg.textContent = "";
        this.classList.remove("valid-input", "invalid-input");
        loginButton.disabled = true;
        return;
      }

      // Check if username exists
      checkUsernameExists(username)
        .then((exists) => {
          if (exists) {
            // Username exists, which is good for login
            validationMsg.textContent = "Username verified";
            validationMsg.className = "validation-message success";
            this.classList.add("valid-input");
            this.classList.remove("invalid-input");

            // Enable button only if Turnstile is completed
            const turnstileResponse = document.querySelector(
              '#login-form input[name="cf-turnstile-response"]'
            );
            loginButton.disabled = !turnstileResponse;
          } else {
            // Username doesn't exist, can't login
            validationMsg.textContent = "User does not exist";
            validationMsg.className = "validation-message error";
            this.classList.add("invalid-input");
            this.classList.remove("valid-input");
            loginButton.disabled = true;
          }
        })
        .catch((error) => {
          console.error("Username validation error:", error);
          validationMsg.textContent = "Error checking username";
          validationMsg.className = "validation-message error";
          loginButton.disabled = true;
        });
    }, 300)
  );

  // Registration username validation
  registerUsernameInput.addEventListener(
    "input",
    debounce(function () {
      const username = this.value.trim();
      const validationMsg = document.getElementById("register-validation");

      // Clear validation if empty
      if (!username) {
        validationMsg.textContent = "";
        this.classList.remove("valid-input", "invalid-input");
        registerButton.disabled = true;
        return;
      }

      // Check if username exists
      checkUsernameExists(username)
        .then((exists) => {
          if (exists) {
            // Username exists, which is bad for registration
            validationMsg.textContent = "Username already taken";
            validationMsg.className = "validation-message error";
            this.classList.add("invalid-input");
            this.classList.remove("valid-input");
            registerButton.disabled = true;
          } else {
            // Username doesn't exist, can register
            validationMsg.textContent = "Username available";
            validationMsg.className = "validation-message success";
            this.classList.add("valid-input");
            this.classList.remove("invalid-input");

            // Enable button only if Turnstile is completed
            const turnstileResponse = document.querySelector(
              '#register-form input[name="cf-turnstile-response"]'
            );
            registerButton.disabled = !turnstileResponse;
          }
        })
        .catch((error) => {
          console.error("Username validation error:", error);
          validationMsg.textContent = "Error checking username";
          validationMsg.className = "validation-message error";
          registerButton.disabled = true;
        });
    }, 300)
  );

  // Initial state
  loginButton.disabled = true;
  registerButton.disabled = true;
}

// Setup Enter key submission for both forms
function setupEnterKeySubmission() {
  const loginUsernameInput = document.getElementById("login-username");
  const registerUsernameInput = document.getElementById("register-username");

  loginUsernameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      attemptLogin();
    }
  });

  registerUsernameInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      attemptRegistration();
    }
  });
}

// Login helper function to reuse code
function attemptLogin() {
  const username = document.getElementById("login-username").value.trim();
  const statusElement = document.getElementById("login-status");
  const form = document.getElementById("login-form");

  // Get the turnstile token with fallbacks
  let turnstileToken = null;
  const tokenInput = form.querySelector('input[name="turnstile-token"]');

  if (tokenInput && tokenInput.value) {
    turnstileToken = tokenInput.value;
  } else if (form.dataset.turnstileToken) {
    turnstileToken = form.dataset.turnstileToken;
  }

  console.log("Login - Turnstile token available:", !!turnstileToken);

  if (!username) {
    statusElement.textContent = "Please enter a username";
    statusElement.className = "status-message error";
    return;
  }

  if (!turnstileToken) {
    statusElement.textContent = "Please complete the security challenge";
    statusElement.className = "status-message error";

    // Reset the Turnstile widget to give user another chance
    if (window.turnstile) {
      window.turnstile.reset("#login-turnstile");
    }
    return;
  }

  // Clear previous status messages
  statusElement.textContent = "Authenticating...";
  statusElement.className = "status-message info";

  // Call the login handler with the turnstile token
  handleLogin(username, turnstileToken);
}

// Registration helper function to reuse code
function attemptRegistration() {
  const username = document.getElementById("register-username").value.trim();
  const statusElement = document.getElementById("register-status");
  const form = document.getElementById("register-form");

  // Get the turnstile token with fallbacks
  let turnstileToken = null;
  const tokenInput = form.querySelector('input[name="turnstile-token"]');

  if (tokenInput && tokenInput.value) {
    turnstileToken = tokenInput.value;
  } else if (form.dataset.turnstileToken) {
    turnstileToken = form.dataset.turnstileToken;
  }

  console.log("Registration - Turnstile token available:", !!turnstileToken);

  if (!username) {
    statusElement.textContent = "Please enter a username";
    statusElement.className = "status-message error";
    return;
  }

  if (!turnstileToken) {
    statusElement.textContent = "Please complete the security challenge";
    statusElement.className = "status-message error";

    // Reset the Turnstile widget to give user another chance
    if (window.turnstile) {
      window.turnstile.reset("#register-turnstile");
    }
    return;
  }

  // Clear previous status messages
  statusElement.textContent = "Setting up your passkey...";
  statusElement.className = "status-message info";

  // Call the registration handler with the turnstile token
  handleRegistration(username, turnstileToken);
}

// Function to show the authentication modal
export function showAuthModal() {
  const modal = document.getElementById("auth-modal");
  if (modal) {
    modal.style.display = "block";

    // Load Turnstile script if not already loaded
    loadTurnstileScript().then(() => {
      // Determine which tab is active
      const activeTab = modal.querySelector(".tab.active");
      const activeTabName = activeTab
        ? activeTab.getAttribute("data-tab")
        : "login";

      // Render the Turnstile for the active tab
      renderTurnstile(activeTabName);

      // Focus the username field in the active tab
      const activeForm = modal.querySelector(".auth-form.active");
      if (activeForm) {
        const usernameInput = activeForm.querySelector('input[type="text"]');
        if (usernameInput) {
          usernameInput.focus();
        }
      }
    });
  }
}

// Helper function to get cookie value by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}
