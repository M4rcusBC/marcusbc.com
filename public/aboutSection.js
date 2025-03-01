export default function createEnhancedAboutSection(parentElement) {
    const aboutSection = document.createElement('section');
    aboutSection.className = 'about-me';
    aboutSection.id = 'about';

    const aboutContainer = document.createElement('div');
    aboutContainer.className = 'about-container';

    const aboutImg = document.createElement('img');
    aboutImg.className = 'profile-img';
    aboutImg.src = './assets/100_0018.JPG';
    aboutImg.alt = 'Marcus Clements';

    // Text content
    const aboutText = document.createElement('div');
    aboutText.className = 'about-text';

    const aboutTitle = document.createElement('h2');
    aboutTitle.textContent = 'About Me';
    parentElement.appendChild(aboutTitle);

    const aboutIntro = document.createElement('p');
    aboutIntro.innerHTML = 'Hello! I\'m <strong>Marcus</strong>, a computer science student at UW-La Crosse with a passion for web development and software engineering.';
    aboutText.appendChild(aboutIntro);

    const aboutDetails = document.createElement('p');
    aboutDetails.textContent = 'I love building software that solves real problems and learning new technologies. My journey in computer science began when... [your story here]';
    aboutText.appendChild(aboutDetails);

    // Personality tags
    const personalityTags = document.createElement('div');
    personalityTags.className = 'personality-tags';

    const tags = ['Problem Solver', 'Continuous Learner', 'Tech Enthusiast', 'Coffee Lover'];
    tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'personality-tag';
        tagSpan.textContent = tag;
        personalityTags.appendChild(tagSpan);
    });
    aboutText.appendChild(personalityTags);

    // Quote
    const quote = document.createElement('div');
    quote.className = 'personality-quote';
    quote.textContent = '"I believe good code is like good writing — it should be clear, concise, and tell a story."';
    aboutText.appendChild(quote);

    // Add elements to container
    aboutContainer.appendChild(aboutImg);
    aboutContainer.appendChild(aboutText);
    aboutSection.appendChild(aboutContainer);

    parentElement.appendChild(aboutSection);
}