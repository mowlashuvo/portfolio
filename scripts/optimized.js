// ============================================
// OPTIMIZED JAVASCRIPT FOR PORTFOLIO
// Combined core functionality with performance optimizations
// ============================================

// Performance monitoring
const perf = {
    startTime: performance.now(),
    metrics: {},
    
    mark(name) {
        this.metrics[name] = performance.now();
    },
    
    measure(name, startMark, endMark) {
        const start = this.metrics[startMark] || this.startTime;
        const end = this.metrics[endMark] || performance.now();
        return end - start;
    },
    
    logMetrics() {
        const loadTime = performance.now() - this.startTime;
        document.getElementById('loadTime').textContent = (loadTime / 1000).toFixed(2);
        console.log(`Total load time: ${loadTime.toFixed(2)}ms`);
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    perf.mark('domReady');
    initPortfolio();
});

// Initialize everything
function initPortfolio() {
    // Set current year
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Initialize components
    initTheme();
    initNavigation();
    initAnimations();
    initCounters();
    initProjectSliders();
    initCaseStudies();
    initContactForm();
    initBackToTop();
    initInteractiveDemos();
    
    // Remove loading class
    document.body.classList.add('loaded');
    
    // Mark performance
    perf.mark('initComplete');
    const initTime = perf.measure('init', 'domReady', 'initComplete');
    console.log(`Initialization time: ${initTime.toFixed(2)}ms`);
    
    // Schedule performance logging
    setTimeout(() => perf.logMetrics(), 1000);
}

// ===== THEME MANAGEMENT =====
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    const html = document.documentElement;
    
    // Get system preference
    function getSystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }
    
    // Set theme
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        // Update toggle buttons
        const toggles = [themeToggle, mobileThemeToggle];
        toggles.forEach(toggle => {
            if (toggle) {
                toggle.setAttribute('aria-pressed', theme === 'dark');
                toggle.setAttribute('aria-label', 
                    theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
            }
        });
        
        // Dispatch event for other components
        document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));
    }
    
    // Toggle theme
    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        
        // Track theme change
        if (window.gtag) {
            gtag('event', 'theme_change', { theme: newTheme });
        }
    }
    
    // Initialize theme
    function initializeTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme');
        const systemTheme = getSystemTheme();
        
        if (savedTheme) {
            setTheme(savedTheme);
        } else {
            setTheme(systemTheme);
        }
    }
    
    // Listen for system theme changes
    if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Event listeners
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);
    
    // Initialize
    initializeTheme();
}

// ===== NAVIGATION =====
function initNavigation() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    // Toggle mobile menu
    function toggleMobileMenu() {
        const isOpen = mobileNav.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
        mobileMenuBtn.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
        
        if (isOpen) {
            mobileMenuBtn.setAttribute('aria-label', 'Close menu');
        } else {
            mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        }
    }
    
    // Close mobile menu
    function closeMobileMenu() {
        mobileNav.classList.remove('active');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileMenuBtn.setAttribute('aria-label', 'Open menu');
        document.body.style.overflow = '';
    }
    
    // Smooth scrolling for navigation links
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const header = document.getElementById('header');
                    const headerHeight = header ? header.offsetHeight : 80;
                    const offset = headerHeight + 20;
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - offset,
                        behavior: 'smooth'
                    });
                    
                    // Close mobile menu if open
                    closeMobileMenu();
                    
                    // Update active nav links
                    updateActiveNavLink(targetId);
                }
            });
        });
    }
    
    // Update active navigation link
    function updateActiveNavLink(targetId) {
        // Update desktop nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
        
        // Update mobile nav links
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === targetId) {
                link.classList.add('active');
            }
        });
    }
    
    // Highlight active section on scroll
    function initScrollSpy() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        function onScroll() {
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }
        
        window.addEventListener('scroll', onScroll);
        onScroll(); // Initial call
    }
    
    // Language switcher
    function initLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        
        langButtons.forEach(button => {
            button.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                
                // Update active button
                langButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // For now, just change text direction for demo
                if (lang === 'bn') {
                    document.body.style.direction = 'rtl';
                } else {
                    document.body.style.direction = 'ltr';
                }
                
                // Track language change
                if (window.gtag) {
                    gtag('event', 'language_change', { language: lang });
                }
            });
        });
    }
    
    // Event listeners
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    if (mobileNavClose) mobileNavClose.addEventListener('click', closeMobileMenu);
    mobileNavLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
    
    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Initialize
    initSmoothScroll();
    initScrollSpy();
    initLanguageSwitcher();
}

