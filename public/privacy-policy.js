import { loadNav, loadFooter } from './shared.js';
import { addCookieNotice } from './cookieNotice.js';

document.addEventListener('DOMContentLoaded', () => {
    loadNav();

    const main = document.createElement('main');
    document.body.appendChild(main);

    createPrivacyContent(main);

    loadFooter(document.body);

    // Back to top button
    const jumpToTopButton = document.createElement('button');
    jumpToTopButton.className = 'jump-to-top';
    jumpToTopButton.innerHTML = '&#8679;';
    document.body.appendChild(jumpToTopButton);

    jumpToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0 });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            jumpToTopButton.style.display = 'block';
        } else {
            jumpToTopButton.style.display = 'none';
        }
    });

    // Add cookie notice
    addCookieNotice();
});

function createPrivacyContent(parentElement) {
    const privacySection = document.createElement('section');
    privacySection.className = 'privacy-content';
    privacySection.id = 'privacy';

    const title = document.createElement('h1');
    title.textContent = 'Privacy Policy';
    privacySection.appendChild(title);

    const lastUpdated = document.createElement('p');
    lastUpdated.className = 'last-updated';
    lastUpdated.textContent = 'Last Updated: March 1, 2025';
    privacySection.appendChild(lastUpdated);

    const content = document.createElement('div');
    content.className = 'policy-content';
    content.innerHTML = `
        <p>Thank you for visiting marcusbc.com. This Privacy Policy explains how I collect, use, disclose, and safeguard your information when you visit my website.</p>
        
        <h2>Information Collection</h2>
        
        <h3>Personal Data</h3>
        <p>While using my Website, I may ask you to provide me with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
        <ul>
            <li>A username you sign up with for the purposes of authentication</li>
            <li>Any message content when using the contact form will be saved in a log pending my review and response</li>
        </ul>
        
        <h3>Usage Data</h3>
        <p>I may also collect information on how the Website is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of my Website that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</p>
        
        <h3>Tracking & Cookies Data</h3>
        <p>I use cookies and similar tracking technologies to track activity on my Website and hold certain information.</p>
        <p>Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.</p>
        <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of my Website.</p>
        
        <h2>Use of Data</h2>
        <p>I may use the collected data for only the following purposes:</p>
        <ul>
            <li>To provide customer support</li>
            <li>To provide analysis or other valuable information for the purpose of improving the Website</li>
            <li>To monitor the usage of the Website</li>
            <li>To detect, prevent and address technical issues on the site or the infrastructure it is hosted on</li>
        </ul>
        
        <h2>Transfer of Data</h2>
        <p>The information you provide to this site may be stored on and transferred between computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.</p>
        
        <h2>Security of Data</h2>
        <p>While I strive to use commercially acceptable means to protect your Personal Data, I cannot guarantee its absolute security. This site is proxied behind the Cloudflare network, so your trust is primarily instilled in them.</p>
        
        <h2>Links to Other Sites</h2>
        <p>My Website may contain links to other sites that are not operated by me. If you click on a third-party link, you will be directed to that third party's site. I strongly advise you to review the Privacy Policy of every site you visit.</p>
        <p>I have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.</p>
        
        <h2>Changes to This Privacy Policy</h2>
        <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        
        <h2>Contact Me</h2>
        <p>If you have any questions about this Privacy Policy, please contact me by visiting the contact page on my site <a href="./contact.html">here</a>.</p>
    `;

    privacySection.appendChild(content);
    parentElement.appendChild(privacySection);
}