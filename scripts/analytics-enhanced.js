// ============================================
// ENHANCED ANALYTICS & TRACKING
// ============================================

class EnhancedAnalytics {
    constructor() {
        this.config = {
            gaId: 'YOUR_GA_ID', // Replace with your GA ID
            trackPageViews: true,
            trackEvents: true,
            trackScroll: true,
            trackClicks: true,
            trackForms: true,
            trackErrors: true,
            trackPerformance: true
        };
        
        this.initialized = false;
        this.scrollDepthTracked = [25, 50, 75, 90];
        this.timeOnPage = 0;
        this.pageStartTime = Date.now();
        
        this.init();
    }
    
    init() {
        if (this.initialized) return;
        
        this.loadGA();
        this.trackPageView();
        this.trackScrollDepth();
        this.trackTimeOnPage();
        this.trackClicks();
        this.trackForms();
        this.trackErrors();
        this.trackPerformance();
        this.trackCustomEvents();
        
        this.initialized = true;
    }
    
    loadGA() {
        if (!this.config.gaId || this.config.gaId === 'YOUR_GA_ID') return;
        
        // Load Google Analytics
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.gaId}`;
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());
        gtag('config', this.config.gaId, {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
        
        window.gtag = gtag;
    }
    
    trackPageView() {
        if (!this.config.trackPageViews) return;
        
        const pageData = {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            page_referrer: document.referrer || 'direct'
        };
        
        this.sendEvent('page_view', pageData);
    }
    
    trackScrollDepth() {
        if (!this.config.trackScroll) return;
        
        let maxScroll = 0;
        
        window.addEventListener('scroll', () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );
            
            this.scrollDepthTracked.forEach(depth => {
                if (scrollPercent >= depth && maxScroll < depth) {
                    maxScroll = depth;
                    this.sendEvent('scroll_depth', {
                        depth_percentage: depth,
                        scroll_percentage: scrollPercent
                    });
                }
            });
        }, { passive: true });
    }
    
    trackTimeOnPage() {
        setInterval(() => {
            this.timeOnPage += 1;
            
            // Track every 30 seconds
            if (this.timeOnPage % 30 === 0) {
                this.sendEvent('time_on_page', {
                    time_seconds: this.timeOnPage,
                    time_minutes: Math.round(this.timeOnPage / 60 * 10) / 10
                });
            }
        }, 1000);
        
        // Track when leaving page
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.round((Date.now() - this.pageStartTime) / 1000);
            this.sendEvent('page_exit', {
                time_on_page_seconds: totalTime,
                scroll_position: window.scrollY
            });
        });
    }
    
    trackClicks() {
        if (!this.config.trackClicks) return;
        
        // Track all clicks
        document.addEventListener('click', (e) => {
            const target = e.target;
            const clickData = {
                element_type: target.tagName.toLowerCase(),
                element_id: target.id || 'none',
                element_class: target.className || 'none',
                element_text: target.textContent?.trim().substring(0, 100) || 'none',
                page_x: e.pageX,
                page_y: e.pageY
            };
            
            // Special tracking for specific elements
            if (target.closest('.btn')) {
                clickData.click_type = 'button';
                const btn = target.closest('.btn');
                clickData.button_text = btn.textContent?.trim();
                clickData.button_action = this.getButtonAction(btn);
            } else if (target.closest('a')) {
                const link = target.closest('a');
                clickData.click_type = 'link';
                clickData.link_href = link.href;
                clickData.link_target = link.target || '_self';
                
                if (link.target === '_blank') {
                    clickData.link_type = 'external';
                } else if (link.href.startsWith('#')) {
                    clickData.link_type = 'anchor';
                } else {
                    clickData.link_type = 'internal';
                }
            } else if (target.closest('input, select, textarea')) {
                clickData.click_type = 'form_field';
            }
            
            this.sendEvent('click', clickData);
        });
    }
    
    getButtonAction(button) {
        if (button.closest('.hero-actions')) return 'hero_action';
        if (button.closest('.project-links')) return 'project_action';
        if (button.closest('.contact-form')) return 'contact_action';
        if (button.closest('.nav-actions')) return 'navigation_action';
        return 'general';
    }
    
    trackForms() {
        if (!this.config.trackForms) return;
        
        // Track form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                const formData = new FormData(form);
                const formFields = {};
                
                for (const [key, value] of formData.entries()) {
                    formFields[key] = value.toString().substring(0, 100);
                }
                
                this.sendEvent('form_submit', {
                    form_id: form.id || 'unnamed_form',
                    form_name: form.name || 'unnamed',
                    form_fields: Object.keys(formFields),
                    form_data: formFields
                });
            });
        });
        
        // Track form interactions
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.addEventListener('focus', () => {
                this.sendEvent('form_field_focus', {
                    field_name: field.name || 'unnamed',
                    field_type: field.type,
                    field_id: field.id || 'none'
                });
            });
            
            field.addEventListener('blur', () => {
                this.sendEvent('form_field_blur', {
                    field_name: field.name || 'unnamed',
                    field_type: field.type,
                    field_id: field.id || 'none',
                    field_value_length: field.value.length
                });
            });
        });
    }
    
    trackErrors() {
        if (!this.config.trackErrors) return;
        
        // JavaScript errors
        window.addEventListener('error', (e) => {
            this.sendEvent('error', {
                error_type: 'javascript',
                error_message: e.message.substring(0, 200),
                error_filename: e.filename,
                error_lineno: e.lineno,
                error_colno: e.colno
            });
        });
        
        // Resource errors
        window.addEventListener('error', (e) => {
            const target = e.target;
            if (target.tagName) {
                this.sendEvent('error', {
                    error_type: 'resource',
                    resource_type: target.tagName.toLowerCase(),
                    resource_src: target.src || target.href,
                    error_message: 'Failed to load resource'
                });
            }
        }, true);
        
        // Promise rejections
        window.addEventListener('unhandledrejection', (e) => {
            this.sendEvent('error', {
                error_type: 'promise_rejection',
                error_message: e.reason?.message?.substring(0, 200) || 'Unknown promise rejection',
                error_reason: e.reason?.toString().substring(0, 200)
            });
        });
    }
    
    trackPerformance() {
        if (!this.config.trackPerformance) return;
        
        // Performance metrics
        if ('PerformanceObserver' in window) {
            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                
                this.sendEvent('performance_metric', {
                    metric_name: 'LCP',
                    metric_value: Math.round(lastEntry.startTime),
                    metric_unit: 'ms'
                });
            });
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            
            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.sendEvent('performance_metric', {
                        metric_name: 'FID',
                        metric_value: Math.round(entry.processingStart - entry.startTime),
                        metric_unit: 'ms'
                    });
                }
            });
            fidObserver.observe({ entryTypes: ['first-input'] });
            
            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                }
                
                this.sendEvent('performance_metric', {
                    metric_name: 'CLS',
                    metric_value: clsValue.toFixed(3),
                    metric_unit: 'score'
                });
            });
            clsObserver.observe({ entryTypes: ['layout-shift'] });
        }
        
        // Network information
        if ('connection' in navigator) {
            const connection = navigator.connection;
            
            this.sendEvent('network_info', {
                effective_type: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                save_data: connection.saveData
            });
            
            connection.addEventListener('change', () => {
                this.sendEvent('network_change', {
                    effective_type: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt
                });
            });
        }
        
        // Device information
        this.sendEvent('device_info', {
            user_agent: navigator.userAgent.substring(0, 200),
            platform: navigator.platform,
            language: navigator.language,
            screen_resolution: `${screen.width}x${screen.height}`,
            viewport_size: `${window.innerWidth}x${window.innerHeight}`,
            device_pixel_ratio: window.devicePixelRatio,
            cookies_enabled: navigator.cookieEnabled,
            online_status: navigator.onLine
        });
    }
    
    trackCustomEvents() {
        // Theme changes
        document.addEventListener('themechange', (e) => {
            this.sendEvent('theme_change', {
                theme: e.detail.theme,
                previous_theme: e.detail.theme === 'dark' ? 'light' : 'dark'
            });
        });
        
        // Project interactions
        document.querySelectorAll('.project-card').forEach(project => {
            project.addEventListener('mouseenter', () => {
                const title = project.querySelector('.project-title')?.textContent;
                this.sendEvent('project_hover', {
                    project_title: title,
                    action: 'hover_enter'
                });
            });
            
            project.addEventListener('mouseleave', () => {
                const title = project.querySelector('.project-title')?.textContent;
                this.sendEvent('project_hover', {
                    project_title: title,
                    action: 'hover_leave'
                });
            });
            
            // Project clicks
            project.addEventListener('click', (e) => {
                if (e.target.closest('.view-details')) {
                    const title = project.querySelector('.project-title')?.textContent;
                    this.sendEvent('project_view_details', {
                        project_title: title
                    });
                }
            });
        });
        
        // Skill interactions
        document.querySelectorAll('.skill-tag, .tech-tag').forEach(tag => {
            tag.addEventListener('click', () => {
                this.sendEvent('skill_click', {
                    skill_name: tag.textContent.trim(),
                    skill_category: tag.closest('.skill-category')?.querySelector('h3')?.textContent || 'unknown'
                });
            });
        });
        
        // Social media clicks
        document.querySelectorAll('.social-link, .social-link-large').forEach(link => {
            link.addEventListener('click', () => {
                const platform = link.getAttribute('title') || 
                               link.querySelector('i').className.match(/fa-(.+)/)?.[1] || 
                               'unknown';
                
                this.sendEvent('social_click', {
                    platform: platform,
                    url: link.href,
                    location: link.closest('section')?.id || 'unknown'
                });
            });
        });
        
        // Download events
        document.querySelectorAll('[download]').forEach(link => {
            link.addEventListener('click', () => {
                this.sendEvent('download', {
                    file_name: link.getAttribute('download'),
                    file_type: link.href.split('.').pop(),
                    file_size: 'unknown' // Could be enhanced with headers
                });
            });
        });
    }
    
    sendEvent(eventName, eventParams = {}) {
        // Send to Google Analytics
        if (window.gtag) {
            gtag('event', eventName, eventParams);
        }
        
        // Also send to console for debugging
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`📊 Analytics Event: ${eventName}`, eventParams);
        }
        
        // Store in local storage for offline tracking
        this.storeOfflineEvent(eventName, eventParams);
    }
    
    storeOfflineEvent(eventName, eventParams) {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            events.push({
                timestamp: new Date().toISOString(),
                event: eventName,
                params: eventParams
            });
            
            // Keep only last 100 events
            if (events.length > 100) {
                events.splice(0, events.length - 100);
            }
            
            localStorage.setItem('analytics_events', JSON.stringify(events));
        } catch (error) {
            console.error('Failed to store offline event:', error);
        }
    }
    
    sendOfflineEvents() {
        try {
            const events = JSON.parse(localStorage.getItem('analytics_events') || '[]');
            
            if (events.length > 0 && navigator.onLine) {
                events.forEach(event => {
                    if (window.gtag) {
                        gtag('event', event.event, {
                            ...event.params,
                            offline_sync: true,
                            original_timestamp: event.timestamp
                        });
                    }
                });
                
                // Clear sent events
                localStorage.removeItem('analytics_events');
            }
        } catch (error) {
            console.error('Failed to send offline events:', error);
        }
    }
    
    // Public API
    trackConversion(conversionName, value = 0) {
        this.sendEvent('conversion', {
            conversion_name: conversionName,
            conversion_value: value,
            currency: 'USD'
        });
    }
    
    trackError(error) {
        this.sendEvent('custom_error', {
            error_name: error.name,
            error_message: error.message.substring(0, 200),
            error_stack: error.stack?.substring(0, 500)
        });
    }
    
    trackUserAction(action, details = {}) {
        this.sendEvent('user_action', {
            action: action,
            ...details
        });
    }
}

// Initialize analytics
const analytics = new EnhancedAnalytics();

// Sync offline events when coming online
window.addEventListener('online', () => {
    analytics.sendOfflineEvents();
});

// Export for debugging
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedAnalytics;
}