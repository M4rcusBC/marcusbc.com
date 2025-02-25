document.addEventListener('DOMContentLoaded', () => {
    loadNav();

    const main = document.createElement('main');
    const body = document.body;
    body.appendChild(main);
    
});

function loadNav() {
    const body = document.body;

    const header = document.createElement('header');
    const nav = document.createElement('nav');

    const logo = document.createElement('h1');
    logo.className = 'logo';
    logo.textContent = 'My Portfolio';
    logo.addEventListener('click', () => {
        window.location.href = '/';
    });

    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';

    const links = ['About', 'Projects', 'Contact'];
    links.forEach(link => {
        const li = document.createElement('li');
        li.textContent = link.toLowerCase();
        li.addEventListener('click', () => {
            window.location.href = `#${link.toLowerCase()}`;
        });
        navLinks.appendChild(li);
    });

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

