// ================================================
// IQpanda Tecnovador - Interactive JavaScript
// Modern animations and user interactions
// ================================================

// ========== DOM Elements ==========
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');
const navLinks = document.querySelectorAll('.nav-link');
const portfolioTrack = document.getElementById('portfolioTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');
const luumiCanvas = document.getElementById('luumiCanvas');

// ========== Mobile Menu Toggle ==========
if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// ========== Sticky Header on Scroll ==========
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(0, 128, 255, 0.15)';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(0, 128, 255, 0.1)';
    }

    lastScroll = currentScroll;
});

// ========== Smooth Scroll for Navigation Links ==========
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const headerOffset = 80;
            const elementPosition = targetSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== Intersection Observer for Fade-In Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// ========== Portfolio Slider ==========
if (portfolioTrack && prevBtn && nextBtn) {
    let scrollAmount = 0;
    const slideWidth = 370; // Card width + gap

    nextBtn.addEventListener('click', () => {
        scrollAmount += slideWidth;
        const maxScroll = portfolioTrack.scrollWidth - portfolioTrack.clientWidth;

        if (scrollAmount > maxScroll) {
            scrollAmount = 0; // Loop back to start
        }

        portfolioTrack.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    prevBtn.addEventListener('click', () => {
        scrollAmount -= slideWidth;

        if (scrollAmount < 0) {
            scrollAmount = portfolioTrack.scrollWidth - portfolioTrack.clientWidth; // Loop to end
        }

        portfolioTrack.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });

    // Auto-scroll every 5 seconds
    setInterval(() => {
        nextBtn.click();
    }, 5000);
}

// ========== Blog Filters ==========
if (filterBtns.length > 0 && blogCards.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            blogCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ========== Luumi AI Avatar Animation ==========
if (luumiCanvas) {
    const luumiCtx = luumiCanvas.getContext('2d');
    const luumiWidth = luumiCanvas.width;
    const luumiHeight = luumiCanvas.height;
    let time = 0;

    function drawLuumi() {
        luumiCtx.clearRect(0, 0, luumiWidth, luumiHeight);

        const centerX = luumiWidth / 2;
        const centerY = luumiHeight / 2;

        // Outer rotating rings
        for (let i = 0; i < 3; i++) {
            const radius = 120 + (i * 30);
            const offset = time + (i * Math.PI / 3);

            luumiCtx.strokeStyle = `rgba(0, 128, 255, ${0.6 - i * 0.15})`;
            luumiCtx.lineWidth = 2;
            luumiCtx.beginPath();

            for (let angle = 0; angle < Math.PI * 2; angle += 0.1) {
                const x = centerX + Math.cos(angle + offset) * radius;
                const y = centerY + Math.sin(angle + offset) * radius;

                if (angle === 0) {
                    luumiCtx.moveTo(x, y);
                } else {
                    luumiCtx.lineTo(x, y);
                }
            }

            luumiCtx.closePath();
            luumiCtx.stroke();
        }

        // Central core with pulsing effect
        const pulseSize = 60 + Math.sin(time * 2) * 10;
        const coreGradient = luumiCtx.createRadialGradient(
            centerX, centerY, pulseSize * 0.3,
            centerX, centerY, pulseSize
        );
        coreGradient.addColorStop(0, 'rgba(139, 61, 255, 1)');
        coreGradient.addColorStop(0.5, 'rgba(0, 128, 255, 0.8)');
        coreGradient.addColorStop(1, 'rgba(0, 255, 136, 0.3)');

        luumiCtx.fillStyle = coreGradient;
        luumiCtx.beginPath();
        luumiCtx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
        luumiCtx.fill();

        // Floating data points
        for (let i = 0; i < 8; i++) {
            const angle = (Math.PI * 2 / 8) * i + time;
            const distance = 100 + Math.sin(time * 2 + i) * 20;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;

            luumiCtx.fillStyle = 'rgba(0, 255, 136, 0.8)';
            luumiCtx.beginPath();
            luumiCtx.arc(x, y, 4, 0, Math.PI * 2);
            luumiCtx.fill();

            // Connect to center
            luumiCtx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
            luumiCtx.lineWidth = 1;
            luumiCtx.beginPath();
            luumiCtx.moveTo(centerX, centerY);
            luumiCtx.lineTo(x, y);
            luumiCtx.stroke();
        }

        // "Luumi AI" text
        luumiCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        luumiCtx.font = 'bold 24px Orbitron, sans-serif';
        luumiCtx.textAlign = 'center';
        luumiCtx.textBaseline = 'middle';
        luumiCtx.fillText('Luumi AI', centerX, centerY);

        time += 0.02;
    }

    function animateLuumi() {
        drawLuumi();
        requestAnimationFrame(animateLuumi);
    }

    animateLuumi();
}

// ========== Parallax Effect on Scroll ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual, .ai-visual');

    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== CTA Button Interactions ==========
const ctaButtons = document.querySelectorAll('.btn-primary');

ctaButtons.forEach(btn => {
    btn.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-2px) scale(1.05)';
    });

    btn.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });

    btn.addEventListener('click', function () {
        // Add ripple effect
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.6)';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.animation = 'ripple 0.6s ease-out';

        this.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(20);
      opacity: 0;
    }
  }
  
  .btn {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

// ========== Service Cards Stagger Animation ==========
const serviceCards = document.querySelectorAll('.service-card');

serviceCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`;
});

// ========== Typing Effect for Hero Title ==========
function typeWriter(element, text, speed = 50) {
    let i = 0;
    const originalText = text;
    element.textContent = '';

    function type() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// Optional: Uncomment to enable typing effect on page load
// window.addEventListener('load', () => {
//   const heroTitle = document.querySelector('.hero-title');
//   if (heroTitle) {
//     const titleText = heroTitle.textContent;
//     typeWriter(heroTitle, titleText, 50);
//   }
// });

// ========== Performance Optimization ==========
// Debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy operations
const debouncedScroll = debounce(() => {
    // Scroll operations here
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ========== Initialize ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('🐼 IQpanda Tecnovador initialized successfully!');

    // Add entrance animations
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ========== Dark Mode Toggle (Optional Feature) ==========
// Uncomment to enable dark mode functionality
/*
const darkModeToggle = document.createElement('button');
darkModeToggle.textContent = '🌙';
darkModeToggle.style.cssText = `
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  background: var(--gradient-primary);
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  box-shadow: var(--shadow-lg);
  transition: all 0.3s ease;
`;

document.body.appendChild(darkModeToggle);

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
});
*/

// ========== Accessibility Enhancements ==========
// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes mobile menu
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }

    // Arrow keys for portfolio navigation
    if (e.key === 'ArrowLeft') {
        prevBtn?.click();
    }
    if (e.key === 'ArrowRight') {
        nextBtn?.click();
    }
});

// ========== Analytics & Tracking Ready ==========
// Placeholder for analytics integration
function trackEvent(eventName, eventData) {
    console.log(`Event tracked: ${eventName}`, eventData);
    // Integration point for Google Analytics, Mixpanel, etc.
}

// Track CTA clicks
ctaButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        trackEvent('CTA_Click', {
            button_text: btn.textContent,
            page_section: btn.closest('section')?.id || 'unknown'
        });
    });
});
