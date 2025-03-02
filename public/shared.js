import {showSitemap} from "./sitemap.js";

export function loadNav() {
    const body = document.body;
    const header = document.createElement("header");
    const nav = document.createElement("nav");

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

    // Separate "Login" link to trigger the modal
    const loginLi = document.createElement("li");
    loginLi.textContent = "login";
    loginLi.addEventListener("click", () => {
        showAuthModal();
    });
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
}

// Enhanced Auth Modal with Login and Signup tabs
export function showAuthModal(initialTab = "login") {
    // Check if modal already exists
    const existingModal = document.querySelector(".auth-overlay");
    if (existingModal) {
        existingModal.remove();
    }

    // Create the modal overlay
    const overlay = document.createElement("div");
    overlay.className = "auth-overlay";

    const modalContainer = document.createElement("div");
    modalContainer.className = "auth-modal-container";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
        overlay.remove();
    });

    // Tab Navigation
    const tabsContainer = document.createElement("div");
    tabsContainer.className = "auth-tabs";

    const loginTab = document.createElement("button");
    loginTab.className = "auth-tab-btn";
    loginTab.textContent = "Login";
    loginTab.dataset.tab = "login";

    const signupTab = document.createElement("button");
    signupTab.className = "auth-tab-btn";
    signupTab.textContent = "Sign Up";
    signupTab.dataset.tab = "signup";

    tabsContainer.appendChild(loginTab);
    tabsContainer.appendChild(signupTab);

    // Tab Content Container
    const tabContent = document.createElement("div");
    tabContent.className = "auth-tab-content";

    // Create login form
    const loginContent = createLoginForm();
    loginContent.id = "login-content";
    loginContent.className = "auth-content";

    // Create signup form
    const signupContent = createSignupForm();
    signupContent.id = "signup-content";
    signupContent.className = "auth-content";

    // Add tab content to container
    tabContent.appendChild(loginContent);
    tabContent.appendChild(signupContent);

    // Status message area
    const statusDiv = document.createElement("div");
    statusDiv.id = "auth-status";
    statusDiv.className = "auth-status";

    // Assemble the modal
    modalContainer.appendChild(closeBtn);
    modalContainer.appendChild(tabsContainer);
    modalContainer.appendChild(tabContent);
    modalContainer.appendChild(statusDiv);
    overlay.appendChild(modalContainer);

    // Add modal to body
    document.body.appendChild(overlay);

    // Add tab switching functionality
    const tabBtns = tabsContainer.querySelectorAll(".auth-tab-btn");
    tabBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove active class from all tabs
            tabBtns.forEach((b) => b.classList.remove("active"));

            // Hide all content
            document.querySelectorAll(".auth-content").forEach((content) => {
                content.style.display = "none";
            });

            // Show selected content
            const tabName = btn.dataset.tab;
            document.getElementById(`${tabName}-content`).style.display = "block";

            // Add active class to selected tab
            btn.classList.add("active");
        });
    });

    // Set initial active tab
    if (initialTab === "signup") {
        signupTab.click();
    } else {
        loginTab.click();
    }

    // Close modal when clicking outside of it
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Check if user is already logged in
    checkLoginStatus(statusDiv);

    // Add CSS for the auth modal
    addAuthModalStyles();
}

