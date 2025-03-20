import { loadNav, loadFooter } from "./shared.js";

document.addEventListener('DOMContentLoaded', () => {
    loadNav();
    
    // Create main content
    const main = document.createElement('main');
    document.body.appendChild(main);
    
    createLayout(main);
});

function createLayout(parentElement) {
    // Contact Hero Section
    const contactHero = document.createElement('section');
    contactHero.className = 'contact-hero';
    
    const heroTitle = document.createElement('h1');
    heroTitle.textContent = 'Get In Touch';
    contactHero.appendChild(heroTitle);
    
    const heroText = document.createElement('p');
    heroText.textContent = 'Have a question, feedback, or want to work together? I\'d love to hear from you!';
    contactHero.appendChild(heroText);
    
    parentElement.appendChild(contactHero);
    
    // Container for form and contact info
    const contactContainer = document.createElement('div');
    contactContainer.className = 'contact-container';
    parentElement.appendChild(contactContainer);

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
    // Don't set action attribute since we'll handle submission via JavaScript

    // Name field
    const nameGroup = createFormGroup('name', 'text', 'Your Name*', true);
    form.appendChild(nameGroup);

    // Contact method field (replacing email field)
    const contactGroup = document.createElement('div');
    contactGroup.className = 'form-group contact-method-group';

    // Create label wrapper to hold label and type indicator side by side
    const labelWrapper = document.createElement('div');
    labelWrapper.className = 'contact-label-wrapper';
    
    const contactLabel = document.createElement('label');
    contactLabel.htmlFor = 'contactMethod';
    contactLabel.textContent = 'Contact Method*';
    
    const methodType = document.createElement('span');
    methodType.className = 'contact-type-label';
    methodType.id = 'contact-type-label';
    
    labelWrapper.appendChild(contactLabel);
    labelWrapper.appendChild(methodType);
    contactGroup.appendChild(labelWrapper);

    const contactWrapper = document.createElement('div');
    contactWrapper.className = 'contact-input-wrapper';

    const contactInput = document.createElement('input');
    contactInput.type = 'text';
    contactInput.id = 'contactMethod';
    contactInput.name = 'contactMethod';
    contactInput.placeholder = 'Email, phone, or social handle';
    contactInput.required = true;

    const methodIcon = document.createElement('i');
    methodIcon.className = 'fa-solid fa-circle-question contact-type-icon';
    methodIcon.title = 'Enter your preferred contact method';

    contactWrapper.appendChild(contactInput);
    contactWrapper.appendChild(methodIcon);
    contactGroup.appendChild(contactWrapper);
    form.appendChild(contactGroup);

    // Add event listener to detect contact method type
    contactInput.addEventListener('input', detectContactMethod);

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

    // Add Turnstile widget container before the submit button
    const turnstileContainer = document.createElement('div');
    turnstileContainer.className = 'turnstile-container';
    turnstileContainer.id = 'contact-turnstile';
    form.appendChild(turnstileContainer);

    // Submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'submit-btn';
    submitBtn.textContent = 'Send Message';
    form.appendChild(submitBtn);

    // Error message container
    const errorContainer = document.createElement('div');
    errorContainer.className = 'error-container';
    errorContainer.style.display = 'none';
    form.appendChild(errorContainer);

    form.addEventListener('submit', handleFormSubmit);

    formSection.appendChild(form);
    contactContainer.appendChild(formSection);

    // Social/Contact Info Section
    const socialSection = document.createElement('section');
    socialSection.className = 'social-section';

    const socialTitle = document.createElement('h2');
    socialTitle.textContent = 'Connect With Me';
    socialSection.appendChild(socialTitle);

    const socialText = document.createElement('p');
    socialText.textContent = 'Feel free to reach out through any of these platforms or contact methods:';
    socialSection.appendChild(socialText);

    // Social links
    const socialLinks = document.createElement('div');
    socialLinks.className = 'social-links';

    const links = [
        { icon: 'fa-brands fa-github', name: 'GitHub', url: 'https://github.com/M4rcusBC' },
        { icon: 'fa-brands fa-linkedin', name: 'LinkedIn', url: 'https://linkedin.com/in/marcusbc' },
        { icon: 'fa-brands fa-twitter', name: 'Twitter', url: 'https://twitter.com/marcusbc' }
    ];

    links.forEach(link => {
        const socialLink = document.createElement('a');
        socialLink.href = link.url;
        socialLink.className = 'social-link';
        socialLink.target = '_blank';
        socialLink.rel = 'noopener noreferrer';

        const icon = document.createElement('i');
        icon.className = link.icon;
        
        const span = document.createElement('span');
        span.textContent = link.name;
        
        socialLink.appendChild(icon);
        socialLink.appendChild(span);
        socialLinks.appendChild(socialLink);
    });

    socialSection.appendChild(socialLinks);

    // Contact info
    const contactInfo = document.createElement('div');
    contactInfo.className = 'contact-info';

    const infoItems = [
        { icon: 'fa-solid fa-envelope', text: 'marcus@marcusbc.com' },
        { icon: 'fa-solid fa-location-dot', text: 'Prague, Czech Republic' }
    ];

    infoItems.forEach(item => {
        const infoItem = document.createElement('div');
        infoItem.className = 'info-item';
        
        const icon = document.createElement('i');
        icon.className = item.icon;
        
        const span = document.createElement('span');
        span.textContent = item.text;
        
        infoItem.appendChild(icon);
        infoItem.appendChild(span);
        contactInfo.appendChild(infoItem);
    });

    socialSection.appendChild(contactInfo);
    contactContainer.appendChild(socialSection);

    // Add FAQ section
    createFaqSection(parentElement);
    
    // Add jump to top button
    setupJumpToTopButton();
    
    loadFooter(document.body);
}

