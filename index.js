import './carouselTabs.js';
import createTabsAndInfiniteCarousel from "./carouselTabs.js";

document.addEventListener('DOMContentLoaded', () => {
    loadNav();

    const main = document.createElement('main');
    const body = document.body;
    body.appendChild(main);

    createLayout(main);

});

function loadNav() {
    const body = document.body;

    const header = document.createElement('header');
    const nav = document.createElement('nav');

    const logo = document.createElement('h1');
    logo.className = 'logo';
    logo.textContent = 'Welcome to marcusbc.com';
    logo.addEventListener('click', () => {
        window.location.href = '/';
    });

    const navLinks = document.createElement('ul');
    navLinks.className = 'nav-links';

    const links = ['About', 'Tools', 'Projects', 'Contact'];
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

async function createLayout(parentElement) {
    // About Me section
    const aboutSection = document.createElement('section');
    aboutSection.className = 'about-me';

    const aboutImg = document.createElement('img');
    aboutImg.src = './assets/100_0018.JPG';
    aboutImg.alt = 'Profile Picture';
    aboutSection.appendChild(aboutImg);

    const aboutDetails = document.createElement('div');
    aboutDetails.className = 'about-details';
    aboutDetails.textContent = 'My name is Marcus Clements, and I am a current computer science student at UW-La Crosse. I am passionate about software development and learning new technologies, and am always looking for new opportunities to learn and grow.';
    aboutSection.appendChild(aboutDetails);

    parentElement.appendChild(aboutSection);

    const cardSets = [
        {
            title: `Languages <i class="fa-solid fa-code"></i>`,
            content: [`<i class="fa-brands fa-js"></i>`, `<i class="fa-brands fa-html5"></i>`, `<i class="fa-brands fa-css3-alt"></i>`, `<i class="fa-brands fa-python"></i>`, `<i class="fa-brands fa-java"></i>`, 'C/C++']
        },
        {
            title: `Frameworks <i class="fa-solid fa-puzzle-piece"></i>`,
            content: ['React', 'Node.js', 'Express', 'Angular']
        },
        {
            title: `Databases <i class="fa-solid fa-database"></i>`,
            content: ['SQLite', 'MySQL', 'PostgresSQL']
        },
        {
            title: `Other Tools <i class="fa-solid fa-toolbox"></i>`,
            content: ['Git', 'Docker/Compose', 'Jenkins', 'Jira']
        }
    ];
    
    // Carousel section
    const carouselSection = document.createElement('section');
    carouselSection.className = 'carousel-section';
    createTabsAndInfiniteCarousel(carouselSection, cardSets);
    parentElement.appendChild(carouselSection);

    // Projects section
    const projectsSection = document.createElement('section');
    projectsSection.className = 'projects';

    const projectsTitle = document.createElement('h2');
    projectsTitle.textContent = 'Public Repositories';
    projectsSection.appendChild(projectsTitle);

    const projectList = document.createElement('ul');
    projectList.className = 'project-list';

    // GitHub Repos list
    const projects = await fetchGitHubRepos('M4rcusBC');

    projects.forEach(proj => {
        if (proj !== null) {
            const li = document.createElement('li');
            const a = document.createElement('a');
            const p = document.createElement('p');
            if (proj.description !== null) p.textContent = proj.description;
            a.textContent = proj.name;
            a.href = proj.url;
            a.target = '_blank';
            a.textContent += ' ';
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-arrow-up-right-from-square';
            a.appendChild(icon);
            li.appendChild(a);
            li.appendChild(p);
            projectList.appendChild(li);
        }
    });

    projectsSection.appendChild(projectList);
    parentElement.appendChild(projectsSection);

    // Social links section
    const socialSection = document.createElement('section');
    socialSection.className = 'social-links';

    const socialTitle = document.createElement('h3');
    socialTitle.textContent = 'Follow Me';
    socialSection.appendChild(socialTitle);

    const socialList = document.createElement('ul');
    socialList.className = 'social-list';

    const socials = [
        {name: 'GitHub', link: 'https://github.com/your-username'},
        {name: 'LinkedIn', link: 'https://linkedin.com/in/your-username'},
    ];

    socials.forEach(social => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.textContent = social.name;
        a.href = social.link;
        a.target = '_blank';
        li.appendChild(a);
        socialList.appendChild(li);
    });

    socialSection.appendChild(socialList);
    parentElement.appendChild(socialSection);

    // Footer section
    const footer = document.createElement('footer');
    footer.className = 'site-footer';

    // Footer nav
    const footerNav = document.createElement('nav');
    const footerLinks = [
        {name: 'Source (GitHub)', link: 'https://github.com/M4rcusBC/marcusbc.com', target: '_blank'},
        {name: 'Sitemap', link: './sitemap.html', target: '_self'},
        {name: 'Privacy Policy', link: '#privacy', target: '_self'}
    ];

    footerLinks.forEach(fl => {
        const a = document.createElement('a');
        a.textContent = fl.name;
        a.href = fl.link;
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

    // Footer legal info
    const footerLegal = document.createElement('div');
    footerLegal.className = 'footer-legal';
    footerLegal.textContent = '© 2025 Marcus Clements. All rights reserved.';
    footer.appendChild(footerLegal);

    document.body.appendChild(footer);
}

async function fetchGitHubRepos(username) {
    const response = await fetch(`https://api.github.com/users/${username}/repos`);
    if (!response.ok) {
        throw new Error(`HTTP error; status: ${response.status}`);
    }

    const repos = await response.json();
    return repos.map(repo => ({
        name: repo['name'],
        description: repo['description'],
        url: repo['svn_url']
    }));
}