function createLoginForm() {
    const loginContainer = document.createElement("div");

    // Method selector (Email or Phone)
    const methodSelector = document.createElement("div");
    methodSelector.className = "auth-method-selector";

    const emailMethodBtn = document.createElement("button");
    emailMethodBtn.className = "auth-method-btn active";
    emailMethodBtn.textContent = "Email";
    emailMethodBtn.dataset.method = "email";

    const phoneMethodBtn = document.createElement("button");
    phoneMethodBtn.className = "auth-method-btn";
    phoneMethodBtn.textContent = "Phone";
    phoneMethodBtn.dataset.method = "phone";

    methodSelector.appendChild(emailMethodBtn);
    methodSelector.appendChild(phoneMethodBtn);

    // Email login form
    const emailForm = document.createElement("form");
    emailForm.className = "auth-form";
    emailForm.id = "email-login-form";

    const emailInput = document.createElement("div");
    emailInput.className = "form-group";
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email:";
    emailLabel.htmlFor = "login-email";
    const emailField = document.createElement("input");
    emailField.type = "email";
    emailField.id = "login-email";
    emailField.name = "email";
    emailField.required = true;
    emailField.placeholder = "Enter your email";
    emailInput.appendChild(emailLabel);
    emailInput.appendChild(emailField);

    const emailError = document.createElement("div");
    emailError.className = "error-message";
    emailInput.appendChild(emailError);

    const passwordInput = document.createElement("div");
    passwordInput.className = "form-group";
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:";
    passwordLabel.htmlFor = "login-password";
    const passwordField = document.createElement("input");
    passwordField.type = "password";
    passwordField.id = "login-password";
    passwordField.name = "password";
    passwordField.required = true;
    passwordField.placeholder = "Enter your password";
    passwordInput.appendChild(passwordLabel);
    passwordInput.appendChild(passwordField);

    const passwordError = document.createElement("div");
    passwordError.className = "error-message";
    passwordInput.appendChild(passwordError);

    const emailSubmitBtn = document.createElement("button");
    emailSubmitBtn.type = "submit";
    emailSubmitBtn.className = "auth-btn";
    emailSubmitBtn.textContent = "Login";

    emailForm.appendChild(emailInput);
    emailForm.appendChild(passwordInput);
    emailForm.appendChild(emailSubmitBtn);

    emailForm.addEventListener("submit", (e) => handleLoginSubmit(e, "email"));

    // Phone login form
    const phoneForm = document.createElement("form");
    phoneForm.className = "auth-form";
    phoneForm.id = "phone-login-form";
    phoneForm.style.display = "none";

    const phoneInput = document.createElement("div");
    phoneInput.className = "form-group";
    const phoneLabel = document.createElement("label");
    phoneLabel.textContent = "Phone Number:";
    phoneLabel.htmlFor = "login-phone";
    const phoneField = document.createElement("input");
    phoneField.type = "tel";
    phoneField.id = "login-phone";
    phoneField.name = "phoneNumber";
    phoneField.required = true;
    phoneField.placeholder = "Enter your phone number";
    phoneInput.appendChild(phoneLabel);
    phoneInput.appendChild(phoneField);

    const phoneError = document.createElement("div");
    phoneError.className = "error-message";
    phoneInput.appendChild(phoneError);

    const phoneSubmitBtn = document.createElement("button");
    phoneSubmitBtn.type = "submit";
    phoneSubmitBtn.className = "auth-btn";
    phoneSubmitBtn.textContent = "Send Verification Code";

    phoneForm.appendChild(phoneInput);
    phoneForm.appendChild(phoneSubmitBtn);

    phoneForm.addEventListener("submit", (e) => handleLoginSubmit(e, "phone"));

    // Verification code form for phone login (initially hidden)
    const verificationForm = document.createElement("form");
    verificationForm.className = "auth-form";
    verificationForm.id = "verification-form";
    verificationForm.style.display = "none";

    const codeInput = document.createElement("div");
    codeInput.className = "form-group";
    const codeLabel = document.createElement("label");
    codeLabel.textContent = "Verification Code:";
    codeLabel.htmlFor = "verification-code";
    const codeField = document.createElement("input");
    codeField.type = "text";
    codeField.id = "verification-code";
    codeField.name = "code";
    codeField.required = true;
    codeField.placeholder = "Enter 6-digit code";
    codeField.pattern = "[0-9]{6}";
    codeInput.appendChild(codeLabel);
    codeInput.appendChild(codeField);

    const codeError = document.createElement("div");
    codeError.className = "error-message";
    codeInput.appendChild(codeError);

    const verificationSubmitBtn = document.createElement("button");
    verificationSubmitBtn.type = "submit";
    verificationSubmitBtn.className = "auth-btn";
    verificationSubmitBtn.textContent = "Verify Code";

    verificationForm.appendChild(codeInput);
    verificationForm.appendChild(verificationSubmitBtn);

    verificationForm.addEventListener("submit", handleVerificationSubmit);

    // Forgot password link
    const forgotPasswordLink = document.createElement("a");
    forgotPasswordLink.href = "#";
    forgotPasswordLink.className = "forgot-password-link";
    forgotPasswordLink.textContent = "Forgot Password?";
    forgotPasswordLink.addEventListener("click", (e) => {
        e.preventDefault();
        showForgotPasswordModal();
    });

    // Add method switching functionality
    methodSelector.querySelectorAll(".auth-method-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove active class from all method buttons
            methodSelector
                .querySelectorAll(".auth-method-btn")
                .forEach((b) => b.classList.remove("active"));

            // Hide all forms
            loginContainer.querySelectorAll(".auth-form").forEach((form) => {
                form.style.display = "none";
            });

            // Show selected form
            const method = btn.dataset.method;
            if (method === "email") {
                emailForm.style.display = "block";
                verificationForm.style.display = "none";
            } else if (method === "phone") {
                phoneForm.style.display = "block";
                verificationForm.style.display = "none";
            }

            // Add active class to selected method
            btn.classList.add("active");
        });
    });

    // Assemble login container
    loginContainer.appendChild(methodSelector);
    loginContainer.appendChild(emailForm);
    loginContainer.appendChild(phoneForm);
    loginContainer.appendChild(verificationForm);
    loginContainer.appendChild(forgotPasswordLink);

    return loginContainer;
}