// ===== ANIMATIONS =====
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.expertise-card, .project-card, .blog-card, .stat').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animations
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50; // 50 frames
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 20);
    }
    
    // Start counters when they come into view
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const number = entry.target.querySelector('.stat-number');
                if (number && number.getAttribute('data-count')) {
                    const target = parseInt(number.getAttribute('data-count'));
                    animateCounter(number, target);
                    counterObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('.stat').forEach(stat => {
        counterObserver.observe(stat);
    });
}

// ===== COUNTERS =====
function initCounters() {
    // Already handled in animations
}

// ===== PROJECT SLIDERS =====
function initProjectSliders() {
    document.querySelectorAll('.project-slider').forEach((slider, sliderIndex) => {
        const images = slider.querySelectorAll('.slider-images img');
        const dotsContainer = slider.querySelector('.slider-dots');
        const prevBtn = slider.querySelector('.slider-prev');
        const nextBtn = slider.querySelector('.slider-next');
        const imagesContainer = slider.querySelector('.slider-images');
        
        if (!images.length) return;
        
        let currentIndex = 0;
        let autoSlideInterval;
        
        // Create dots
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'slider-dot';
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            
            dot.addEventListener('click', () => goToSlide(index));
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                }
            });
            
            dotsContainer.appendChild(dot);
        });
        
        function updateSlider() {
            // Move images container
            imagesContainer.style.transform = `translateX(-${currentIndex * 33.333}%)`;
            
            // Update dots
            const dots = dotsContainer.querySelectorAll('.slider-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
                dot.setAttribute('aria-current', index === currentIndex ? 'true' : 'false');
            });
            
            // Update image attributes for accessibility
            images.forEach((img, index) => {
                img.setAttribute('aria-hidden', index !== currentIndex ? 'true' : 'false');
                img.setAttribute('tabindex', index === currentIndex ? '0' : '-1');
            });
        }
        
        function goToSlide(index) {
            currentIndex = index;
            updateSlider();
            resetAutoSlide();
        }
        
        function nextSlide() {
            currentIndex = (currentIndex + 1) % images.length;
            updateSlider();
        }
        
        function prevSlide() {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateSlider();
        }
        
        function startAutoSlide() {
            autoSlideInterval = setInterval(nextSlide, 5000);
        }
        
        function resetAutoSlide() {
            clearInterval(autoSlideInterval);
            startAutoSlide();
        }
        
        // Event listeners
        if (prevBtn) prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoSlide();
        });
        
        if (nextBtn) nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoSlide();
        });
        
        // Keyboard navigation
        slider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevSlide();
                resetAutoSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextSlide();
                resetAutoSlide();
            }
        });
        
        // Pause on hover
        slider.addEventListener('mouseenter', () => clearInterval(autoSlideInterval));
        slider.addEventListener('mouseleave', startAutoSlide);
        
        // Pause on focus
        slider.addEventListener('focusin', () => clearInterval(autoSlideInterval));
        slider.addEventListener('focusout', startAutoSlide);
        
        // Initialize
        updateSlider();
        startAutoSlide();
    });
}

// ===== CASE STUDIES =====
function initCaseStudies() {
    const caseStudyHeaders = document.querySelectorAll('.case-study-header');
    
    caseStudyHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.closest('.case-study-item');
            const isActive = item.classList.contains('active');
            
            // Close all items
            document.querySelectorAll('.case-study-item').forEach(el => {
                el.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
            
            // Update aria-expanded
            const button = item.querySelector('.case-study-header');
            button.setAttribute('aria-expanded', !isActive);
        });
        
        // Keyboard support
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
    });
}

