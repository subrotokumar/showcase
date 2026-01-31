function toggleMenu() {
  const menu = document.querySelector(".menu-links");
  const icon = document.querySelector(".hamburger-icon");
  menu.classList.toggle("open");
  icon.classList.toggle("open");
}

// Dark Mode Toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// Initialize dark mode from localStorage
document.addEventListener('DOMContentLoaded', () => {
  // Check dark mode preference
  const darkMode = localStorage.getItem('darkMode');
  if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
  }
  
  // Add event listeners to both toggle buttons
  const themeToggle = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', toggleDarkMode);
  }
  
  // Hide loading overlay after page loads
  setTimeout(() => {
    const loadingOverlay = document.querySelector('.loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => {
        loadingOverlay.style.display = 'none';
      }, 400);
    }
  }, 800);
  
  // Start typing animation
  type();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize scroll to top button
  initScrollToTop();
});

// Typing Animation
const roles = [
  "Software",
  "🖥️Backend",
  "♾️Kubernetes",
  "Cloud♾️DevOps"
];

const typedText = document.getElementById("typed-text");
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentRole = roles[roleIndex];
  const displayed = isDeleting
    ? currentRole.substring(0, charIndex--)
    : currentRole.substring(0, charIndex++);

  typedText.textContent = displayed;

  if (!isDeleting && charIndex === currentRole.length) {
    setTimeout(() => isDeleting = true, 1200);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
  }

  const typingSpeed = isDeleting ? 50 : 80;
  setTimeout(type, typingSpeed);
}

// Scroll Animations using Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);

  // Observe all sections and major elements
  const elementsToAnimate = document.querySelectorAll(
    'section, .details-container, .timeline-item, article, .project-card'
  );
  
  elementsToAnimate.forEach(el => {
    el.classList.add('animate-on-scroll');
    observer.observe(el);
  });
}

// Scroll to Top Button
function initScrollToTop() {
  const scrollBtn = document.getElementById('scroll-to-top');
  
  if (!scrollBtn) return;
  
  // Show/hide button based on scroll position
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when clicked
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Add smooth hover effect to skill icons
document.addEventListener('DOMContentLoaded', () => {
  const skillArticles = document.querySelectorAll('.article-container article');
  
  skillArticles.forEach(article => {
    article.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.05)';
    });
    
    article.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
    });
  });
});