function createSignupForm() {
    const signupContainer = document.createElement("div");

    // Method selector (Email or Phone)
    const methodSelector = document.createElement("div");
    methodSelector.className = "auth-method-selector";

    const emailMethodBtn = document.createElement("button");
    emailMethodBtn.className = "auth-method-btn active";
    emailMethodBtn.textContent = "Email";
    emailMethodBtn.dataset.method = "email";

    const phoneMethodBtn = document.createElement("button");
    phoneMethodBtn.className = "auth-method-btn";
    phoneMethodBtn.textContent = "Phone";
    phoneMethodBtn.dataset.method = "phone";

    methodSelector.appendChild(emailMethodBtn);
    methodSelector.appendChild(phoneMethodBtn);

    // Email signup form
    const emailForm = document.createElement("form");
    emailForm.className = "auth-form";
    emailForm.id = "email-signup-form";

    const nameInput = document.createElement("div");
    nameInput.className = "form-group";
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Full Name:";
    nameLabel.htmlFor = "signup-name-email";
    const nameField = document.createElement("input");
    nameField.type = "text";
    nameField.id = "signup-name-email";
    nameField.name = "name";
    nameField.required = true;
    nameField.placeholder = "Enter your full name";
    nameInput.appendChild(nameLabel);
    nameInput.appendChild(nameField);

    const nameError = document.createElement("div");
    nameError.className = "error-message";
    nameInput.appendChild(nameError);

    const emailInput = document.createElement("div");
    emailInput.className = "form-group";
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email:";
    emailLabel.htmlFor = "signup-email";
    const emailField = document.createElement("input");
    emailField.type = "email";
    emailField.id = "signup-email";
    emailField.name = "email";
    emailField.required = true;
    emailField.placeholder = "Enter your email";
    emailInput.appendChild(emailLabel);
    emailInput.appendChild(emailField);

    const emailError = document.createElement("div");
    emailError.className = "error-message";
    emailInput.appendChild(emailError);

    const passwordInput = document.createElement("div");
    passwordInput.className = "form-group";
    const passwordLabel = document.createElement("label");
    passwordLabel.textContent = "Password:";
    passwordLabel.htmlFor = "signup-password";
    const passwordField = document.createElement("input");
    passwordField.type = "password";
    passwordField.id = "signup-password";
    passwordField.name = "password";
    passwordField.required = true;
    passwordField.placeholder = "Create a password (min 6 characters)";
    passwordField.minLength = 6;
    passwordInput.appendChild(passwordLabel);
    passwordInput.appendChild(passwordField);

    const passwordError = document.createElement("div");
    passwordError.className = "error-message";
    passwordInput.appendChild(passwordError);

    const confirmPasswordInput = document.createElement("div");
    confirmPasswordInput.className = "form-group";
    const confirmPasswordLabel = document.createElement("label");
    confirmPasswordLabel.textContent = "Confirm Password:";
    confirmPasswordLabel.htmlFor = "signup-confirm-password";
    const confirmPasswordField = document.createElement("input");
    confirmPasswordField.type = "password";
    confirmPasswordField.id = "signup-confirm-password";
    confirmPasswordField.name = "confirmPassword";
    confirmPasswordField.required = true;
    confirmPasswordField.placeholder = "Confirm your password";
    confirmPasswordInput.appendChild(confirmPasswordLabel);
    confirmPasswordInput.appendChild(confirmPasswordField);

    const confirmPasswordError = document.createElement("div");
    confirmPasswordError.className = "error-message";
    confirmPasswordInput.appendChild(confirmPasswordError);

    const emailSubmitBtn = document.createElement("button");
    emailSubmitBtn.type = "submit";
    emailSubmitBtn.className = "auth-btn";
    emailSubmitBtn.textContent = "Create Account";

    emailForm.appendChild(nameInput);
    emailForm.appendChild(emailInput);
    emailForm.appendChild(passwordInput);
    emailForm.appendChild(confirmPasswordInput);
    emailForm.appendChild(emailSubmitBtn);

    emailForm.addEventListener("submit", (e) => handleSignupSubmit(e, "email"));

    // Phone signup form
    const phoneForm = document.createElement("form");
    phoneForm.className = "auth-form";
    phoneForm.id = "phone-signup-form";
    phoneForm.style.display = "none";

    const phoneNameInput = document.createElement("div");
    phoneNameInput.className = "form-group";
    const phoneNameLabel = document.createElement("label");
    phoneNameLabel.textContent = "Full Name:";
    phoneNameLabel.htmlFor = "signup-name-phone";
    const phoneNameField = document.createElement("input");
    phoneNameField.type = "text";
    phoneNameField.id = "signup-name-phone";
    phoneNameField.name = "name";
    phoneNameField.required = true;
    phoneNameField.placeholder = "Enter your full name";
    phoneNameInput.appendChild(phoneNameLabel);
    phoneNameInput.appendChild(phoneNameField);

    const phoneNameError = document.createElement("div");
    phoneNameError.className = "error-message";
    phoneNameInput.appendChild(phoneNameError);

    const phoneInput = document.createElement("div");
    phoneInput.className = "form-group";
    const phoneLabel = document.createElement("label");
    phoneLabel.textContent = "Phone Number:";
    phoneLabel.htmlFor = "signup-phone";
    const phoneField = document.createElement("input");
    phoneField.type = "tel";
    phoneField.id = "signup-phone";
    phoneField.name = "phoneNumber";
    phoneField.required = true;
    phoneField.placeholder = "Enter your phone number";
    phoneInput.appendChild(phoneLabel);
    phoneInput.appendChild(phoneField);

    const phoneError = document.createElement("div");
    phoneError.className = "error-message";
    phoneInput.appendChild(phoneError);

    const phonePasswordInput = document.createElement("div");
    phonePasswordInput.className = "form-group";
    const phonePasswordLabel = document.createElement("label");
    phonePasswordLabel.textContent = "Password:";
    phonePasswordLabel.htmlFor = "signup-phone-password";
    const phonePasswordField = document.createElement("input");
    phonePasswordField.type = "password";
    phonePasswordField.id = "signup-phone-password";
    phonePasswordField.name = "password";
    phonePasswordField.required = true;
    phonePasswordField.placeholder = "Create a password (min 6 characters)";
    phonePasswordField.minLength = 6;
    phonePasswordInput.appendChild(phonePasswordLabel);
    phonePasswordInput.appendChild(phonePasswordField);

    const phonePasswordError = document.createElement("div");
    phonePasswordError.className = "error-message";
    phonePasswordInput.appendChild(phonePasswordError);

    const phoneConfirmPasswordInput = document.createElement("div");
    phoneConfirmPasswordInput.className = "form-group";
    const phoneConfirmPasswordLabel = document.createElement("label");
    phoneConfirmPasswordLabel.textContent = "Confirm Password:";
    phoneConfirmPasswordLabel.htmlFor = "signup-phone-confirm-password";
    const phoneConfirmPasswordField = document.createElement("input");
    phoneConfirmPasswordField.type = "password";
    phoneConfirmPasswordField.id = "signup-phone-confirm-password";
    phoneConfirmPasswordField.name = "confirmPassword";
    phoneConfirmPasswordField.required = true;
    phoneConfirmPasswordField.placeholder = "Confirm your password";
    phoneConfirmPasswordInput.appendChild(phoneConfirmPasswordLabel);
    phoneConfirmPasswordInput.appendChild(phoneConfirmPasswordField);

    const phoneConfirmPasswordError = document.createElement("div");
    phoneConfirmPasswordError.className = "error-message";
    phoneConfirmPasswordInput.appendChild(phoneConfirmPasswordError);

    const phoneSubmitBtn = document.createElement("button");
    phoneSubmitBtn.type = "submit";
    phoneSubmitBtn.className = "auth-btn";
    phoneSubmitBtn.textContent = "Create Account";

    phoneForm.appendChild(phoneNameInput);
    phoneForm.appendChild(phoneInput);
    phoneForm.appendChild(phonePasswordInput);
    phoneForm.appendChild(phoneConfirmPasswordInput);
    phoneForm.appendChild(phoneSubmitBtn);

    phoneForm.addEventListener("submit", (e) => handleSignupSubmit(e, "phone"));

    // Add method switching functionality
    methodSelector.querySelectorAll(".auth-method-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            // Remove active class from all method buttons
            methodSelector
                .querySelectorAll(".auth-method-btn")
                .forEach((b) => b.classList.remove("active"));

            // Hide all forms
            signupContainer.querySelectorAll(".auth-form").forEach((form) => {
                form.style.display = "none";
            });

            // Show selected form
            const method = btn.dataset.method;
            if (method === "email") {
                emailForm.style.display = "block";
            } else if (method === "phone") {
                phoneForm.style.display = "block";
            }

            // Add active class to selected method
            btn.classList.add("active");
        });
    });

    // Assemble signup container
    signupContainer.appendChild(methodSelector);
    signupContainer.appendChild(emailForm);
    signupContainer.appendChild(phoneForm);

    return signupContainer;
}

