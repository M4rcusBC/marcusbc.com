import { loadNav, loadFooter } from "./shared.js";
import { addCookieNotice } from "./cookieNotice.js";

document.addEventListener('DOMContentLoaded', () => {
    loadNav();

    const main = document.createElement('main');
    const body = document.body;
    body.appendChild(main);

    createLayout(main);

    loadFooter(document.body);
    addCookieNotice();

    const jumpToTopButton = document.createElement('button');
    jumpToTopButton.className = 'jump-to-top';
    jumpToTopButton.style.zIndex = '1000';
    jumpToTopButton.innerHTML = '&#8679;'; // Unicode for up arrow
    document.body.appendChild(jumpToTopButton);

    jumpToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0});
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            jumpToTopButton.style.display = 'block';
        } else {
            jumpToTopButton.style.display = 'none';
        }
    });
});

function createLayout(parentElement) {
    // Hero section for tools page
    const heroSection = document.createElement('section');
    heroSection.className = 'tools-hero';

    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';

    const heroTitle = document.createElement('h1');
    heroTitle.textContent = 'Welcome to Tools!';

    const heroSubtitle = document.createElement('p');
    heroSubtitle.textContent = 'I host and maintain these tools for the use of logged-in users who find them useful.\nThese tools are open-source and developed by myself unless otherwise indicated.';


    heroContent.appendChild(heroTitle);
    heroContent.appendChild(heroSubtitle);
    heroSection.appendChild(heroContent);

    parentElement.appendChild(heroSection);

    // Tools categories
    const toolsCategories = [
        {
            id: 'web-tools',
            title: 'Web Development Tools',
            description: 'Tools and utilities for building modern web applications',
            tools: [
                {
                    name: 'Responsive Layout Generator',
                    description: 'A tool for quickly prototyping responsive grid-based layouts with CSS',
                    image: 'images/tools/responsive-layout.png',
                    link: '#responsive-layout',
                    technologies: ['JavaScript', 'CSS Grid', 'HTML5'],
                    featured: true
                },
                {
                    name: 'CSS Animation Library',
                    description: 'A collection of reusable CSS animations for modern web projects',
                    image: 'images/tools/css-animations.png',
                    link: '#css-animations',
                    technologies: ['CSS3', 'SASS'],
                    featured: false
                },
                {
                    name: 'Web Component Toolkit',
                    description: 'Custom web components built with vanilla JavaScript',
                    image: 'images/tools/web-components.png',
                    link: '#web-components',
                    technologies: ['JavaScript', 'Web Components API'],
                    featured: true
                }
            ]
        },
        {
            id: 'data-tools',
            title: 'Data Processing Tools',
            description: 'Tools for working with data transformation and analysis',
            tools: [
                {
                    name: 'JSON Transformer',
                    description: 'A utility for converting and transforming complex JSON structures',
                    image: 'images/tools/json-transformer.png',
                    link: '#json-transformer',
                    technologies: ['JavaScript', 'Node.js'],
                    featured: true
                },
                {
                    name: 'CSV to JSON Converter',
                    description: 'Browser-based tool to convert CSV files to JSON format',
                    image: 'images/tools/csv-converter.png',
                    link: '#csv-converter',
                    technologies: ['JavaScript', 'File API'],
                    featured: false
                }
            ]
        },
        {
            id: 'dev-utils',
            title: 'Developer Utilities',
            description: 'Utilities that make software development faster and easier',
            tools: [
                {
                    name: 'Git Workflow Helper',
                    description: 'CLI tool to streamline common Git operations and workflows',
                    image: 'images/tools/git-helper.png',
                    link: '#git-helper',
                    technologies: ['Node.js', 'Git', 'CLI'],
                    featured: true
                },
                {
                    name: 'Code Snippet Manager',
                    description: 'Web app for organizing and searching code snippets',
                    image: 'images/tools/snippet-manager.png',
                    link: '#snippet-manager',
                    technologies: ['React', 'LocalStorage API'],
                    featured: false
                },
                {
                    name: 'API Request Builder',
                    description: 'Tool for building and testing API requests with visual feedback',
                    image: 'images/tools/api-builder.png',
                    link: '#api-builder',
                    technologies: ['JavaScript', 'Fetch API', 'Async/Await'],
                    featured: true
                }
            ]
        }
    ];

    // Create container for all tools
    const toolsContainer = document.createElement('div');
    toolsContainer.className = 'tools-container';

    // Process each category
    toolsCategories.forEach(category => {
        const categorySection = document.createElement('section');
        categorySection.className = 'tools-category';
        categorySection.id = category.id;

        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';

        const categoryTitle = document.createElement('h2');
        categoryTitle.textContent = category.title;

        const categoryDesc = document.createElement('p');
        categoryDesc.className = 'category-description';
        categoryDesc.textContent = category.description;

        categoryHeader.appendChild(categoryTitle);
        categoryHeader.appendChild(categoryDesc);
        categorySection.appendChild(categoryHeader);

        // Create grid for tools within category
        const toolsGrid = document.createElement('div');
        toolsGrid.className = 'tools-grid';

        // Process each tool
        category.tools.forEach(tool => {
            const toolCard = document.createElement('div');
            toolCard.className = 'tool-card';
            if (tool.featured) toolCard.classList.add('featured');

            // Tool image
            const toolImage = document.createElement('div');
            toolImage.className = 'tool-image';

            const img = document.createElement('img');
            img.src = tool.image;
            img.alt = `${tool.name} screenshot`;
            img.onerror = function() {
                this.src = 'https://placehold.co/600x400';
            };

            toolImage.appendChild(img);

            // Tool content
            const toolContent = document.createElement('div');
            toolContent.className = 'tool-content';

            const toolName = document.createElement('h3');
            toolName.textContent = tool.name;

            const toolDesc = document.createElement('p');
            toolDesc.textContent = tool.description;

            // Technologies used
            const techList = document.createElement('div');
            techList.className = 'tech-list';

            tool.technologies.forEach(tech => {
                const techTag = document.createElement('span');
                techTag.className = 'tech-tag';
                techTag.textContent = tech;
                techList.appendChild(techTag);
            });

            const toolLink = document.createElement('a');
            toolLink.href = tool.link;
            toolLink.className = 'tool-link';
            toolLink.textContent = 'View Tool';
            toolLink.target = '_blank';

            // Append all elements
            toolContent.appendChild(toolName);
            toolContent.appendChild(toolDesc);
            toolContent.appendChild(techList);
            toolContent.appendChild(toolLink);

            toolCard.appendChild(toolImage);
            toolCard.appendChild(toolContent);

            toolsGrid.appendChild(toolCard);
        });

        categorySection.appendChild(toolsGrid);
        toolsContainer.appendChild(categorySection);
    });

    // Featured project section
    const featuredSection = document.createElement('section');
    featuredSection.className = 'featured-tool-section';

    const featuredHeader = document.createElement('h2');
    featuredHeader.textContent = 'Featured Project';

    const featuredContent = document.createElement('div');
    featuredContent.className = 'featured-content';

    const featuredImg = document.createElement('img');
    featuredImg.src = 'images/tools/featured-project.png';
    featuredImg.alt = 'Featured project screenshot';

    const featuredDetails = document.createElement('div');
    featuredDetails.className = 'featured-details';

    const featuredTitle = document.createElement('h3');
    featuredTitle.textContent = 'Full-Stack Portfolio Manager';

    const featuredDesc = document.createElement('p');
    featuredDesc.textContent = 'A comprehensive tool for developers to create, manage and showcase their portfolio projects. Features include project analytics, GitHub integration, and customizable templates.';

    const featuredTechList = document.createElement('div');
    featuredTechList.className = 'tech-list featured-techs';

    ['React', 'Node.js', 'MongoDB', 'Express', 'GitHub API'].forEach(tech => {
        const techTag = document.createElement('span');
        techTag.className = 'tech-tag';
        techTag.textContent = tech;
        featuredTechList.appendChild(techTag);
    });

    const featuredCta = document.createElement('a');
    featuredCta.href = '#portfolio-manager';
    featuredCta.className = 'featured-cta';
    featuredCta.textContent = 'Explore Project';

    featuredDetails.appendChild(featuredTitle);
    featuredDetails.appendChild(featuredDesc);
    featuredDetails.appendChild(featuredTechList);
    featuredDetails.appendChild(featuredCta);

    featuredContent.appendChild(featuredImg);
    featuredContent.appendChild(featuredDetails);

    featuredSection.appendChild(featuredHeader);
    featuredSection.appendChild(featuredContent);

    // Contact for custom tools
    const customToolsSection = document.createElement('section');
    customToolsSection.className = 'custom-tools-section';

    const customToolsContent = document.createElement('div');
    customToolsContent.className = 'custom-tools-content';

    const customToolsTitle = document.createElement('h2');
    customToolsTitle.textContent = 'Need a Custom Tool?';

    const customToolsText = document.createElement('p');
    customToolsText.textContent = 'I can build custom software solutions tailored to your specific requirements. Get in touch to discuss your project needs.';

    const contactButton = document.createElement('a');
    contactButton.href = './contact.html';
    contactButton.className = 'contact-button';
    contactButton.textContent = 'Contact Me';

    customToolsContent.appendChild(customToolsTitle);
    customToolsContent.appendChild(customToolsText);
    customToolsContent.appendChild(contactButton);
    customToolsSection.appendChild(customToolsContent);

    // Append all main sections to parent element
    parentElement.appendChild(toolsContainer);
    parentElement.appendChild(featuredSection);
    parentElement.appendChild(customToolsSection);
}