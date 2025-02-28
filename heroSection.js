export default function createHeroSection(parentElement) {
    const heroSection = document.createElement('section');
    heroSection.className = 'hero';

    const heading = document.createElement('h1');
    heading.textContent = 'Marcus Clements';

    const tagline = document.createElement('p');
    tagline.className = 'hero-tagline';
    tagline.textContent = 'Computer Science Student & Web Developer';

    const ctaButton = document.createElement('a');
    ctaButton.href = '#projects';
    ctaButton.className = 'btn btn-primary';
    ctaButton.innerHTML = 'View My Work <i class="fa-solid fa-chevron-down"></i>';

    heroSection.appendChild(heading);
    heroSection.appendChild(tagline);
    heroSection.appendChild(ctaButton);

    parentElement.insertBefore(heroSection, parentElement.firstChild);
}