function showForgotPasswordModal() {
    // Hide the auth modal
    const authModal = document.querySelector(".auth-overlay");
    if (authModal) {
        authModal.style.display = "none";
    }

    // Create forgot password modal
    const overlay = document.createElement("div");
    overlay.className = "forgot-password-overlay";

    const modalContainer = document.createElement("div");
    modalContainer.className = "forgot-password-container";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close-btn";
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", () => {
        overlay.remove();
        if (authModal) {
            authModal.style.display = "flex";
        }
    });

    const modalTitle = document.createElement("h3");
    modalTitle.textContent = "Reset Password";

    const form = document.createElement("form");
    form.className = "forgot-password-form";

    const emailInput = document.createElement("div");
    emailInput.className = "form-group";
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email:";
    emailLabel.htmlFor = "forgot-password-email";
    const emailField = document.createElement("input");
    emailField.type = "email";
    emailField.id = "forgot-password-email";
    emailField.name = "email";
    emailField.required = true;
    emailField.placeholder = "Enter your email";
    emailInput.appendChild(emailLabel);
    emailInput.appendChild(emailField);

    const emailError = document.createElement("div");
    emailError.className = "error-message";
    emailInput.appendChild(emailError);

    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "auth-btn";
    submitBtn.textContent = "Send Reset Link";

    form.appendChild(emailInput);
    form.appendChild(submitBtn);

    form.addEventListener("submit", handleForgotPasswordSubmit);

    const statusMessage = document.createElement("div");
    statusMessage.className = "status-message";

    modalContainer.appendChild(closeBtn);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(form);
    modalContainer.appendChild(statusMessage);
    overlay.appendChild(modalContainer);

    document.body.appendChild(overlay);

    // Close modal when clicking outside of it
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.remove();
            if (authModal) {
                authModal.style.display = "flex";
            }
        }
    });
}

