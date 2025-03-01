export function addCookieNotice() {
    // Check if user has already accepted cookies
    if (getCookie('cookiesAccepted') === 'true') {
        return;
    }

    // Create cookie notice element
    const cookieNotice = document.createElement('div');
    cookieNotice.className = 'cookie-notice';
    cookieNotice.innerHTML = `
        <div class="cookie-content">
            <p>This website uses cookies to enhance your browsing experience. 
               By continuing to use this site, you consent to the use of cookies in accordance with our 
               <a href="privacy-policy.html">Privacy Policy</a>.</p>
            <div class="cookie-buttons">
                <button class="btn btn-primary accept-cookies">Accept</button>
                <button class="btn btn-secondary cookie-settings">Cookie Settings</button>
            </div>
        </div>
    `;

    document.body.appendChild(cookieNotice);

    // Add event listeners
    const acceptButton = cookieNotice.querySelector('.accept-cookies');
    acceptButton.addEventListener('click', () => {
        setCookie('cookiesAccepted', 'true');
        setCookie('cookiesAcceptedDate', new Date().toISOString());
        cookieNotice.classList.add('cookie-notice-hidden');
        setTimeout(() => {
            cookieNotice.remove();
        }, 500);
    });

    const settingsButton = cookieNotice.querySelector('.cookie-settings');
    settingsButton.addEventListener('click', () => {
        showCookieSettings();
    });

    // Show cookie notice immediately
    cookieNotice.offsetHeight;
    cookieNotice.classList.add('cookie-notice-visible');
}

function setCookie(name, value, days = 365) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/;SameSite=Lax";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
    }
    return null;
}

function showCookieSettings() {
    // Create cookie settings modal
    const modal = document.createElement('div');
    modal.className = 'cookie-settings-modal';
    modal.innerHTML = `
        <div class="cookie-settings-content">
            <span class="close-modal">&times;</span>
            <h2>Cookie Settings</h2>
            <p>You can choose which cookies you want to accept. Essential cookies cannot be disabled as they are necessary for the website to function properly.</p>
            
            <div class="cookie-options">
                <div class="cookie-option">
                    <input type="checkbox" id="essential-cookies" checked disabled>
                    <label for="essential-cookies">Essential Cookies</label>
                    <p>These cookies are necessary for the website to function and cannot be disabled.</p>
                </div>
                
                <div class="cookie-option">
                    <input type="checkbox" id="analytics-cookies" checked>
                    <label for="analytics-cookies">Analytics Cookies</label>
                    <p>These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</p>
                </div>
            </div>
            
            <div class="modal-buttons">
                <button class="btn btn-primary save-preferences">Save Preferences</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Set initial checkbox state based on cookie
    const analyticsCookiesCheckbox = document.getElementById('analytics-cookies');
    analyticsCookiesCheckbox.checked = getCookie('analyticsCookies') !== 'false';

    // Add event listeners
    const closeButton = modal.querySelector('.close-modal');
    closeButton.addEventListener('click', () => {
        modal.remove();
    });

    const saveButton = modal.querySelector('.save-preferences');
    saveButton.addEventListener('click', () => {
        const analyticsCookies = document.getElementById('analytics-cookies').checked;
        setCookie('cookiesAccepted', 'true');
        setCookie('cookiesAcceptedDate', new Date().toISOString());
        setCookie('analyticsCookies', analyticsCookies.toString());

        // Remove cookie notice and modal
        const cookieNotice = document.querySelector('.cookie-notice');
        if (cookieNotice) cookieNotice.remove();
        modal.remove();
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.remove();
        }
    });
}