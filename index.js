document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    const header = document.createElement('header');
    const nav = document.createElement('nav');

    const logo = document.createElement('div');
    logo.className = 'logo';
    logo.textContent = 'My Portfolio';

    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';

    const links = ['About', 'Projects', 'Contact'];
    links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${link.toLowerCase()}`;
        a.textContent = link;
        li.appendChild(a);
        navLinks.appendChild(li);
    });

    const burger = document.createElement('div');
    burger.className = 'burger';
    for (let i = 0; i < 3; i++) {
        const div = document.createElement('div');
        div.className = `burger-line`;
        burger.appendChild(div);
    }

    nav.appendChild(logo);
    nav.appendChild(navLinks);
    nav.appendChild(burger);
    header.appendChild(nav);
    body.insertBefore(header, body.firstChild);

    const main = document.createElement('main');
    body.appendChild(main);

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
    });
});