async function handleLoginSubmit(event, method) {
    event.preventDefault();

    const form = event.target;
    const statusDiv = document.getElementById("auth-status");
    statusDiv.textContent = "";
    statusDiv.className = "auth-status";

    // Reset all error messages
    form.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
    });

    // Client-side validation
    let isValid = true;

    if (method === "email") {
        const email = form.querySelector("#login-email");
        const password = form.querySelector("#login-password");

        if (!validateEmail(email.value)) {
            form.querySelector("#login-email").nextElementSibling.textContent =
                "Please enter a valid email address";
            isValid = false;
        }

        if (password.value.length < 6) {
            form.querySelector("#login-password").nextElementSibling.textContent =
                "Password must be at least 6 characters";
            isValid = false;
        }

        if (isValid) {
            try {
                statusDiv.textContent = "Logging in...";
                statusDiv.className = "auth-status info";

                const response = await fetch("/api/auth/login/email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.value,
                        password: password.value,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    statusDiv.textContent = "Login successful. Redirecting...";
                    statusDiv.className = "auth-status success";

                    // Store token in localStorage
                    localStorage.setItem("authToken", data.token);

                    // Refresh page after short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    statusDiv.textContent = data.message || "Login failed";
                    statusDiv.className = "auth-status error";
                }
            } catch (error) {
                statusDiv.textContent = "An error occurred. Please try again.";
                statusDiv.className = "auth-status error";
                console.error("Login error:", error);
            }
        }
    } else if (method === "phone") {
        const phoneNumber = form.querySelector("#login-phone");

        if (!validatePhoneNumber(phoneNumber.value)) {
            form.querySelector("#login-phone").nextElementSibling.textContent =
                "Please enter a valid phone number";
            isValid = false;
        }

        if (isValid) {
            try {
                statusDiv.textContent = "Sending verification code...";
                statusDiv.className = "auth-status info";

                const response = await fetch("/api/auth/login/phone", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        phoneNumber: phoneNumber.value,
                    }),
                });

                const data = await response.json();

                if (response.ok && data.requiresVerification) {
                    statusDiv.textContent = data.message || "Verification code sent";
                    statusDiv.className = "auth-status success";

                    // Show verification form and hide phone login form
                    document.getElementById("phone-login-form").style.display = "none";
                    document.getElementById("verification-form").style.display = "block";

                    // Store phone number for verification
                    document.getElementById("verification-form").dataset.phoneNumber =
                        phoneNumber.value;
                } else {
                    statusDiv.textContent =
                        data.message || "Failed to send verification code";
                    statusDiv.className = "auth-status error";
                }
            } catch (error) {
                statusDiv.textContent = "An error occurred. Please try again.";
                statusDiv.className = "auth-status error";
                console.error("Phone login error:", error);
            }
        }
    }
}

