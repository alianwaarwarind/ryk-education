document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 5000;
    const container = document.getElementById('visualization-container');
    const ali = document.getElementById('ali');
    const figures = [];
    let lastShownIndex = -1; // Performance: Track the last figure shown

    // --- 1. Create all figures (but keep them hidden) ---
    function createFigures() {
        const fragment = document.createDocumentFragment(); // Use fragment for performance
        
        for (let i = 0; i < numFigures; i++) {
            const span = document.createElement('span');
            span.className = 'figure';
            span.innerHTML = '🧍';
            
            // Set random position within the container
            span.style.position = 'absolute';
            span.style.left = `${Math.random() * 100}%`;
            span.style.top = `${Math.random() * 100}%`;
            
            span.style.opacity = '0'; // Start hidden
            
            fragment.appendChild(span);
            figures.push(span);
        }
        
        container.appendChild(fragment); // Append all at once to the DOM
    }

    // --- 2. Update visualization based on scroll ---
    function updateVisualization() {
        const scrollY = window.scrollY;
        
        // Get section heights
        const introHeight = document.getElementById('intro-section').offsetHeight;
        const outroHeight = document.getElementById('outro-section').offsetHeight;
        
        // --- Ali Fade Logic ---
        // Fade Ali out as the user scrolls past the intro's midpoint
        const aliFadeStart = introHeight / 2;
        const aliFadeEnd = introHeight;
        const aliProgress = Math.min(1, Math.max(0, (scrollY - aliFadeStart) / (aliFadeEnd - aliFadeStart)));
        ali.style.opacity = (1 - aliProgress).toString();

        
        // --- Figure Reveal Logic ---
        
        // The animation "active zone" starts when the viz is sticky (at introHeight)
        // and lasts for the *entire scrollable height of the outro section*.
        const scrollStart = introHeight;
        const animationDistance = outroHeight; // Animation progress is tied to outro's height
        
        // Calculate current scroll distance within the "active zone"
        const scrollDistance = scrollY - scrollStart;
        
        // Calculate progress as a percentage (0.0 to 1.0)
        let progress = scrollDistance / animationDistance;
        
        // Clamp progress between 0 and 1
        progress = Math.min(1, Math.max(0, progress));

        const figuresToShow = Math.floor(progress * numFigures);

        // --- Performance-Optimized Update ---
        // Only change opacity for the figures that need updating
        
        if (figuresToShow > lastShownIndex) {
            // User is scrolling down: Show new figures
            for (let i = lastShownIndex + 1; i <= figuresToShow; i++) {
                if (figures[i]) {
                    figures[i].style.opacity = '1';
                }
            }
        } else if (figuresToShow < lastShownIndex) {
            // User is scrolling up: Hide figures
            for (let i = figuresToShow + 1; i <= lastShownIndex; i++) {
                if (figures[i]) {
                    figures[i].style.opacity = '0';
                }
            }
        }
        
        lastShownIndex = figuresToShow; // Update the tracker
    }

    // --- 3. Attach Event Listeners ---
    createFigures(); // Create figures on load
    window.addEventListener('scroll', updateVisualization, { passive: true }); // Listen for scroll
    updateVisualization(); // Run once on load to set initial state
});
