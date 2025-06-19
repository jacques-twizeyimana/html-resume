// Main JavaScript file for personal resume website
// Handles navigation, animations, form validation, and interactive features

class ResumeWebsite {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupSkillBars();
        this.setupFormValidation();
        this.setupProjectModal();
        this.setupScrollEffects();
    }

    /**
     * Set up all event listeners for the website
     */
    setupEventListeners() {
        // Navigation toggle for mobile
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navClose = document.getElementById('nav-close');

        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.add('show-menu');
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            });
        }

        if (navClose) {
            navClose.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto'; // Restore scrolling
            });
        }

        // Close menu when clicking on nav links (mobile)
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto'; // Restore scrolling
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('show-menu') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto';
            }
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // Contact form submission
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(e.target);
            });
        }

        // Real-time form validation
        const formInputs = document.querySelectorAll('.contact__form-input');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Handle escape key for mobile menu
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
                document.body.style.overflow = 'auto';
            }
        });
    }

    /**
     * Initialize scroll-based animations
     */
    initializeAnimations() {
        // Add animation classes to elements
        const animateElements = document.querySelectorAll('.section, .project__card, .experience__data');
        animateElements.forEach(element => {
            element.classList.add('animate-on-scroll');
        });

        // Set up intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Animate skill progress bars when they come into view
     */
    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skills__percentage');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Trigger the CSS animation by adding the width
                    entry.target.style.width = entry.target.style.width || 
                        getComputedStyle(entry.target).getPropertyValue('width');
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    /**
     * Handle form validation and submission
     */
    setupFormValidation() {
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/,
                message: 'Please enter a valid name (letters only, minimum 2 characters)'
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
            },
            subject: {
                required: true,
                minLength: 5,
                maxLength: 100,
                message: 'Subject must be between 5 and 100 characters'
            },
            message: {
                required: true,
                minLength: 10,
                maxLength: 1000,
                message: 'Message must be between 10 and 1000 characters'
            }
        };
    }

    /**
     * Validate individual form field
     * @param {HTMLElement} field - The form field to validate
     * @returns {boolean} - Whether the field is valid
     */
    validateField(field) {
        const fieldName = field.getAttribute('name');
        const fieldValue = field.value.trim();
        const rules = this.validationRules[fieldName];
        const errorElement = document.getElementById(`${fieldName}-error`);

        if (!rules) return true;

        // Check if field is required and empty
        if (rules.required && !fieldValue) {
            this.showFieldError(errorElement, `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
            return false;
        }

        // Check minimum length
        if (rules.minLength && fieldValue.length < rules.minLength) {
            this.showFieldError(errorElement, rules.message);
            return false;
        }

        // Check maximum length
        if (rules.maxLength && fieldValue.length > rules.maxLength) {
            this.showFieldError(errorElement, rules.message);
            return false;
        }

        // Check pattern
        if (rules.pattern && !rules.pattern.test(fieldValue)) {
            this.showFieldError(errorElement, rules.message);
            return false;
        }

        // Field is valid
        this.clearFieldError(field);
        return true;
    }

    /**
     * Show error message for a field
     * @param {HTMLElement} errorElement - The error message element
     * @param {string} message - The error message to display
     */
    showFieldError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    /**
     * Clear error message for a field
     * @param {HTMLElement} field - The form field
     */
    clearFieldError(field) {
        const fieldName = field.getAttribute('name');
        const errorElement = document.getElementById(`${fieldName}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    /**
     * Handle form submission
     * @param {HTMLFormElement} form - The form element
     */
    handleFormSubmission(form) {
        const formData = new FormData(form);
        let isValid = true;

        // Validate all fields
        form.querySelectorAll('.contact__form-input').forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        if (isValid) {
            // Simulate form submission
            this.simulateFormSubmission(form, formData);
        } else {
            // Show general error message
            this.showNotification('Please correct the errors above', 'error');
        }
    }

    /**
     * Simulate form submission (replace with actual API call)
     * @param {HTMLFormElement} form - The form element
     * @param {FormData} formData - The form data
     */
    async simulateFormSubmission(form, formData) {
        const submitButton = form.querySelector('.contact__button');
        const originalText = submitButton.innerHTML;

        // Show loading state
        submitButton.innerHTML = '<span>Sending...</span>';
        submitButton.disabled = true;

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Success simulation
            this.showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
            form.reset();
            
        } catch (error) {
            // Error simulation
            this.showNotification('Failed to send message. Please try again later.', 'error');
        } finally {
            // Reset button state
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    }

    /**
     * Setup project modal functionality
     */
    setupProjectModal() {
        const modal = document.getElementById('project-modal');
        const modalClose = document.getElementById('modal-close');
        const projectCards = document.querySelectorAll('.project__card');

        // Project data for modal
        this.projectData = {
            1: {
                title: 'E-commerce Platform',
                image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
                description: 'A comprehensive e-commerce solution built with modern web technologies. Features include user authentication, shopping cart functionality, payment processing with Stripe integration, order management, and an admin dashboard for inventory management. The platform is fully responsive and optimized for performance.',
                technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'JWT', 'Socket.IO'],
                links: [
                    { text: 'Live Demo', url: '#', icon: 'external' },
                    { text: 'GitHub', url: '#', icon: 'github' }
                ]
            },
            2: {
                title: 'Task Management Application',
                image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800',
                description: 'A collaborative task management application with real-time updates and team collaboration features. Users can create projects, assign tasks, set deadlines, and track progress. The application includes real-time notifications, file attachments, and comprehensive reporting features.',
                technologies: ['Vue.js', 'Express.js', 'Socket.IO', 'PostgreSQL', 'Redis', 'AWS S3'],
                links: [
                    { text: 'Live Demo', url: '#', icon: 'external' },
                    { text: 'GitHub', url: '#', icon: 'github' }
                ]
            },
            3: {
                title: 'Weather Dashboard',
                image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800',
                description: 'An interactive weather dashboard that provides current weather conditions, 7-day forecasts, and historical weather data. Features beautiful data visualizations, location-based weather tracking, and weather alerts. The application uses multiple weather APIs for comprehensive data.',
                technologies: ['JavaScript', 'Chart.js', 'OpenWeather API', 'CSS Grid', 'Local Storage'],
                links: [
                    { text: 'Live Demo', url: '#', icon: 'external' },
                    { text: 'GitHub', url: '#', icon: 'github' }
                ]
            }
        };

        // Add click event to project cards
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const projectId = card.getAttribute('data-project');
                this.openProjectModal(projectId);
            });
        });

        // Close modal events
        if (modalClose) {
            modalClose.addEventListener('click', () => this.closeProjectModal());
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeProjectModal();
                }
            });
        }

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                this.closeProjectModal();
            }
        });
    }

    /**
     * Open project modal with project data
     * @param {string} projectId - The project ID
     */
    openProjectModal(projectId) {
        const modal = document.getElementById('project-modal');
        const project = this.projectData[projectId];

        if (!project || !modal) return;

        // Populate modal content
        document.getElementById('modal-img').src = project.image;
        document.getElementById('modal-img').alt = project.title;
        document.getElementById('modal-title').textContent = project.title;
        document.getElementById('modal-description').textContent = project.description;

        // Add technologies
        const technologiesContainer = document.getElementById('modal-technologies');
        technologiesContainer.innerHTML = project.technologies
            .map(tech => `<span class="project__tech">${tech}</span>`)
            .join('');

        // Add links
        const linksContainer = document.getElementById('modal-links');
        linksContainer.innerHTML = project.links
            .map(link => `
                <a href="${link.url}" class="project__link" target="_blank">
                    <span>${link.text}</span>
                    ${this.getIconSVG(link.icon)}
                </a>
            `).join('');

        // Show modal
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close project modal
     */
    closeProjectModal() {
        const modal = document.getElementById('project-modal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    /**
     * Get SVG icon for project links
     * @param {string} iconType - The type of icon
     * @returns {string} - The SVG markup
     */
    getIconSVG(iconType) {
        const icons = {
            external: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7z"/></svg>',
            github: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
        };
        return icons[iconType] || icons.external;
    }

    /**
     * Setup scroll effects (header background, active nav links)
     */
    setupScrollEffects() {
        const header = document.getElementById('header');
        const navLinks = document.querySelectorAll('.nav__link');
        const sections = document.querySelectorAll('.section[id]');

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            // Change header background on scroll
            if (scrollY >= 50) {
                header?.classList.add('scroll-header');
            } else {
                header?.classList.remove('scroll-header');
            }

            // Highlight active navigation link
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                if (scrollY >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active-link');
                }
            });
        });
    }

    /**
     * Show notification message
     * @param {string} message - The message to display
     * @param {string} type - The type of notification ('success', 'error', 'info')
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification__content">
                <span class="notification__message">${message}</span>
                <button class="notification__close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add notification styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    max-width: 400px;
                    background: var(--card-bg);
                    border-radius: var(--border-radius);
                    box-shadow: var(--shadow-heavy);
                    border-left: 4px solid var(--primary-color);
                    z-index: var(--z-modal);
                    transform: translateX(100%);
                    transition: var(--transition);
                }
                .notification--success { border-left-color: var(--success-color); }
                .notification--error { border-left-color: var(--error-color); }
                .notification--info { border-left-color: var(--primary-color); }
                .notification__content {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem 1.5rem;
                }
                .notification__message {
                    color: var(--text-color);
                    font-weight: var(--font-medium);
                }
                .notification__close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    color: var(--text-color-light);
                    cursor: pointer;
                    margin-left: 1rem;
                }
                .notification.show {
                    transform: translateX(0);
                }
            `;
            document.head.appendChild(styles);
        }

        // Add to DOM and show
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }
        }, 5000);
    }
}

// Initialize the website when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ResumeWebsite();
});

// Additional utility functions

/**
 * Debounce function to limit function calls
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - The debounced function
 */
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

/**
 * Throttle function to limit function calls
 * @param {Function} func - The function to throttle
 * @param {number} limit - The number of milliseconds to limit
 * @returns {Function} - The throttled function
 */
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
    };
}

// Performance monitoring
if ('web-vitals' in window) {
    // Monitor Core Web Vitals if the library is available
    import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log);
        getFID(console.log);
        getFCP(console.log);
        getLCP(console.log);
        getTTFB(console.log);
    }).catch(() => {
        // Fail silently if web-vitals is not available
    });
}

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registered successfully');
            })
            .catch(registrationError => {
                console.log('ServiceWorker registration failed');
            });
    });
}