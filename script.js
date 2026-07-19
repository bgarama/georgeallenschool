/**
 * George Allen School - Central Website Controller
 * Handles SPA Routing, Dynamic Content Loading, and Active State Management
 */

const contentApp = document.getElementById('content-app');
const navButtons = document.querySelectorAll('.nav-btn');

// Object mapping route hashes to their respective local file paths
const routes = {
    'home': 'pages/home.html',
    'about': 'pages/about.html',
    'gallery': 'pages/gallery.html',
    'partners': 'pages/partners.html',
    'contact': 'pages/contact.html'
};

/**
 * Updates the visual active state on the navigation bar
 * @param {string} pageId - The current active page identifier
 */
function updateNavbarActiveState(pageId) {
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

/**
 * Fetches and injects page content dynamically based on the current route
 * @param {string} pageId - The targeted page to load
 */
async function loadPage(pageId) {
    // Default fallback to home if pageId doesn't exist in our route register
    const targetPage = routes[pageId] ? pageId : 'home';
    const filePath = routes[targetPage];

    updateNavbarActiveState(targetPage);

    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to load: ${response.statusText}`);
        }
        const htmlContent = await response.text();
        contentApp.innerHTML = htmlContent;

        // Automatically scroll to the top of the viewport when content changes
        window.scrollTo(0, 0);

        // Optional hook: If we just loaded the contact page, initialize form bindings
        if (targetPage === 'contact') {
            initializeContactForm();
        }

    } catch (error) {
        console.error("Routing error:", error);
        contentApp.innerHTML = `
            <div class="error-container" style="text-align: center; padding: 50px 20px;">
                <h2>Oops! Page Content Unreachable</h2>
                <p>We are having trouble displaying this section right now. Please try again or refresh the page.</p>
            </div>
        `;
    }
}

/**
 * Evaluates the window hash to match browser navigation changes
 */
function handleRouting() {
    // Get hash, remove the '#' symbol, and default to empty string if missing
    let pageId = window.location.hash.substring(1);
    
    if (!pageId) {
        pageId = 'home';
    }
    
    loadPage(pageId);
}

/**
 * Setup placeholder for any interactive elements inside loaded pages
 * (e.g., handling contact form animations or extra listeners after injection)
 */
function initializeContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        console.log("Contact form actions hooked up successfully.");
    }
}

// --- EVENT LISTENERS ---

// Trigger router evaluation whenever the window URL hash alters
window.addEventListener('hashchange', handleRouting);

// Trigger initial route parsing on page refresh/load
document.addEventListener('DOMContentLoaded', () => {
    handleRouting();
    
    // Explicit click listener for navigation buttons to guarantee smoothness
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const pageTarget = btn.getAttribute('data-page');
            window.location.hash = pageTarget;
        });
    });
});
