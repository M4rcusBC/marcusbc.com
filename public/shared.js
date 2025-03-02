import { showSitemap } from './sitemap.js';

export function loadNav() {
    const body = document.body;
    const header = document.createElement('header');
    const nav = document.createElement('nav');

    // Logo
    const logo = document.createElement('h1');
    logo.className = 'logo';
    logo.textContent = 'Welcome to marcusbc.com';
    logo.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Navigation Links
    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';

    const links = ['Tools', 'Projects', 'Contact'];
    links.forEach(link => {
        const li = document.createElement('li');
        li.textContent = link.toLowerCase();
        li.addEventListener('click', () => {
            window.location.href = `./${link.toLowerCase()}.html`;
        });
        navLinks.appendChild(li);
    });

    // Separate "Login" link to trigger the modal
    const loginLi = document.createElement('li');
    loginLi.textContent = 'login';
    loginLi.addEventListener('click', () => {
        showLoginModal();
    });
    navLinks.appendChild(loginLi);

    // Burger menu
    const burger = document.createElement('div');
    burger.className = 'burger';
    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.className = 'burger-line';
        burger.appendChild(line);
    }

    // Mobile backdrop for nav
    const modalBackdrop = document.createElement('div');
    modalBackdrop.className = 'modal-backdrop';
    modalBackdrop.style.display = 'none';

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        if (navLinks.classList.contains('nav-active') && window.innerWidth <= 768) {
            modalBackdrop.style.display = 'block';
        } else {
            modalBackdrop.style.display = 'none';
        }
    });

    modalBackdrop.addEventListener('click', () => {
        navLinks.classList.remove('nav-active');
        burger.classList.remove('toggle');
        modalBackdrop.style.display = 'none';
    });

    nav.appendChild(logo);
    nav.appendChild(navLinks);
    nav.appendChild(burger);
    header.appendChild(nav);

    body.insertBefore(modalBackdrop, body.firstChild);
    body.insertBefore(header, body.firstChild);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            modalBackdrop.style.display = 'none';
        } else if (navLinks.classList.contains('nav-active')) {
            modalBackdrop.style.display = 'block';
        }
    });
}

// Add the showLoginModal function
function showLoginModal() {
    // Check if modal already exists
    const existingModal = document.querySelector('.overlay-login');
    if (existingModal) {
        existingModal.remove();
    }

    // Create the login modal
    const overlay = document.createElement('div');
    overlay.className = 'overlay-login';

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container-login';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'modal-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
        overlay.remove();
    });

    // Modal title
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Login Options';

    // Login links container
    const linksList = document.createElement('ul');
    linksList.className = 'login-link-list';

    // Simple login form
    const formItem = document.createElement('li');
    const loginForm = document.createElement('form');
    loginForm.action = '/api/auth/login';
    loginForm.method = 'post';

    const usernameInput = document.createElement('input');
    usernameInput.type = 'text';
    usernameInput.name = 'username';
    usernameInput.placeholder = 'Username';
    usernameInput.style.width = '100%';
    usernameInput.style.padding = '8px';
    usernameInput.style.marginBottom = '10px';
    usernameInput.style.borderRadius = '4px';
    usernameInput.style.border = '1px solid #ccc';

    const loginButton = document.createElement('button');
    loginButton.type = 'submit';
    loginButton.textContent = 'Login';
    loginButton.style.padding = '8px 16px';
    loginButton.style.backgroundColor = 'var(--color-primary)';
    loginButton.style.color = 'white';
    loginButton.style.border = 'none';
    loginButton.style.borderRadius = '4px';
    loginButton.style.cursor = 'pointer';
    loginButton.style.width = '100%';

    loginForm.appendChild(usernameInput);
    loginForm.appendChild(loginButton);
    formItem.appendChild(loginForm);
    linksList.appendChild(formItem);

    // Status message
    const statusDiv = document.createElement('div');
    statusDiv.id = 'login-status';
    statusDiv.style.marginTop = '10px';
    statusDiv.style.textAlign = 'center';

    // Assemble the modal
    modalContainer.appendChild(closeBtn);
    modalContainer.appendChild(modalTitle);
    modalContainer.appendChild(linksList);
    modalContainer.appendChild(statusDiv);
    overlay.appendChild(modalContainer);

    // Add modal to body
    document.body.appendChild(overlay);

    // Close modal when clicking outside of it
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });

    // Check login status
    checkLoginStatus(statusDiv);
}

function checkLoginStatus(statusElement) {
    fetch('/api/auth/status')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.isAuthenticated) {
                statusElement.textContent = `Logged in as: ${data.user.name || 'User'}`;
                statusElement.style.color = 'green';

                // Show logout button
                const logoutBtn = document.createElement('button');
                logoutBtn.textContent = 'Logout';
                logoutBtn.style.marginTop = '10px';
                logoutBtn.style.padding = '8px 16px';
                logoutBtn.style.backgroundColor = '#dc3545';
                logoutBtn.style.color = 'white';
                logoutBtn.style.border = 'none';
                logoutBtn.style.borderRadius = '4px';
                logoutBtn.style.cursor = 'pointer';

                logoutBtn.addEventListener('click', () => {
                    window.location.href = '/logout';
                });

                statusElement.appendChild(document.createElement('br'));
                statusElement.appendChild(logoutBtn);
            } else {
                statusElement.textContent = 'Not logged in';
                statusElement.style.color = '#666';
            }
        })
        .catch(error => {
            console.error('Error checking login status:', error);
            statusElement.textContent = 'Unable to check login status';
            statusElement.style.color = 'red';
        });
}

export function loadFooter(parentElement) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    const footerNav = document.createElement('nav');
    const footerLinks = [
        { name: 'Source (GitHub)', link: 'https://github.com/M4rcusBC/marcusbc.com', target: '_blank' },
        { name: 'Sitemap', link: './sitemap.html', target: '_self' },
        { name: 'Privacy Policy', link: './privacy-policy.html', target: '_self' }
    ];

    footerLinks.forEach(fl => {
        const a = document.createElement('a');
        a.textContent = fl.name;
        if (fl.name !== 'Sitemap') {
            a.href = fl.link;
        } else {
            a.style.cursor = 'pointer';
            a.addEventListener('click', () => {
                showSitemap();
            });
        }
        a.target = fl.target;
        footerNav.appendChild(a);

        // Add icon for external links
        if (fl.target === '_blank') {
            a.textContent += ' ';
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-arrow-up-right-from-square';
            a.appendChild(icon);
        }
    });

    footer.appendChild(footerNav);

    const footerLegal = document.createElement('div');
    footerLegal.className = 'footer-legal';
    footerLegal.textContent = '© 2025 Marcus Clements. All rights reserved.';
    footer.appendChild(footerLegal);

    parentElement.appendChild(footer);
}