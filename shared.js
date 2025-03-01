import { showSitemap } from './sitemap.js';

export function loadNav() {
    const body = document.body;

    const header = document.createElement('header');
    const nav = document.createElement('nav');

    const logo = document.createElement('h1');
    logo.className = 'logo';
    logo.textContent = 'Welcome to marcusbc.com';
    logo.addEventListener('click', () => {
        window.location.href = './index.html';
    });

    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';

    const links = ['Tools', 'Projects', 'Contact', 'Login'];
    links.forEach(link => {
        const li = document.createElement('li');
        li.textContent = link.toLowerCase();
        li.addEventListener('click', () => {
            window.location.href = `./${link.toLowerCase()}.html`;
        });
        navLinks.appendChild(li);
    });
    navLinks.style.zIndex = '999';

    const burger = document.createElement('div');
    burger.className = 'burger';
    const NUM_BURGER_LINES = 3;
    for (let i = 0; i < NUM_BURGER_LINES; i++) {
        const div = document.createElement('div');
        div.className = `burger-line`;
        burger.appendChild(div);
    }

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    nav.appendChild(logo);
    nav.appendChild(navLinks);
    nav.appendChild(burger);
    header.appendChild(nav);
    body.insertBefore(header, body.firstChild);
}

export function loadFooter(parentElement) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';


    const footerNav = document.createElement('nav');
    const footerLinks = [
        {name: 'Source (GitHub)', link: 'https://github.com/M4rcusBC/marcusbc.com', target: '_blank'},
        {name: 'Sitemap', link: './sitemap.html', target: '_self'},
        {name: 'Privacy Policy', link: './privacy-policy.html', target: '_self'}
    ];

    footerLinks.forEach(fl => {
        const a = document.createElement('a');
        a.textContent = fl.name;
        if (fl.name !== 'Sitemap') {
            a.href = fl.link;
        } else {
            a.addEventListener('click', () => {
                showSitemap();
            });
        }
        a.target = fl.target;
        footerNav.appendChild(a);
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