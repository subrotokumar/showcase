// Mobile Menu Toggle
function toggleMenu() {
  const menu = document.querySelector(".mobile-menu");
  const icon = document.querySelector(".hamburger-icon");
  if (menu.style.display === "block") {
    menu.style.display = "none";
    icon.classList.remove("open");
  } else {
    menu.style.display = "block";
    icon.classList.add("open");
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Start typing animation
  if (document.getElementById("typed-text")) {
    type();
  }

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize 3D tilt effect on project cards
  initTiltEffect();
});

// Typing Animation
const roles = [
  "Backend Engineer (Go,Java,Python)",
  "Kubernetes Administrator",
  "DevOps Engineer",
  "MLOps Engineer",
  "Cloud Architect"
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

  if (typedText) {
    typedText.textContent = displayed;
  }

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
    let delay = 0;
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.classList.contains('project-card') || entry.target.classList.contains('timeline-item')) {
          entry.target.style.transitionDelay = `${delay}s`;
          delay += 0.1;

          setTimeout(() => {
            entry.target.style.transitionDelay = '0s';
          }, (delay * 1000) + 600);
        }

        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elementsToAnimate = document.querySelectorAll('.fade-in');

  elementsToAnimate.forEach(el => {
    observer.observe(el);
  });
}

// 3D Tilt Effect for Project Cards
function initTiltEffect() {
  const projectCards = document.querySelectorAll('.project-card');

  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      if (window.innerWidth <= 768) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* =========================================================================
   TECHNICAL MASTERPIECE ADDITIONS
   ========================================================================= */

// 1. Spotlight Effect Tracker
document.addEventListener('mousemove', (e) => {
  const panels = document.querySelectorAll('.glass-panel');
  panels.forEach(panel => {
    const rect = panel.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    panel.style.setProperty('--mouse-x', `${x}px`);
    panel.style.setProperty('--mouse-y', `${y}px`);
  });
});

// 2. Glitch / Decryption Text Effect
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
const glitchElements = document.querySelectorAll('.glitch-text');

const glitchObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      let iterations = 0;
      const element = entry.target;
      const originalText = element.dataset.value;

      clearInterval(element.glitchInterval);

      element.glitchInterval = setInterval(() => {
        element.innerText = originalText.split("")
          .map((letter, index) => {
            if (index < iterations) return originalText[index];
            return letters[Math.floor(Math.random() * letters.length)]
          })
          .join("");

        if (iterations >= originalText.length) {
          clearInterval(element.glitchInterval);
        }
        iterations += 1 / 3;
      }, 30);

      glitchObserver.unobserve(element);
    }
  });
}, { threshold: 0.5 });

glitchElements.forEach(el => glitchObserver.observe(el));

// 3. Command Palette Logic
const cmdPalette = document.getElementById('command-palette');
const cmdInput = document.getElementById('cmd-input');
const cmdList = document.getElementById('cmd-list');
const cmdItems = document.querySelectorAll('.cmd-item');
const cmdOutput = document.getElementById('cmd-output');

let selectedCmdIndex = 0;

function toggleCommandPalette() {
  if (cmdPalette.classList.contains('cmd-hidden')) {
    cmdPalette.classList.remove('cmd-hidden');
    cmdInput.value = '';
    cmdOutput.style.display = 'none';
    filterCommands('');
    setTimeout(() => cmdInput.focus(), 10);
  } else {
    cmdPalette.classList.add('cmd-hidden');
  }
}

document.addEventListener('keydown', (e) => {
  // Ctrl+K or Cmd+K
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    toggleCommandPalette();
  }

  if (!cmdPalette.classList.contains('cmd-hidden')) {
    if (e.key === 'Escape') {
      toggleCommandPalette();
    }

    const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedCmdIndex = (selectedCmdIndex + 1) % visibleItems.length;
      updateCmdSelection(visibleItems);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedCmdIndex = (selectedCmdIndex - 1 + visibleItems.length) % visibleItems.length;
      updateCmdSelection(visibleItems);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (visibleItems[selectedCmdIndex]) {
        executeCommand(visibleItems[selectedCmdIndex]);
      }
    }
  }
});

if (cmdInput) {
  cmdInput.addEventListener('input', (e) => {
    filterCommands(e.target.value.toLowerCase());
  });
}

