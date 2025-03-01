export default function createFooter(parentElement) {
    const footer = document.createElement('footer');
    footer.className = 'site-footer';


    const footerNav = document.createElement('nav');
    const footerLinks = [
        {name: 'Source (GitHub)', link: 'https://github.com/M4rcusBC/marcusbc.com', target: '_blank'},
        {name: 'Sitemap', link: './sitemap.html', target: '_self'},
        {name: 'Privacy Policy', link: './privacy-policy.html', target: '_self'}
    ];

    footerLinks.forEach(fl => {
        const a = document.createElement('a');
        a.textContent = fl.name;
        a.href = fl.link;
        a.target = fl.target;
        footerNav.appendChild(a);
        if (fl.target === '_blank') {
            a.textContent += ' ';
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-arrow-up-right-from-square';
            a.appendChild(icon);
        }
    });

    footer.appendChild(footerNav);

    const footerLegal = document.createElement('div');
    footerLegal.className = 'footer-legal';
    footerLegal.textContent = '© 2025 Marcus Clements. All rights reserved.';
    footer.appendChild(footerLegal);

    parentElement.appendChild(footer);
}