/**
 * George Allen School - Central Website Controller
 * Handles SPA routing, dynamic content loading, active state management,
 * and mobile navigation behavior.
 */

const routes = {
    home: "pages/home.html",
    about: "pages/about.html",
    gallery: "pages/gallery.html",
    partners: "pages/partners.html",
    contact: "pages/contact.html"
};

let currentRequestId = 0;

/**
 * Updates the visual active state on the navigation bar
 * @param {string} pageId
 */
function updateNavbarActiveState(pageId) {
    const navButtons = document.querySelectorAll(".nav-btn");

    navButtons.forEach((btn) => {
        const isActive = btn.dataset.page === pageId;
        btn.classList.toggle("active", isActive);

        if (isActive) {
            btn.setAttribute("aria-current", "page");
        } else {
            btn.removeAttribute("aria-current");
        }
    });
}

/**
 * Closes the mobile menu if open
 */
function closeMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("primary-navigation");

    if (!menuToggle || !navMenu) return;

    navMenu.classList.remove("open");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
}

/**
 * Initializes the mobile navigation toggle behavior
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.getElementById("primary-navigation");
    const navButtons = document.querySelectorAll(".nav-btn");

    if (!menuToggle || !navMenu) return;

    menuToggle.addEventListener("click", () => {
        const isOpen = navMenu.classList.toggle("open");
        menuToggle.classList.toggle("active", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                closeMobileMenu();
            }
        });
    });
}

/**
 * Initializes contact form behavior after the contact page is injected
 */
function initializeContactForm() {
    const contactForm = document.querySelector(".contact-form");

    if (!contactForm) return;

    console.log("Contact form initialized.");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        alert("Thank you for reaching out. Form submission setup will be connected next.");
    });
}

/**
 * Loads page content dynamically based on the route
 * @param {string} pageId
 */
async function loadPage(pageId) {
    const contentApp = document.getElementById("content-app");

    if (!contentApp) {
        console.error("Missing #content-app container in the DOM.");
        return;
    }

    const targetPage = routes[pageId] ? pageId : "home";
    const filePath = routes[targetPage];
    const requestId = ++currentRequestId;

    updateNavbarActiveState(targetPage);

    contentApp.innerHTML = `
        <div class="loading-state">
            <p>Loading content...</p>
        </div>
    `;

    try {
        const response = await fetch(filePath, { cache: "no-cache" });

        if (!response.ok) {
            throw new Error(`Failed to load ${filePath}: ${response.status} ${response.statusText}`);
        }

        const htmlContent = await response.text();

        // Prevent outdated requests from overwriting the latest content
        if (requestId !== currentRequestId) return;

        contentApp.innerHTML = htmlContent;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        if (targetPage === "contact") {
            initializeContactForm();
        }
    } catch (error) {
        console.error("Routing error:", error);

        if (requestId !== currentRequestId) return;

        contentApp.innerHTML = `
            <div class="error-container">
                <h2>Oops! Page Content Unreachable</h2>
                <p>We are having trouble displaying this section right now. Please try again or refresh the page.</p>
            </div>
        `;
    }
}

/**
 * Resolves the current hash and loads the matching page
 */
function handleRouting() {
    const pageId = window.location.hash.replace("#", "") || "home";
    loadPage(pageId);
    closeMobileMenu();
}

/* --- Event Listeners --- */
window.addEventListener("hashchange", handleRouting);

document.addEventListener("DOMContentLoaded", () => {
    initializeMobileMenu();
    handleRouting();
});