async function handleVerificationSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const statusDiv = document.getElementById("auth-status");
    statusDiv.textContent = "";
    statusDiv.className = "auth-status";

    // Reset error messages
    form.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
    });

    const code = form.querySelector("#verification-code").value;
    const phoneNumber = form.dataset.phoneNumber;

    // Validate verification code
    if (!/^\d{6}$/.test(code)) {
        form.querySelector("#verification-code").nextElementSibling.textContent =
            "Please enter a valid 6-digit code";
        return;
    }

    try {
        statusDiv.textContent = "Verifying...";
        statusDiv.className = "auth-status info";

        const response = await fetch("/api/auth/verify-phone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber,
                code: code,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            statusDiv.textContent = "Phone verified. Logging in...";
            statusDiv.className = "auth-status success";

            // Store token in localStorage
            localStorage.setItem("authToken", data.token);

            // Refresh page after short delay
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } else {
            statusDiv.textContent = data.message || "Verification failed";
            statusDiv.className = "auth-status error";
        }
    } catch (error) {
        statusDiv.textContent = "An error occurred. Please try again.";
        statusDiv.className = "auth-status error";
        console.error("Verification error:", error);
    }
}

async function handleSignupSubmit(event, method) {
    event.preventDefault();

    const form = event.target;
    const statusDiv = document.getElementById("auth-status");
    statusDiv.textContent = "";
    statusDiv.className = "auth-status";

    // Reset all error messages
    form.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
    });

    // Client-side validation
    let isValid = true;

    if (method === "email") {
        const name = form.querySelector("#signup-name-email");
        const email = form.querySelector("#signup-email");
        const password = form.querySelector("#signup-password");
        const confirmPassword = form.querySelector("#signup-confirm-password");

        // Validate name
        if (!name.value.trim()) {
            form.querySelector("#signup-name-email").nextElementSibling.textContent =
                "Name is required";
            isValid = false;
        }

        // Validate email
        if (!validateEmail(email.value)) {
            form.querySelector("#signup-email").nextElementSibling.textContent =
                "Please enter a valid email address";
            isValid = false;
        }

        // Validate password
        if (password.value.length < 6) {
            form.querySelector("#signup-password").nextElementSibling.textContent =
                "Password must be at least 6 characters";
            isValid = false;
        }

        // Validate password confirmation
        if (password.value !== confirmPassword.value) {
            form.querySelector(
                "#signup-confirm-password"
            ).nextElementSibling.textContent = "Passwords do not match";
            isValid = false;
        }

        if (isValid) {
            try {
                statusDiv.textContent = "Creating account...";
                statusDiv.className = "auth-status info";

                const response = await fetch("/api/auth/register/email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.value,
                        email: email.value,
                        password: password.value,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    statusDiv.textContent =
                        data.message ||
                        "Account created successfully! Please check your email to verify your account.";
                    statusDiv.className = "auth-status success";

                    // Clear form
                    form.reset();
                } else {
                    statusDiv.textContent = data.message || "Registration failed";
                    statusDiv.className = "auth-status error";
                }
            } catch (error) {
                statusDiv.textContent = "An error occurred. Please try again.";
                statusDiv.className = "auth-status error";
                console.error("Signup error:", error);
            }
        }
    } else if (method === "phone") {
        const name = form.querySelector("#signup-name-phone");
        const phoneNumber = form.querySelector("#signup-phone");
        const password = form.querySelector("#signup-phone-password");
        const confirmPassword = form.querySelector(
            "#signup-phone-confirm-password"
        );

        // Validate name
        if (!name.value.trim()) {
            form.querySelector("#signup-name-phone").nextElementSibling.textContent =
                "Name is required";
            isValid = false;
        }

        // Validate phone
        if (!validatePhoneNumber(phoneNumber.value)) {
            form.querySelector("#signup-phone").nextElementSibling.textContent =
                "Please enter a valid phone number";
            isValid = false;
        }

        // Validate password
        if (password.value.length < 6) {
            form.querySelector(
                "#signup-phone-password"
            ).nextElementSibling.textContent =
                "Password must be at least 6 characters";
            isValid = false;
        }

        // Validate password confirmation
        if (password.value !== confirmPassword.value) {
            form.querySelector(
                "#signup-phone-confirm-password"
            ).nextElementSibling.textContent = "Passwords do not match";
            isValid = false;
        }

        if (isValid) {
            try {
                statusDiv.textContent = "Creating account...";
                statusDiv.className = "auth-status info";

                const response = await fetch("/api/auth/register/phone", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: name.value,
                        phoneNumber: phoneNumber.value,
                        password: password.value,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    statusDiv.textContent =
                        data.message ||
                        "Account created! A verification code has been sent to your phone.";
                    statusDiv.className = "auth-status success";

                    // Clear form
                    form.reset();

                    // Switch to login tab for verification
                    setTimeout(() => {
                        document.querySelector('[data-tab="login"]').click();
                        document.querySelector('[data-method="phone"]').click();
                    }, 2000);
                } else {
                    statusDiv.textContent = data.message || "Registration failed";
                    statusDiv.className = "auth-status error";
                }
            } catch (error) {
                statusDiv.textContent = "An error occurred. Please try again.";
                statusDiv.className = "auth-status error";
                console.error("Signup error:", error);
            }
        }
    }
}

