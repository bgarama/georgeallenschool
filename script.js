 <!-- DYNAMIC ROUTER CONTAINER (Pages load inside here) -->
    <div id="content-app"></div>

    <!-- GLOBAL FOOTER SECTION -->
    <footer>
        <div class="footer-motto">George Allen School &mdash; "The Sky Is The Limit"</div>
        <p>&copy; 2026 George Allen School. All rights reserved.</p>
        <p>Silala, Ganze, Kilifi County, Kenya</p>
        <p class="powered-by">Powered by <strong>Baha Digital Innovation Hub</strong></p>
    </footer>

    <!-- INTERACTIVITY CONTROL JAVASCRIPT -->
    <script>
        // Simple client-side routing system
        const routes = {
            home: 'home.html',
            gallery: 'gallery.html'
        };

        async function loadPage(pageName) {
            const container = document.getElementById('content-app');
            const targetUrl = routes[pageName] || routes.home;

            try {
                const response = await fetch(targetUrl);
                if (!response.ok) throw new Error('Page not found');
                
                const htmlContent = await response.text();
                container.innerHTML = htmlContent;

                // Update active class visibility on the navigation items
                document.querySelectorAll('.nav-links a').forEach(link => {
                    if (link.getAttribute('data-page') === pageName) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // Scroll back to top on page switch
                window.scrollTo(0, 0);

            } catch (error) {
                container.innerHTML = `<div class="container"><p style="text-align:center; padding: 4rem 0; color: red;">Error loading page content. Please try again later.</p></div>`;
                console.error(error);
            }
        }

        // Event listener for click actions on navigation links
        document.querySelectorAll('.nav-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = button.getAttribute('data-page');
                window.location.hash = targetPage;
                loadPage(targetPage);
            });
        });

        // Track and load appropriate view based on URL hashes
        window.addEventListener('DOMContentLoaded', () => {
            const initialHash = window.location.hash.replace('#', '') || 'home';
            loadPage(initialHash);
        });

        window.addEventListener('hashchange', () => {
            const updateHash = window.location.hash.replace('#', '') || 'home';
            loadPage(updateHash);
        });
    </script>
