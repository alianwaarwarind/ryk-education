// CRITICAL FIX: Use 'load' event to ensure all images/fonts are measured before calculating height
window.addEventListener('load', () => {
    // --- Project Constants ---
    const TOTAL_OOSC_NEVER_ENROLLED = 451123;
    const MAX_FIGURES_TO_RENDER = 5000;
    const MAX_SCROLL_DISTANCE = 15000; 
    
    const CHILDREN_PER_FIGURE = Math.ceil(TOTAL_OOSC_NEVER_ENROLLED / MAX_FIGURES_TO_RENDER);

    // --- DOM Elements (ADDED #scroll-start-buffer) ---
    const figureContainer = document.getElementById('figure-container');
    const statusOverlay = document.getElementById('status-overlay');
    const figuresCountSpan = document.getElementById('figures-count');
    const callToActionSection = document.querySelector('.call-to-action');
    const visualizationSection = document.getElementById('visualization-section');
    const scrollStartBuffer = document.getElementById('scroll-start-buffer'); 
    const introSection = document.querySelector('.intro-section'); // Re-use introSection for initial height
    const dreamPopup = document.getElementById('click-dream-popup');

    let dreams = [];
    let figuresRendered = 0;
    let isRendering = false;

    // ... (Keep loadDreams, showRandomDream, and renderFigureBatch functions as is) ...

    // --- Step 4: Scroll Tracking Logic (FINAL GUARANTEE FIX) ---
    function handleScroll() {
        if (figuresRendered >= MAX_FIGURES_TO_RENDER) return;

        if (!introSection || !callToActionSection || !scrollStartBuffer) return;
        
        // Calculate the exact height of content *before* the visualization starts
        // CRITICAL: Get the true bottom position of the Call To Action section
        const contentBottomY = callToActionSection.getBoundingClientRect().bottom + window.scrollY;

        // The visualization starts sticking when the bottom of the Call to Action section leaves the screen.
        // The scrollDistance starts counting from the moment the visualization is fully engaged.
        const startScrollPoint = contentBottomY;
        const totalScrolled = window.scrollY;
        
        // This calculates the distance scrolled *inside* the 15,500px buffer area
        const scrollDistance = Math.max(0, totalScrolled - startScrollPoint); 
        
        // Map scroll distance to figures to render
        let targetFigures = Math.min(
            MAX_FIGURES_TO_RENDER, 
            Math.floor((scrollDistance / MAX_SCROLL_DISTANCE) * MAX_FIGURES_TO_RENDER)
        );

        let newFiguresToRender = targetFigures - figuresRendered;

        if (newFiguresToRender > 0) {
            renderFigureBatch(Math.min(newFiguresToRender, 100)); 
        }
    }
    
    // --- Initialization ---
    loadDreams();
    
    // Initial content for the status overlay
    statusOverlay.innerHTML = `Each figure represents <span class="data-point">${CHILDREN_PER_FIGURE.toLocaleString()}</span> children.`;

    // Attach the scroll listener
    window.addEventListener('scroll', handleScroll);
});
