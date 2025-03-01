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
        <p>I may collect information about you in a variety of ways. The information I may collect via the Website includes:</p>
        
        <h3>Personal Data</h3>
        <p>While using my Website, I may ask you to provide me with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
        <ul>
            <li>Email address</li>
            <li>Name</li>
            <li>Message content when using the contact form</li>
        </ul>
        
        <h3>Usage Data</h3>
        <p>I may also collect information on how the Website is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of my Website that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.</p>
        
        <h3>Tracking & Cookies Data</h3>
        <p>I use cookies and similar tracking technologies to track activity on my Website and hold certain information.</p>
        <p>Cookies are files with a small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.</p>
        <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of my Website.</p>
        
        <h2>Use of Data</h2>
        <p>I may use the collected data for various purposes:</p>
        <ul>
            <li>To provide and maintain the Website</li>
            <li>To notify you about changes to my Website</li>
            <li>To allow you to participate in interactive features of my Website when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that I can improve the Website</li>
            <li>To monitor the usage of the Website</li>
            <li>To detect, prevent and address technical issues</li>
        </ul>
        
        <h2>Transfer of Data</h2>
        <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from your jurisdiction.</p>
        
        <h2>Security of Data</h2>
        <p>The security of your data is important to me, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While I strive to use commercially acceptable means to protect your Personal Data, I cannot guarantee its absolute security.</p>
        
        <h2>Service Providers</h2>
        <p>I may employ third-party companies and individuals to facilitate my Website ("Service Providers"), to provide the Website on my behalf, to perform Website-related services or to assist me in analyzing how my Website is used.</p>
        <p>These third parties have access to your Personal Data only to perform these tasks on my behalf and are obligated not to disclose or use it for any other purpose.</p>
        
        <h2>Links to Other Sites</h2>
        <p>My Website may contain links to other sites that are not operated by me. If you click on a third-party link, you will be directed to that third party's site. I strongly advise you to review the Privacy Policy of every site you visit.</p>
        <p>I have no control over and assume no responsibility for the content, privacy policies or practices of any third-party sites or services.</p>
        
        <h2>Children's Privacy</h2>
        <p>My Website does not address anyone under the age of 18 ("Children"). I do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your Children has provided me with Personal Data, please contact me. If I become aware that I have collected Personal Data from children without verification of parental consent, I take steps to remove that information from my servers.</p>
        
        <h2>Changes to This Privacy Policy</h2>
        <p>I may update my Privacy Policy from time to time. I will notify you of any changes by posting the new Privacy Policy on this page.</p>
        <p>I will let you know via a prominent notice on my Website, prior to the change becoming effective and update the "last updated" date at the top of this Privacy Policy.</p>
        <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>
        
        <h2>Contact Me</h2>
        <p>If you have any questions about this Privacy Policy, please contact me:</p>
        <ul>
            <li>By email: m4rcusbc@example.com</li>
            <li>By visiting the contact page on my website</li>
        </ul>
    `;

    privacySection.appendChild(content);
    parentElement.appendChild(privacySection);
}