async function handleForgotPasswordSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const statusMessage = document.querySelector(
        ".forgot-password-container .status-message"
    );
    statusMessage.textContent = "";
    statusMessage.className = "status-message";

    // Reset error messages
    form.querySelectorAll(".error-message").forEach((error) => {
        error.textContent = "";
    });

    const email = form.querySelector("#forgot-password-email");

    // Validate email
    if (!validateEmail(email.value)) {
        form.querySelector(
            "#forgot-password-email"
        ).nextElementSibling.textContent = "Please enter a valid email address";
        return;
    }

    try {
        statusMessage.textContent = "Sending reset link...";
        statusMessage.className = "status-message info";

        const response = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.value,
            }),
        });

        const data = await response.json();

        if (response.ok) {
            statusMessage.textContent =
                data.message || "Reset link sent to your email";
            statusMessage.className = "status-message success";

            // Clear form
            form.reset();
        } else {
            statusMessage.textContent = data.message || "Failed to send reset link";
            statusMessage.className = "status-message error";
        }
    } catch (error) {
        statusMessage.textContent = "An error occurred. Please try again.";
        statusMessage.className = "status-message error";
        console.error("Forgot password error:", error);
    }
}

function validateEmail(email) {
    const re =
        /^(([^<>()[]\.,;:\s@"]+(.[^<>()[]\.,;:\s@"]+)*)|(".+"))@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}])|(([a-zA-Z-0-9]+.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhoneNumber(phone) {
    // Simple validation for demo purposes - customize as needed const re = /^+?[1-9]\d{9,14}$/; return re.test(phone); }
}

function checkLoginStatus(statusElement) {
    fetch("/api/auth/status")
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            if (data.isAuthenticated) {
                // Hide all forms and show logged in message document.querySelectorAll('.auth-content').forEach(content => { content.style.display = 'none'; });

                document.querySelectorAll(".auth-tabs").forEach((tabs) => {
                    tabs.style.display = "none";
                });

                statusElement.textContent = `Logged in as: ${
                    data.user.name || "User"
                }`;
                statusElement.className = "auth-status success";

                // Show logout button
                const logoutBtn = document.createElement("button");
                logoutBtn.textContent = "Logout";
                logoutBtn.className = "auth-btn logout-btn";

                logoutBtn.addEventListener("click", () => {
                    window.location.href = "/logout";
                });

                statusElement.appendChild(document.createElement("br"));
                statusElement.appendChild(logoutBtn);
            }
        })
        .catch((error) => {
            console.error("Error checking login status:", error);
        });
}

