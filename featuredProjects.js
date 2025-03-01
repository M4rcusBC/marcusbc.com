// Add this before your existing projects section (line ~104)
export default async function createFeaturedProjects(parentElement) {
    const featuredSection = document.createElement('section');
    featuredSection.className = 'featured-projects';
    featuredSection.id = 'projects';

    const featuredTitle = document.createElement('h2');
    featuredTitle.textContent = 'Featured Projects';
    featuredSection.appendChild(featuredTitle);

    const featuredList = document.createElement('div');
    featuredList.className = 'featured-list';

    // Add your top projects here - customize these with your actual projects!
    const featuredProjects = [
        {
            name: 'My Portfolio Website',
            description: 'A responsive personal portfolio website built with vanilla JavaScript, CSS, and HTML. Features dynamic content loading, responsive design, and integration with GitHub API.',
            image: './assets/portfolio-screenshot.jpg', // Add this image to your assets folder
            technologies: ['JavaScript', 'HTML', 'CSS', 'GitHub API'],
            liveLink: 'https://marcusbc.com',
            repoLink: 'https://github.com/M4rcusBC/marcusbc.com',
        },
        // You can add a placeholder if you don't have enough projects yet
        {
            name: 'Project Coming Soon',
            description: 'This exciting new project is currently under development. Check back soon for updates!',
            image: './assets/coming-soon.jpg', // Add a placeholder image
            technologies: ['React', 'Node.js', 'Express'],
            repoLink: 'https://github.com/M4rcusBC',
        }
    ];

    featuredProjects.forEach(project => {
        const projectCard = document.createElement('article');
        projectCard.className = 'featured-card';

        // Project image
        if (project.image) {
            try {
                const img = document.createElement('img');
                img.src = project.image;
                img.alt = `${project.name} screenshot`;
                img.className = 'project-image';
                img.onerror = () => {
                    // If image fails to load, replace with a placeholder
                    img.src = 'https://placehold.co/600x400'; // Add a placeholder image to your assets
                };
                projectCard.appendChild(img);
            } catch (error) {
                console.error('Error loading project image:', error);
            }
        }

        // Project content
        const content = document.createElement('div');
        content.className = 'project-content';

        const title = document.createElement('h3');
        title.textContent = project.name;
        content.appendChild(title);

        const desc = document.createElement('p');
        desc.textContent = project.description;
        content.appendChild(desc);

        // Technologies used
        const techList = document.createElement('ul');
        techList.className = 'tech-list';
        project.technologies.forEach(tech => {
            const techItem = document.createElement('li');
            techItem.textContent = tech;
            techList.appendChild(techItem);
        });
        content.appendChild(techList);

        // Links
        const links = document.createElement('div');
        links.className = 'project-links';

        if (project.liveLink) {
            const liveLink = document.createElement('a');
            if (project.liveLink.includes('marcusbc.com')) {
                liveLink.onclick = (e) => {
                    e.preventDefault();
                    alert('You\'re already here! Check out the source code linked towards the bottom of the page instead.');
                };
                liveLink.innerHTML = 'Live Demo';
            } else {
                liveLink.href = project.liveLink;
                liveLink.innerHTML = 'Live Demo <i class="fa-solid fa-external-link-alt"></i>';
            }
            liveLink.target = '_blank';
            liveLink.className = 'btn btn-primary';
            links.appendChild(liveLink);
        }

        const repoLink = document.createElement('a');
        repoLink.href = project.repoLink;
        repoLink.target = '_blank';
        repoLink.className = 'btn btn-secondary';
        repoLink.innerHTML = 'Source Code <i class="fa-brands fa-github"></i>';
        links.appendChild(repoLink);

        content.appendChild(links);
        projectCard.appendChild(content);

        featuredList.appendChild(projectCard);
    });

    featuredSection.appendChild(featuredList);
    parentElement.appendChild(featuredSection);
}