// ===== CONTACT FORM =====
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitSpinner = document.getElementById('submitSpinner');
    
    // Validation rules
    const validationRules = {
        name: {
            validate: (value) => value.trim().length >= 2,
            error: 'Name must be at least 2 characters'
        },
        email: {
            validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
            error: 'Please enter a valid email address'
        },
        subject: {
            validate: (value) => value.trim() !== '',
            error: 'Please select a subject'
        },
        message: {
            validate: (value) => value.trim().length >= 10,
            error: 'Message must be at least 10 characters'
        }
    };
    
    // Form validation
    function validateField(fieldName) {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        const errorElement = document.getElementById(`${fieldName}Error`);
        const rule = validationRules[fieldName];
        
        if (!rule.validate(field.value)) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = rule.error;
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            field.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            return true;
        }
    }
    
    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = contactForm.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => validateField(fieldName));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(fieldName);
                }
            });
        }
    });
    
    // File upload preview
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = contactForm.querySelector('input[type="file"]');
    const uploadPreview = document.getElementById('uploadPreview');
    
    if (uploadArea && fileInput) {
        uploadArea.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', () => {
            uploadPreview.innerHTML = '';
            Array.from(fileInput.files).forEach(file => {
                const previewItem = document.createElement('div');
                previewItem.className = 'upload-preview-item';
                previewItem.innerHTML = `
                    <i class="fas fa-file"></i>
                    <span>${file.name} (${formatFileSize(file.size)})</span>
                `;
                uploadPreview.appendChild(previewItem);
            });
        });
    }
    
    // Format file size
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            if (!validateField(fieldName)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            // Scroll to first error
            const firstError = contactForm.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
            return;
        }
        
        // Prepare form data
        const formData = new FormData(contactForm);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Success
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Track form submission
            if (window.gtag) {
                gtag('event', 'form_submission', {
                    form_name: 'contact',
                    form_location: 'contact_section'
                });
            }
            
            // Reset form after success
            setTimeout(() => {
                contactForm.reset();
                uploadPreview.innerHTML = '';
            }, 3000);
            
        } catch (error) {
            console.error('Form submission error:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            // Reset loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
    
    // Reset form function (for success message button)
    window.resetForm = function() {
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        contactForm.reset();
        uploadPreview.innerHTML = '';
        
        // Clear validation errors
        contactForm.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        contactForm.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    };
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial check
}

// ===== INTERACTIVE DEMOS =====
function initInteractiveDemos() {
    // Counter demo
    let counterValue = 0;
    let previousState = null;
    
    window.incrementCounter = function() {
        previousState = counterValue;
        counterValue++;
        updateCounter();
    };
    
    window.decrementCounter = function() {
        previousState = counterValue;
        if (counterValue > 0) counterValue--;
        updateCounter();
    };
    
    window.resetCounter = function() {
        previousState = counterValue;
        counterValue = 0;
        updateCounter();
    };
    
    function updateCounter() {
        document.getElementById('counterValue').textContent = counterValue;
        document.getElementById('currentState').textContent = counterValue;
        document.getElementById('previousState').textContent = previousState !== null ? previousState : 'null';
    }
    
    // Animation demo
    window.playAnimation = function(type) {
        const box = document.getElementById('animatedBox');
        box.style.animation = 'none';
        
        setTimeout(() => {
            switch(type) {
                case 'bounce':
                    box.style.animation = 'bounce 1s ease infinite';
                    break;
                case 'fade':
                    box.style.animation = 'fade 1.5s ease infinite';
                    break;
                case 'rotate':
                    box.style.animation = 'rotate 2s linear infinite';
                    break;
                case 'scale':
                    box.style.animation = 'scale 1s ease infinite';
                    break;
            }
        }, 10);
    };
    
    // Initialize with bounce animation
    playAnimation('bounce');
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function initPerformanceOptimizations() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        delete img.dataset.srcset;
                    }
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
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
    
    // Throttle resize events
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
    
    // Optimize scroll performance
    window.addEventListener('scroll', debounce(() => {
        // Heavy scroll operations here
    }, 16)); // ~60fps
    
    // Optimize resize performance
    window.addEventListener('resize', throttle(() => {
        // Heavy resize operations here
    }, 200));
}

// Initialize performance optimizations
initPerformanceOptimizations();

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    
    // Send error to analytics if available
    if (window.gtag) {
        gtag('event', 'exception', {
            description: e.error.message,
            fatal: false
        });
    }
});

// ===== PWA SUPPORT =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
            console.log('ServiceWorker registered:', registration);
        }).catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

// ===== OFFLINE SUPPORT =====
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    console.log('Application is online');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    console.log('Application is offline');
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initPortfolio,
        initTheme,
        initNavigation,
        initContactForm
    };
}