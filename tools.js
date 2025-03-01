import createNav from "./nav.js";
import createFooter from "./footer.js";

document.addEventListener('DOMContentLoaded', () => {
    createNav();

    const main = document.createElement('main');
    const body = document.body;
    body.appendChild(main);

    // createLayout(main);

    createFooter(document.body);

    const jumpToTopButton = document.createElement('button');
    jumpToTopButton.className = 'jump-to-top';
    jumpToTopButton.style.zIndex = '1000';
    jumpToTopButton.innerHTML = '&#8679;'; // Unicode for up arrow
    document.body.appendChild(jumpToTopButton);

    jumpToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0});
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            jumpToTopButton.style.display = 'block';
        } else {
            jumpToTopButton.style.display = 'none';
        }
    });
});