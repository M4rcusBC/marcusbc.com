export function showSitemap() {
    // Check if sitemap is already open
    if (document.querySelector('.sitemap-modal')) {
        return;
    }

    // Create sitemap modal element
    const sitemapModal = document.createElement('div');
    sitemapModal.className = 'sitemap-modal';
    sitemapModal.innerHTML = `
        <div class="sitemap-content">
            <span class="close-sitemap">&times;</span>
            <h2>Sitemap</h2>
            
            <div class="sitemap-sections">
                <div class="sitemap-section">
                    <h3>Main Navigation</h3>
                    <ul>
                        <li><a href="#top">Home</a></li>
                        <li><a href="#about">About Me</a></li>
                        <li><a href="#proficiencies">Proficiencies</a></li>
                        <li><a href="#projects">Projects</a></li>
                    </ul>
                </div>
                
                <div class="sitemap-section">
                    <h3>Other Pages</h3>
                    <ul>
                        <li><a href="privacy-policy.html">Privacy Policy</a></li>
                        <li><a href="./tools.html">Tools</a> </li>
                        <li><a href="./contact.html">Contact</a></li>
                    </ul>
                </div>
                
                <div class="sitemap-section">
                    <h3>Connect</h3>
                    <ul class="sitemap-social">
                        <li><a href="#"><i class="fa-brands fa-github"></i> GitHub</a></li>
                        <li><a href="#"><i class="fa-brands fa-linkedin"></i> LinkedIn</a></li>
                        <li><a href="mailto:marcus.bc@icloud.com"><i class="fa-solid fa-envelope"></i> Email</a></li>
                    </ul>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(sitemapModal);

    // Add event listeners
    const closeButton = sitemapModal.querySelector('.close-sitemap');
    closeButton.addEventListener('click', () => {
        closeSitemap(sitemapModal);
    });

    // Close modal when clicking outside content
    sitemapModal.addEventListener('click', (event) => {
        if (event.target === sitemapModal) {
            closeSitemap(sitemapModal);
        }
    });

    // Animation timing
    setTimeout(() => {
        sitemapModal.classList.add('sitemap-modal-visible');
    }, 10);
}

function closeSitemap(modal) {
    modal.classList.remove('sitemap-modal-visible');
    modal.classList.add('sitemap-modal-hidden');

    // Remove from DOM after animation completes
    setTimeout(() => {
        modal.remove();
    }, 500);
}