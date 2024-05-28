document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.target.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });
        });
    });

    // Language detection and content switching
    const userLang = navigator.language || navigator.userLanguage; 
    if (userLang.startsWith('en')) {
        document.getElementById('main-title').innerText = 'Jakub Hyziak';
        document.getElementById('main-subtitle').innerText = 'Cybersecurity Student';
        document.getElementById('nav-brand').innerText = 'Portfolio';
        document.getElementById('nav-about').innerText = 'About';
        document.getElementById('nav-projects').innerText = 'Projects';
        document.getElementById('nav-education').innerText = 'Education';
        document.getElementById('nav-contact').innerText = 'Contact';
        document.getElementById('about-title').innerText = 'About Me';
        document.getElementById('about-text').innerText = 'I am a cybersecurity student at the Wyższa Szkoła Kształcenia Zawodowego, where I learn how to protect computer systems from threats. I completed my computer science education at the Teb Edukacja Technical School, where I gained solid foundations in programming and systems management.';
        document.getElementById('about-text-2').innerText = 'Currently, I am expanding my skills by taking the Google Cybersecurity Professional Certificate course and holding the CISCO IT Essentials certificate. I am interested in technologies related to information security, network analytics, and software development.';
        document.getElementById('projects-title').innerText = 'Projects';
        document.getElementById('project-1-title').innerText = 'Study Tools';
        document.getElementById('project-1-desc').innerText = 'A platform for managing study tools, supporting effective learning.';
        document.getElementById('project-1-btn').innerText = 'View Project';
        document.getElementById('project-2-title').innerText = 'Stay Focused';
        document.getElementById('project-2-desc').innerText = 'A time and focus management application that helps achieve goals.';
        document.getElementById('project-2-btn').innerText = 'View Project';
        document.getElementById('project-3-title').innerText = 'OCR App 2.0';
        document.getElementById('project-3-desc').innerText = 'An optical character recognition application that facilitates document digitization.';
        document.getElementById('project-3-btn').innerText = 'View Project';
        document.getElementById('education-title').innerText = 'Education';
        document.getElementById('education-1-title').innerText = 'Wyższa Szkoła Kształcenia Zawodowego';
        document.getElementById('education-1-desc').innerText = 'Field of Study: Cybersecurity';
        document.getElementById('education-2-title').innerText = 'Teb Edukacja Technical School';
        document.getElementById('education-2-desc').innerText = 'Field of Study: Computer Science';
        document.getElementById('contact-title').innerText = 'Contact';
        document.getElementById('contact-linkedin').innerText = 'LinkedIn';
        document.getElementById('contact-github').innerText = 'GitHub';
        document.getElementById('contact-twitter').innerText = 'Twitter';
    }
});
