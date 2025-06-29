// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeTheme();
    initializeNavigation();
    initializeExperienceFilter();
    initializeCertificationCards();
    initializeIndicators();
    initializeContactForm();
    initializeBackToTop();
    initializeScrollEffects();
    initializeAOS();
    initializeCVDownload();
});

// Theme Toggle Functionality
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(icon, savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(icon, newTheme);
        
        // Add transition effect
        body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            body.style.transition = '';
        }, 300);
    });
}

function updateThemeIcon(icon, theme) {
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Navigation Functionality
function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            if (document.body.getAttribute('data-theme') === 'dark') {
                header.style.background = 'rgba(15, 23, 42, 0.98)';
            }
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            if (document.body.getAttribute('data-theme') === 'dark') {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        }
    });
}

// Experience Filter Functionality
function initializeExperienceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter timeline items
            timelineItems.forEach(item => {
                const categories = item.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    item.classList.remove('hidden');
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// Certification Cards Functionality
function initializeCertificationCards() {
    const certificationCards = document.querySelectorAll('.certification-card');
    
    certificationCards.forEach(card => {
        const header = card.querySelector('.cert-header');
        const expandBtn = card.querySelector('.expand-btn');
        
        header.addEventListener('click', function() {
            card.classList.toggle('expanded');
            
            // Animate the expansion
            const details = card.querySelector('.cert-details');
            if (card.classList.contains('expanded')) {
                details.style.maxHeight = details.scrollHeight + 'px';
            } else {
                details.style.maxHeight = '0';
            }
        });
    });
}

// Indicators Animation Functionality
function initializeIndicators() {
    const indicators = document.querySelectorAll('.indicator-card');
    let animationTriggered = false;
    
    function animateIndicators() {
        if (animationTriggered) return;
        
        indicators.forEach((indicator, index) => {
            const number = indicator.querySelector('.indicator-number');
            const progressBar = indicator.querySelector('.progress-bar');
            const target = parseInt(number.getAttribute('data-target'));
            const progress = parseInt(progressBar.getAttribute('data-progress'));
            
            // Animate number counter
            setTimeout(() => {
                animateCounter(number, 0, target, 2000);
            }, index * 200);
            
            // Animate progress bar
            setTimeout(() => {
                progressBar.style.width = progress + '%';
            }, index * 200 + 500);
        });
        
        animationTriggered = true;
    }
    
    // Trigger animation when indicators section is in view
    const indicatorsSection = document.getElementById('indicators');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateIndicators();
            }
        });
    }, { threshold: 0.5 });
    
    if (indicatorsSection) {
        observer.observe(indicatorsSection);
    }
}

function animateCounter(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Contact Form Functionality
function initializeContactForm() {
    const form = document.getElementById('contact-form');
    const formGroups = document.querySelectorAll('.form-group');
    
    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const formData = new FormData(form);
        
        // Clear previous errors
        formGroups.forEach(group => {
            group.classList.remove('error');
            const errorMessage = group.querySelector('.error-message');
            errorMessage.textContent = '';
        });
        
        // Validate each field
        const validations = {
            name: {
                required: true,
                minLength: 2,
                message: 'Nome deve ter pelo menos 2 caracteres'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Email deve ter um formato válido'
            },
            subject: {
                required: true,
                message: 'Por favor, selecione um assunto'
            },
            message: {
                required: true,
                minLength: 10,
                message: 'Mensagem deve ter pelo menos 10 caracteres'
            }
        };
        
        Object.keys(validations).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            const group = field.closest('.form-group');
            const errorMessage = group.querySelector('.error-message');
            const validation = validations[fieldName];
            const value = formData.get(fieldName).trim();
            
            if (validation.required && !value) {
                group.classList.add('error');
                errorMessage.textContent = 'Este campo é obrigatório';
                isValid = false;
            } else if (validation.minLength && value.length < validation.minLength) {
                group.classList.add('error');
                errorMessage.textContent = validation.message;
                isValid = false;
            } else if (validation.pattern && !validation.pattern.test(value)) {
                group.classList.add('error');
                errorMessage.textContent = validation.message;
                isValid = false;
            }
        });
        
        if (isValid) {
            submitForm(formData);
        }
    });
    
    // Real-time validation
    formGroups.forEach(group => {
        const input = group.querySelector('input, select, textarea');
        if (input) {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (group.classList.contains('error')) {
                    validateField(this);
                }
            });
        }
    });
}

function validateField(field) {
    const group = field.closest('.form-group');
    const errorMessage = group.querySelector('.error-message');
    const value = field.value.trim();
    
    group.classList.remove('error');
    errorMessage.textContent = '';
    
    if (field.hasAttribute('required') && !value) {
        group.classList.add('error');
        errorMessage.textContent = 'Este campo é obrigatório';
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) {
            group.classList.add('error');
            errorMessage.textContent = 'Email deve ter um formato válido';
            return false;
        }
    }
    
    return true;
}

function submitForm(formData) {
    const submitBtn = document.querySelector('#contact-form button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<div class="loading"></div> Enviando...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual submission logic)
    setTimeout(() => {
        // Reset form
        document.getElementById('contact-form').reset();
        
        // Show success message
        showSuccessMessage('Mensagem enviada com sucesso! Entrarei em contato em breve.');
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showSuccessMessage(message) {
    // Create success message element
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message show';
    successDiv.innerHTML = `
        <i class="fas fa-check-circle"></i>
        ${message}
    `;
    
    // Insert after form
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Back to Top Functionality
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Effects
function initializeScrollEffects() {
    const elements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize AOS (Animate On Scroll)
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
}

// CV Download Functionality
function initializeCVDownload() {
    const downloadBtn = document.getElementById('download-cv');
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create a temporary link to download the CV
        const link = document.createElement('a');
        link.href = './Curriculo_Joao_Paulo_Vieira_2025.pdf';
        link.download = 'Curriculo_Joao_Paulo_Vieira_2025.pdf';
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show feedback
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Download Iniciado';
        this.style.backgroundColor = 'var(--success-color)';
        
        setTimeout(() => {
            this.innerHTML = originalText;
            this.style.backgroundColor = '';
        }, 2000);
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimizations
const debouncedResize = debounce(() => {
    // Handle resize events
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}, 250);

const throttledScroll = throttle(() => {
    // Handle scroll events
    updateActiveNavLink();
}, 100);

window.addEventListener('resize', debouncedResize);
window.addEventListener('scroll', throttledScroll);

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Keyboard navigation support
document.addEventListener('keydown', function(e) {
    // ESC key to close mobile menu
    if (e.key === 'Escape') {
        const navMenu = document.querySelector('.nav-menu');
        const hamburger = document.getElementById('hamburger');
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    }
    
    // Enter key to expand certification cards
    if (e.key === 'Enter' && e.target.classList.contains('cert-header')) {
        e.target.click();
    }
});

// Accessibility improvements
function improveAccessibility() {
    // Add ARIA labels to interactive elements
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.setAttribute('aria-label', 'Alternar tema escuro/claro');
    
    const hamburger = document.getElementById('hamburger');
    hamburger.setAttribute('aria-label', 'Menu de navegação');
    
    const backToTop = document.getElementById('back-to-top');
    backToTop.setAttribute('aria-label', 'Voltar ao topo');
    
    // Add focus indicators
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--primary-color)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Initialize accessibility improvements
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Service Worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