function filterCommands(query) {
  let firstVisible = -1;
  let count = 0;

  cmdItems.forEach((item, index) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(query)) {
      item.style.display = 'flex';
      if (firstVisible === -1) firstVisible = count;
      count++;
    } else {
      item.style.display = 'none';
    }
    item.classList.remove('active');
  });

  selectedCmdIndex = 0;
  const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
  if (visibleItems.length > 0) {
    visibleItems[0].classList.add('active');
  }
}

function updateCmdSelection(visibleItems) {
  visibleItems.forEach((item, i) => {
    if (i === selectedCmdIndex) item.classList.add('active');
    else item.classList.remove('active');
  });
}

function executeCommand(item) {
  const action = item.dataset.action;
  const target = item.dataset.target;

  if (action === 'goto') {
    toggleCommandPalette();
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  } else if (action === 'link') {
    window.open(target, '_blank');
    toggleCommandPalette();
  } else if (action === 'easter') {
    if (target === 'rm') {
      cmdOutput.style.display = 'block';
      cmdOutput.innerHTML = `> sudo rm -rf /<br>Permission denied: Cannot delete root directory of a 100x engineer.`;
      setTimeout(() => toggleCommandPalette(), 3000);
    }
  }
}

cmdItems.forEach((item, index) => {
  item.addEventListener('mouseenter', () => {
    const visibleItems = Array.from(cmdItems).filter(i => i.style.display !== 'none');
    selectedCmdIndex = visibleItems.indexOf(item);
    updateCmdSelection(visibleItems);
  });
  item.addEventListener('click', () => {
    executeCommand(item);
  });
});

// 4. Interactive Neural Network Canvas Background
const canvas = document.getElementById('bg-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const mouse = { x: null, y: null, radius: 150 };
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });
  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          // slightly repel
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 2;
          this.y -= (dy / distance) * force * 2;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min((width * height) / 15000, 100); // density
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function animateParticles() {
    requestAnimationFrame(animateParticles);
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255, 255, 255, ${(1 - distance / 120) * 0.3})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  initParticles();
  animateParticles();
}

