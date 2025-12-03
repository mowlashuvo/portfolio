// Google Analytics configuration and event tracking
// Replace YOUR_GA_ID with your actual Google Analytics ID

// Initialize Google Analytics events
function initializeAnalytics() {
    // Track page views (automatically done by GA script)
    
    // Track section views using Intersection Observer
    const sections = document.querySelectorAll('section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
                const sectionId = entry.target.getAttribute('id');
                if (window.gtag) {
                    window.gtag('event', 'section_view', {
                        'section': sectionId,
                        'title': entry.target.querySelector('.section-title')?.textContent || sectionId
                    });
                }
            }
        });
    }, { threshold: 0.25 });
    
    sections.forEach(section => sectionObserver.observe(section));
}

// Track CTA button clicks
function trackButtonClicks() {
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function() {
            if (window.gtag) {
                window.gtag('event', 'button_click', {
                    'button_text': this.textContent.trim(),
                    'button_class': this.className,
                    'link_target': this.href || 'none'
                });
            }
        });
    });
}

// Track form submissions
function trackFormSubmissions() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (window.gtag) {
                window.gtag('event', 'form_submission', {
                    'form_name': this.name || 'contact_form',
                    'timestamp': new Date().toISOString()
                });
            }
        });
    }
}

// Track external link clicks
function trackExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.addEventListener('click', function() {
            if (window.gtag) {
                window.gtag('event', 'external_link_click', {
                    'link_url': this.href,
                    'link_text': this.textContent.trim()
                });
            }
        });
    });
}

// Track social media link clicks
function trackSocialLinks() {
    document.querySelectorAll('.social-links a').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.getAttribute('title') || this.className;
            if (window.gtag) {
                window.gtag('event', 'social_link_click', {
                    'platform': platform,
                    'url': this.href
                });
            }
        });
    });
}

// Track theme toggles
function trackThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            if (window.gtag) {
                window.gtag('event', 'theme_change', {
                    'theme': newTheme
                });
            }
        });
    }
}

// Track project slider interactions
function trackSliderInteractions() {
    document.querySelectorAll('.slider-nav, .slider-dot').forEach(control => {
        control.addEventListener('click', function() {
            if (window.gtag) {
                const slider = this.closest('.project-slider');
                const projectTitle = slider?.closest('.project-card')?.querySelector('.project-content h3')?.textContent || 'unknown';
                
                let actionType = 'slider_interaction';
                if (this.classList.contains('prev')) actionType = 'slider_prev';
                else if (this.classList.contains('next')) actionType = 'slider_next';
                else if (this.classList.contains('slider-dot')) actionType = 'slider_dot';
                
                window.gtag('event', actionType, {
                    'project': projectTitle
                });
            }
        });
    });
}

// Initialize all tracking when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeAnalytics();
    trackButtonClicks();
    trackFormSubmissions();
    trackExternalLinks();
    trackSocialLinks();
    trackThemeToggle();
    trackSliderInteractions();
});
