// Theme toggle functionality
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
const html = document.documentElement;

// Function to get system theme preference
function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }
    return 'light';
}

function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

// Set initial theme - priority: localStorage > system preference > light
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = getSystemTheme();
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(systemTheme);
    }
}

// Initialize theme on page load
initializeTheme();

// Listen for system theme changes
if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', (e) => {
        // Only update if user hasn't manually set a preference
        if (!localStorage.getItem('theme')) {
            const newSystemTheme = e.matches ? 'dark' : 'light';
            setTheme(newSystemTheme);
        }
    });
}

themeToggle.addEventListener('click', toggleTheme);
mobileThemeToggle.addEventListener('click', toggleTheme);