function addAuthModalStyles() {
    // Check if styles already exist if (document.getElementById('auth-modal-styles')) { return; }

    const styles = document.createElement("style");
    styles.id = "auth-modal-styles";
    styles.textContent = `
    .auth-overlay, .forgot-password-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }
    
    .auth-modal-container, .forgot-password-container {
        background-color: #fff;
        border-radius: 8px;
        padding: 20px;
        width: 90%;
        max-width: 500px;
        position: relative;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .modal-close-btn {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 24px;
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
    }
    
    .auth-tabs {
        display: flex;
        margin-bottom: 20px;
        border-bottom: 1px solid #ddd;
    }
    
    .auth-tab-btn {
        padding: 10px 20px;
        background: none;
        border: none;
        border-bottom: 2px solid transparent;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s;
        flex: 1;
    }
    
    .auth-tab-btn.active {
        border-bottom: 2px solid var(--color-primary, #007bff);
        color: var(--color-primary, #007bff);
    }
    
    .auth-content {
        display: none;
    }
    
    .auth-method-selector {
        display: flex;
        margin-bottom: 15px;
    }
    
    .auth-method-btn {
        flex: 1;
        padding: 8px;
        background: #f5f5f5;
        border: 1px solid #ddd;
        cursor: pointer;
    }
    
    .auth-method-btn:first-child {
        border-radius: 4px 0 0 4px;
    }
    
    .auth-method-btn:last-child {
        border-radius: 0 4px 4px 0;
    }
    
    .auth-method-btn.active {
        background: var(--color-primary, #007bff);
        color: white;
        border-color: var(--color-primary, #007bff);
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
        border-radius: 4px;
        font-size: 16px;
    }
    
    .error-message {
        color: #dc3545;
        font-size: 14px;
        margin-top: 5px;
        min-height: 20px;
    }
    
    .auth-btn {
        width: 100%;
        padding: 12px;
        background-color: var(--color-primary, #007bff);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .auth-btn:hover {
        background-color: var(--color-primary-dark, #0069d9);
    }
    
    .forgot-password-link {
        display: block;
        text-align: center;
        margin-top: 15px;
        color: var(--color-primary, #007bff);
        text-decoration: none;
    }
    
    .auth-status, .status-message {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
    }
    
    .auth-status.error, .status-message.error {
        background-color: #f8d7da;
        color: #721c24;
    }
    
    .auth-status.success, .status-message.success {
        background-color: #d4edda;
        color: #155724;
    }
    
    .auth-status.info, .status-message.info {
        background-color: #cce5ff;
        color: #004085;
    }
    
    .logout-btn {
        margin-top: 10px;
        background-color: #dc3545;
    }
    
    .logout-btn:hover {
        background-color: #c82333;
    }
    
    @media (max-width: 768px) {
        .auth-modal-container, .forgot-password-container {
            width: 95%;
            padding: 15px;
        }
    }
`;

    document.head.appendChild(styles);
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
