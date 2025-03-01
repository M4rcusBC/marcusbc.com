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