function createFormGroup(id, type, labelText, required = false) {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = labelText;
    
    const input = document.createElement('input');
    input.type = type;
    input.id = id;
    input.name = id;
    if (required) input.required = true;
    
    group.appendChild(label);
    group.appendChild(input);
    
    return group;
}

function detectContactMethod(e) {
    const value = e.target.value.trim();
    const wrapper = e.target.closest('.contact-input-wrapper');
    const icon = wrapper.querySelector('.contact-type-icon');
    const typeLabel = document.getElementById('contact-type-label');
    
    // Reset classes
    wrapper.classList.remove('type-email', 'type-phone', 'type-social', 'type-invalid');
    
    // Check for empty value
    if (!value) {
        icon.className = 'fa-solid fa-circle-question contact-type-icon';
        typeLabel.textContent = '';
        return;
    }
    
    // Detect type based on input
    if (value.includes('@') && value.includes('.')) {
        // Likely an email
        wrapper.classList.add('type-email');
        icon.className = 'fa-solid fa-envelope contact-type-icon';
        icon.title = 'Email detected';
        typeLabel.textContent = 'Email';
    } else if (/^\+?[0-9\s\-()]{7,}$/.test(value)) {
        // Likely a phone number
        wrapper.classList.add('type-phone');
        icon.className = 'fa-solid fa-phone contact-type-icon';
        icon.title = 'Phone number detected';
        typeLabel.textContent = 'Phone';
    } else if (value.startsWith('@') || value.includes('twitter.com') || value.includes('t.me') || 
               value.includes('facebook.com') || value.includes('instagram.com')) {
        // Likely a social handle
        wrapper.classList.add('type-social');
        icon.className = 'fa-solid fa-hashtag contact-type-icon';
        icon.title = 'Social media handle detected';
        typeLabel.textContent = 'Social';
    } else {
        // Invalid or unknown format
        wrapper.classList.add('type-invalid');
        icon.className = 'fa-solid fa-circle-exclamation contact-type-icon';
        icon.title = 'Unable to identify contact method type';
        typeLabel.textContent = 'Unknown';
    }
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const errorContainer = form.querySelector('.error-container');
    const submitBtn = form.querySelector('.submit-btn');
    
    // Disable the button during submission
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        // In a real implementation, you would send the form data to your server
        // For now, we'll just simulate a successful submission
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Clear the form
        form.reset();
        
        // Show success message
        errorContainer.style.display = 'block';
        errorContainer.textContent = 'Your message has been sent successfully! I\'ll get back to you soon.';
        errorContainer.style.backgroundColor = 'rgba(76, 175, 80, 0.1)';
        errorContainer.style.color = '#1b5e20';
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    } catch (error) {
        // Show error message
        errorContainer.style.display = 'block';
        errorContainer.textContent = 'There was an error sending your message. Please try again later.';
        errorContainer.style.backgroundColor = 'rgba(244, 67, 54, 0.1)';
        errorContainer.style.color = '#b71c1c';
    } finally {
        // Re-enable the button
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
}

