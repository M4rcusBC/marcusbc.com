export default function createTabsAndInfiniteCarousel(container, cardSets) {
    // Create tab buttons container
    const tabsBar = document.createElement('div');
    tabsBar.className = 'tabs-bar';
    // Create a container to hold each tab's content
    const contentArea = document.createElement('div');
    let currentIndex = 0;

    const carouselTitle = document.createElement('h3');
    carouselTitle.className = 'carousel-title';
    carouselTitle.textContent = 'Proficiencies';
    container.prepend(carouselTitle);

    cardSets.forEach((cardSet) => {
        const tabButton = document.createElement('button');
        tabButton.innerHTML = cardSet.title;
        tabButton.className = 'tab-button';
        const thisIndex = currentIndex;
        tabButton.addEventListener('click', () => {
            showTab(thisIndex);
        });
        tabsBar.appendChild(tabButton);

        const tabContent = document.createElement('div');
        tabContent.className = 'carousel';
        tabContent.style.display = 'none';

        for (let i = 0; i < 4; i++) {
            const group = document.createElement('div');
            group.className = 'group';
            if (i === 1) group.setAttribute('aria-hidden', 'true');

            cardSet.content.forEach((item) => {
                const card = document.createElement('div');
                card.className = 'card skill-card';

                // Create skill card contents with rating
                const skillContent = document.createElement('div');
                skillContent.className = 'skill-content';

                // Add icon if available
                if (item.icon) {
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'skill-icon';
                    iconDiv.innerHTML = item.icon;
                    skillContent.appendChild(iconDiv);
                }

                // Add skill name
                const skillName = document.createElement('div');
                skillName.className = 'skill-name';
                skillName.textContent = item.name || '';
                skillContent.appendChild(skillName);

                card.appendChild(skillContent);

                // Create skill rating
                if (item.level !== undefined) {
                    const skillRating = document.createElement('div');
                    skillRating.className = 'skill-rating';

                    const ratingDots = document.createElement('div');
                    ratingDots.className = 'rating-dots';

                    // Create 5 dots, fill them based on level
                    for (let j = 1; j <= 5; j++) {
                        const dot = document.createElement('span');
                        dot.className = j <= item.level ? 'dot filled' : 'dot';
                        ratingDots.appendChild(dot);
                    }

                    // Add level text
                    const levelText = document.createElement('span');
                    levelText.className = 'level-text';

                    // Convert level number to text description
                    const levelDescriptions = ['Novice', 'Beginner', 'Intermediate', 'Advanced', 'Expert'];
                    levelText.textContent = levelDescriptions[item.level - 1] || '';

                    skillRating.appendChild(ratingDots);
                    skillRating.appendChild(levelText);
                    card.appendChild(skillRating);
                }

                group.appendChild(card);
            });
            tabContent.appendChild(group);
        }

        contentArea.appendChild(tabContent);
        currentIndex++;
    });

    // Handle tab display
    function showTab(index) {
        [...contentArea.children].forEach((tab, i) => {
            tab.style.display = i === index ? 'flex' : 'none';
        });
        tabsBar.children[index].classList.add('active');
        [...tabsBar.children].forEach((button, i) => {
            if (i !== index) {
                button.classList.remove('active');
            }
        });
    }

    // Default tab
    showTab(Math.random() * cardSets.length | 0);

    // Wrap the title and tabs bar in a single container
    const titleBarContainer = document.createElement('div');
    titleBarContainer.className = 'title-bar-container';

    titleBarContainer.appendChild(carouselTitle);
    titleBarContainer.appendChild(tabsBar);

    container.appendChild(titleBarContainer);
    container.appendChild(contentArea);
}