// 5. Radar Chart for Skills Mastery
const radarCanvas = document.getElementById('skills-radar');
if (radarCanvas) {
  const radarCtx = radarCanvas.getContext('2d');

  // Base Data
  const axes = ['Languages', 'GenAI', 'Backend', 'Cloud', 'Data', 'Observability'];
  const baseScores = [90, 85, 95, 80, 85, 75]; // Initial baseline

  // Animation state
  let currentScores = [...baseScores];
  let targetScores = [...baseScores];
  let animationRef;

  function resizeRadar() {
    // Keep it sharp on retina displays
    const rect = radarCanvas.parentElement.getBoundingClientRect();
    const size = Math.min(rect.width, 400);
    radarCanvas.width = size * window.devicePixelRatio;
    radarCanvas.height = size * window.devicePixelRatio;
    radarCtx.scale(window.devicePixelRatio, window.devicePixelRatio);
    radarCanvas.style.width = size + 'px';
    radarCanvas.style.height = size + 'px';
    drawRadar();
  }

  function drawRadar() {
    const size = parseFloat(radarCanvas.style.width);
    const center = size / 2;
    const radius = size * 0.35;

    radarCtx.clearRect(0, 0, size, size);

    // Draw grid rings
    radarCtx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    radarCtx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      radarCtx.beginPath();
      for (let j = 0; j < axes.length; j++) {
        const angle = (Math.PI * 2 * j) / axes.length - Math.PI / 2;
        const r = radius * (i / 5);
        const x = center + Math.cos(angle) * r;
        const y = center + Math.sin(angle) * r;
        if (j === 0) radarCtx.moveTo(x, y);
        else radarCtx.lineTo(x, y);
      }
      radarCtx.closePath();
      radarCtx.stroke();
    }

    // Draw axes
    radarCtx.textAlign = 'center';
    radarCtx.textBaseline = 'middle';
    radarCtx.font = '12px "Space Mono", monospace';

    for (let j = 0; j < axes.length; j++) {
      const angle = (Math.PI * 2 * j) / axes.length - Math.PI / 2;
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;

      radarCtx.beginPath();
      radarCtx.moveTo(center, center);
      radarCtx.lineTo(x, y);
      radarCtx.stroke();

      // Labels
      radarCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const labelX = center + Math.cos(angle) * (radius + 25);
      const labelY = center + Math.sin(angle) * (radius + 25);
      radarCtx.fillText(axes[j], labelX, labelY);
    }

    // Draw Data Polygon
    radarCtx.beginPath();
    for (let j = 0; j < axes.length; j++) {
      const angle = (Math.PI * 2 * j) / axes.length - Math.PI / 2;
      const scoreRatio = currentScores[j] / 100;
      const r = radius * scoreRatio;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;
      if (j === 0) radarCtx.moveTo(x, y);
      else radarCtx.lineTo(x, y);
    }
    radarCtx.closePath();
    radarCtx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    radarCtx.fill();
    radarCtx.strokeStyle = '#3b82f6';
    radarCtx.lineWidth = 2;
    radarCtx.stroke();

    // Draw Data Points
    radarCtx.fillStyle = '#f4f4f5';
    for (let j = 0; j < axes.length; j++) {
      const angle = (Math.PI * 2 * j) / axes.length - Math.PI / 2;
      const scoreRatio = currentScores[j] / 100;
      const r = radius * scoreRatio;
      const x = center + Math.cos(angle) * r;
      const y = center + Math.sin(angle) * r;

      radarCtx.beginPath();
      radarCtx.arc(x, y, 4, 0, Math.PI * 2);
      radarCtx.fill();
    }
  }

  function animateRadar() {
    let needsUpdate = false;
    for (let i = 0; i < currentScores.length; i++) {
      const diff = targetScores[i] - currentScores[i];
      if (Math.abs(diff) > 0.5) {
        currentScores[i] += diff * 0.1;
        needsUpdate = true;
      } else {
        currentScores[i] = targetScores[i];
      }
    }

    drawRadar();

    if (needsUpdate) {
      animationRef = requestAnimationFrame(animateRadar);
    }
  }

  function highlightAxis(axisName) {
    if (!axisName) {
      targetScores = [...baseScores];
    } else {
      targetScores = axes.map((a, i) => a === axisName ? 100 : baseScores[i] * 0.6);
    }
    cancelAnimationFrame(animationRef);
    animateRadar();
  }

  window.addEventListener('resize', resizeRadar);
  setTimeout(resizeRadar, 100);

  // Bind hover events
  const skillPanels = document.querySelectorAll('.skill-category[data-category]');
  skillPanels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      highlightAxis(panel.dataset.category);
    });
    panel.addEventListener('mouseleave', () => {
      highlightAxis(null);
    });
  });
}

// 6. Premium Interactivity Pack: Custom Cursor & Parallax Grid
const cursorDot = document.getElementById('cursor-dot');
const cursorOutline = document.getElementById('cursor-outline');
const bgGrid = document.getElementById('bg-grid');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let outlineX = mouseX;
let outlineY = mouseY;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (cursorDot) {
    cursorDot.style.top = mouseY + 'px';
    cursorDot.style.left = mouseX + 'px';
  }

  // Grid Parallax
  if (bgGrid) {
    const xRatio = (mouseX / window.innerWidth - 0.5) * 2; // -1 to 1
    const yRatio = (mouseY / window.innerHeight - 0.5) * 2;
    bgGrid.style.transform = `translate(${xRatio * -30}px, ${yRatio * -30}px)`;
  }
});

// Animate outline for smooth trailing effect
function animateCursor() {
  const dx = mouseX - outlineX;
  const dy = mouseY - outlineY;

  outlineX += dx * 0.4; // Increased from 0.15 for faster tracking
  outlineY += dy * 0.4;

  if (cursorOutline) {
    cursorOutline.style.top = outlineY + 'px';
    cursorOutline.style.left = outlineX + 'px';
  }

  requestAnimationFrame(animateCursor);
}
if (cursorOutline) animateCursor();

// Magnetic Hover Effect
const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-category, .cmd-item');
interactiveElements.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorOutline) cursorOutline.classList.add('hover-state');
  });
  el.addEventListener('mouseleave', () => {
    if (cursorOutline) cursorOutline.classList.remove('hover-state');
  });
});