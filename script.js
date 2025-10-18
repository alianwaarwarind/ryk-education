document.addEventListener('DOMContentLoaded', () => {
    // --- Project Constants ---
    const TOTAL_OOSC_NEVER_ENROLLED = 451123; // The key figure from your data
    const MAX_FIGURES_TO_RENDER = 5000;      // Max number of dots we will actually draw
    const CHILDREN_PER_FIGURE = Math.ceil(TOTAL_OOSC_NEVER_ENROLLED / MAX_FIGURES_TO_RENDER);

    // --- DOM Elements ---
    const figureContainer = document.getElementById('figure-container');
    const statusOverlay = document.getElementById('status-overlay');
    const figuresCountSpan = document.getElementById('figures-count');
    const callToActionSection = document.querySelector('.call-to-action');
    const visualizationSection = document.getElementById('visualization-section');
    const dreamPopup = document.getElementById('click-dream-popup');

    let dreams = [];
    let figuresRendered = 0;
    let isRendering = false;

    // --- Step 1: Load Dreams Data ---
    async function loadDreams() {
        try {
            const response = await fetch('./data/dreams.json');
            dreams = await response.json();
            dreamPopup.innerHTML = 'Click a figure to reveal a dream.';
        } catch (error) {
            console.error('Failed to load dreams data:', error);
            dreamPopup.innerHTML = 'Error: Could not load dream data.';
        }
    }

    // --- Step 2: Handle Figure Interactivity (Click) ---
    function showRandomDream(event) {
        if (dreams.length === 0) return;

        // Choose a random dream
        const randomIndex = Math.floor(Math.random() * dreams.length);
        const randomDream = dreams[randomIndex];

        // Update and show the popup
        dreamPopup.innerHTML = `“${randomDream}”`;
        dreamPopup.classList.add('visible');

        // Briefly change the figure's color to acknowledge the click
        event.target.style.backgroundColor = 'white';
        setTimeout(() => {
            event.target.style.backgroundColor = '#f1c40f'; // Revert color
            dreamPopup.classList.remove('visible'); // Hide after a delay
        }, 3000);
    }

    // --- Step 3: Figure Generation on Scroll ---

    function renderFigureBatch(count) {
        if (isRendering || figuresRendered >= MAX_FIGURES_TO_RENDER) return;
        isRendering = true;

        let fragment = document.createDocumentFragment();
        let batchSize = Math.min(count, MAX_FIGURES_TO_RENDER - figuresRendered);

        for (let i = 0; i < batchSize; i++) {
            const figure = document.createElement('div');
            figure.classList.add('child-figure');
            
            // Attach click handler
            figure.addEventListener('click', showRandomDream); 
            
            // Start transparent, fade in immediately
            setTimeout(() => {
                figure.style.opacity = '1';
            }, 10); 

            fragment.appendChild(figure);
        }

        figureContainer.appendChild(fragment);
        figuresRendered += batchSize;
        figuresCountSpan.textContent = figuresRendered;
        
        isRendering = false;
        
        // Update the status overlay with the "Each figure represents X children" message
        if (figuresRendered === MAX_FIGURES_TO_RENDER) {
            statusOverlay.innerHTML = `Total $\mathbf{${TOTAL_OOSC_NEVER_ENROLLED.toLocaleString()}}$ Lost Futures.<br>($\mathbf{${figuresRendered}}$ figures rendered, each representing $\mathbf{${CHILDREN_PER_FIGURE}}$ children)`;
        }
    }

    // --- Step 4: Scroll Tracking Logic ---
    function handleScroll() {
        const viewportHeight = window.innerHeight;
        const callToActionBottom = callToActionSection.getBoundingClientRect().bottom;

        // Condition 1: Check if the user has scrolled past the "Call to Action"
        if (callToActionBottom <= viewportHeight * 0.2) {
            // The user is in the visualization zone.
            
            // Calculate how far into the visualization section they are.
            // We use the distance from the top of the visualization section to the viewport top
            const scrollDistance = visualizationSection.getBoundingClientRect().top * -1;
            
            // Map the scroll distance to the number of figures to render
            // We want to render all figures over a total scroll of 5000 pixels (arbitrary, adjust for faster/slower scroll)
            const MAX_SCROLL_DISTANCE = 5000; 
            
            let targetFigures = Math.min(
                MAX_FIGURES_TO_RENDER, 
                Math.floor((scrollDistance / MAX_SCROLL_DISTANCE) * MAX_FIGURES_TO_RENDER)
            );

            let newFiguresToRender = targetFigures - figuresRendered;

            if (newFiguresToRender > 0) {
                // Render figures in large chunks for performance
                renderFigureBatch(newFiguresToRender); 
            }
        }
    }
    
    // --- Initialization ---
    loadDreams();
    
    // Initial content for the status overlay
    statusOverlay.innerHTML = `Each figure represents $\mathbf{${CHILDREN_PER_FIGURE.toLocaleString()}}$ children.`;

    // Attach the scroll listener to the window
    window.addEventListener('scroll', handleScroll);
});