function createFaqSection(parentElement) {
    const faqSection = document.createElement('section');
    faqSection.className = 'faq-section';
    
    const faqTitle = document.createElement('h2');
    faqTitle.textContent = 'Frequently Asked Questions';
    faqSection.appendChild(faqTitle);
    
    const faqList = document.createElement('div');
    faqList.className = 'faq-list';
    
    const faqs = [
        {
            question: 'What is the best way to contact you?',
            answer: 'The fastest way to reach me is through email at marcus@marcusbc.com. For project inquiries, please use the contact form on this page with as much detail as possible.'
        },
        {
            question: 'Do you work with clients remotely?',
            answer: 'Yes, I work with clients from all over the world. Remote collaboration has been a core part of my workflow for years, using tools like Zoom, Slack, and GitHub for seamless communication and project management.'
        },
        {
            question: 'What information should I include in my project inquiry?',
            answer: 'To get the most helpful response, please include: project goals, timeline expectations, budget range, any specific technical requirements, and how you envision working together. The more details you can provide, the better I can assess if I\'m the right fit for your project.'
        },
        {
            question: 'How quickly do you respond to inquiries?',
            answer: 'I typically respond to all inquiries within 1-2 business days. If your project is time-sensitive, please mention that in your message and I\'ll prioritize accordingly.'
        }
    ];
    
    faqs.forEach(faq => {
        const faqItem = document.createElement('div');
        faqItem.className = 'faq-item';
        
        const question = document.createElement('div');
        question.className = 'faq-question';
        question.textContent = faq.question;
        
        const toggle = document.createElement('span');
        toggle.className = 'faq-toggle';
        toggle.innerHTML = '&#9662;'; // Down arrow character
        question.appendChild(toggle);
        
        const answer = document.createElement('div');
        answer.className = 'faq-answer';
        answer.textContent = faq.answer;
        
        faqItem.appendChild(question);
        faqItem.appendChild(answer);
        faqList.appendChild(faqItem);
        
        // Add toggle functionality
        question.addEventListener('click', () => {
            faqItem.classList.toggle('active');
        });
    });
    
    faqSection.appendChild(faqList);
    parentElement.appendChild(faqSection);
}

function setupJumpToTopButton() {
    // Create jump to top button
    const jumpToTopButton = document.createElement('button');
    jumpToTopButton.className = 'jump-to-top';
    jumpToTopButton.innerHTML = '&#8679;'; // Unicode for up arrow
    jumpToTopButton.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(jumpToTopButton);

    // Add event listeners
    jumpToTopButton.addEventListener('click', () => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    });

    // Show/hide based on scroll position
    function toggleButtonVisibility() {
        if (window.scrollY > 200) {
            jumpToTopButton.style.display = 'block';
        } else {
            jumpToTopButton.style.display = 'none';
        }
    }
    
    // Initialize visibility
    toggleButtonVisibility();
    
    // Add scroll listener
    window.addEventListener('scroll', toggleButtonVisibility);
}