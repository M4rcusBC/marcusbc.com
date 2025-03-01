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
        window.scrollTo({ top: 0 });
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
    // Contact Hero Section
    const heroSection = document.createElement('section');
    heroSection.className = 'contact-hero';

    const heroContent = document.createElement('div');
    heroContent.className = 'hero-content';

    const heroTitle = document.createElement('h1');
    heroTitle.textContent = 'Get in Touch';

    const heroSubtitle = document.createElement('p');
    heroSubtitle.textContent = 'Have a question or project in mind? Let\'s talk about it!';

    heroContent.appendChild(heroTitle);
    heroContent.appendChild(heroSubtitle);
    heroSection.appendChild(heroContent);

    parentElement.appendChild(heroSection);

    // Main contact container
    const contactContainer = document.createElement('div');
    contactContainer.className = 'contact-container';

    // Form Section
    const formSection = document.createElement('section');
    formSection.className = 'form-section';

    const formTitle = document.createElement('h2');
    formTitle.textContent = 'Send a Message';
    formSection.appendChild(formTitle);

    // Create the form
    const form = document.createElement('form');
    form.id = 'contact-form';
    form.method = 'POST';
    // You can use a service like Formspree or your own backend
    form.action = '#';

    // Name field
    const nameGroup = createFormGroup('name', 'text', 'Your Name*', true);
    form.appendChild(nameGroup);

    // Email field
    const emailGroup = createFormGroup('email', 'email', 'Your Email*', true);
    form.appendChild(emailGroup);

    // Subject field
    const subjectGroup = createFormGroup('subject', 'text', 'Subject*', true);
    form.appendChild(subjectGroup);

    // Message textarea
    const messageGroup = document.createElement('div');
    messageGroup.className = 'form-group';

    const messageLabel = document.createElement('label');
    messageLabel.htmlFor = 'message';
    messageLabel.textContent = 'Your Message*';

    const messageTextarea = document.createElement('textarea');
    messageTextarea.id = 'message';
    messageTextarea.name = 'message';
    messageTextarea.rows = 6;
    messageTextarea.required = true;

    messageGroup.appendChild(messageLabel);
    messageGroup.appendChild(messageTextarea);

    form.appendChild(messageGroup);

    // Form error message container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.style.display = 'none';
    form.appendChild(errorContainer);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'submit-btn';
    submitButton.textContent = 'Send Message';

    form.appendChild(submitButton);

    // Form event listeners for validation and submission
    form.addEventListener('submit', handleFormSubmit);

    formSection.appendChild(form);

    // Social Links Section
    const socialSection = document.createElement('section');
    socialSection.className = 'social-section';

    const socialTitle = document.createElement('h2');
    socialTitle.textContent = 'Connect With Me';
    socialSection.appendChild(socialTitle);

    const socialText = document.createElement('p');
    socialText.textContent = 'Feel free to reach out through any of these platforms:';
    socialSection.appendChild(socialText);

    // Social links
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';

    const socialPlatforms = [
        {
            name: 'Email',
            icon: 'fa-solid fa-envelope',
            url: 'mailto:contact@marcusbc.com',
            color: '#e74c3c'
        },
        {
            name: 'LinkedIn',
            icon: 'fa-brands fa-linkedin-in',
            url: 'https://www.linkedin.com/in/your-profile',
            color: '#0077b5'
        },
        {
            name: 'GitHub',
            icon: 'fa-brands fa-github',
            url: 'https://github.com/M4rcusBC',
            color: '#333'
        },
        {
            name: 'Twitter',
            icon: 'fa-brands fa-twitter',
            url: 'https://twitter.com/your-handle',
            color: '#1da1f2'
        },
        {
            name: 'Instagram',
            icon: 'fa-brands fa-instagram',
            url: 'https://instagram.com/your-profile',
            color: '#e1306c'
        }
    ];

    socialPlatforms.forEach(platform => {
        const socialLink = document.createElement('a');
        socialLink.href = platform.url;
        socialLink.className = 'social-link';
        socialLink.target = '_blank';
        socialLink.rel = 'noopener noreferrer';
        socialLink.setAttribute('data-platform', platform.name.toLowerCase());

        const socialIcon = document.createElement('i');
        socialIcon.className = platform.icon;
        socialIcon.style.color = platform.color;

        const socialName = document.createElement('span');
        socialName.textContent = platform.name;

        socialLink.appendChild(socialIcon);
        socialLink.appendChild(socialName);
        socialLinks.appendChild(socialLink);
    });

    socialSection.appendChild(socialLinks);

    // Additional contact info
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';

    const locationInfo = document.createElement('div');
    locationInfo.className = 'info-item';

    const locationIcon = document.createElement('i');
    locationIcon.className = 'fa-solid fa-location-dot';

    const locationText = document.createElement('span');
    locationText.textContent = 'Based in San Francisco, CA';

    locationInfo.appendChild(locationIcon);
    locationInfo.appendChild(locationText);
    contactInfo.appendChild(locationInfo);

    const availabilityInfo = document.createElement('div');
    availabilityInfo.className = 'info-item';

    const availabilityIcon = document.createElement('i');
    availabilityIcon.className = 'fa-solid fa-clock';

    const availabilityText = document.createElement('span');
    availabilityText.textContent = 'Available for freelance projects';

    availabilityInfo.appendChild(availabilityIcon);
    availabilityInfo.appendChild(availabilityText);
    contactInfo.appendChild(availabilityInfo);

    socialSection.appendChild(contactInfo);

    // Add sections to container
    contactContainer.appendChild(formSection);
    contactContainer.appendChild(socialSection);
    parentElement.appendChild(contactContainer);

    // FAQ Section
    const faqSection = document.createElement('section');
    faqSection.className = 'faq-section';

    const faqTitle = document.createElement('h2');
    faqTitle.textContent = 'Frequently Asked Questions';
    faqSection.appendChild(faqTitle);

    const faqList = document.createElement('div');
    faqList.className = 'faq-list';

    const faqs = [
        {
            question: 'What services do you offer?',
            answer: 'I specialize in web development, software engineering, and UI/UX design. My expertise includes front-end development with React, back-end development with Node.js, and full-stack applications.'
        },
        {
            question: 'How quickly can you complete a project?',
            answer: 'Project timelines vary based on complexity and scope. Typically, small projects take 1-2 weeks, while larger ones might take 1-3 months. I\'ll provide a detailed timeline during our initial consultation.'
        },
        {
            question: 'Do you offer maintenance services after project completion?',
            answer: 'Yes, I offer maintenance packages to ensure your application stays up-to-date and functions properly. These can be arranged on monthly or quarterly bases depending on your needs.'
        },
        {
            question: 'How do you handle project payment?',
            answer: 'I typically work with a 50% upfront deposit and the remaining 50% upon project completion. For larger projects, we can arrange milestone-based payments.'
        }
    ];

    faqs.forEach((faq, index) => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';

        const question = document.createElement('div');
        question.className = 'faq-question';
        question.textContent = faq.question;

        const toggle = document.createElement('span');
        toggle.className = 'faq-toggle';
        toggle.textContent = '+';
        question.appendChild(toggle);

        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.textContent = faq.answer;

        faqItem.appendChild(question);
        faqItem.appendChild(answer);

        question.addEventListener('click', () => {
            // Toggle active class
            const isActive = faqItem.classList.contains('active');

            // Close all FAQs
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-toggle').textContent = '+';
                const ans = item.querySelector('.faq-answer');
                ans.style.maxHeight = '0';
            });

            // If the clicked FAQ wasn't active, open it
            if (!isActive) {
                faqItem.classList.add('active');
                toggle.textContent = '−';
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });

        faqList.appendChild(faqItem);
    });

    faqSection.appendChild(faqList);
    parentElement.appendChild(faqSection);
}

function createFormGroup(id, type, labelText, isRequired = false) {
    const group = document.createElement('div');
    group.className = 'form-group';

    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;

    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    input.required = isRequired;

    group.appendChild(label);
    group.appendChild(input);

    return group;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const errorContainer = form.querySelector('.error-container');
    errorContainer.style.display = 'none';
    errorContainer.textContent = '';

    // Get form data
    const formData = new FormData(form);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !subject || !message) {
        showError(errorContainer, 'Please fill in all required fields.');
        return;
    }

    if (!validateEmail(email)) {
        showError(errorContainer, 'Please enter a valid email address.');
        return;
    }

    // Show sending state
    const submitButton = form.querySelector('.submit-btn');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual submission code)
    setTimeout(() => {
        // Show success message
        form.reset();
        submitButton.textContent = 'Message Sent!';

        // Reset button after a delay
        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 3000);

        // You would normally submit the form data to your server here
        console.log('Form submitted:', { name, email, subject, message });
    }, 1500);
}

function showError(container, message) {
    container.textContent = message;
    container.style.display = 'block';
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}