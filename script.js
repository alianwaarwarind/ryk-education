document.addEventListener('DOMContentLoaded', () => {
    // --- Project Constants ---
    const TOTAL_OOSC_NEVER_ENROLLED = 451123; // The key figure
    const MAX_FIGURES_TO_RENDER = 5000;      // Max number of emojis to draw
    const MAX_SCROLL_DISTANCE = 15000;       // Total scroll distance (in pixels) to fully render all figures
    
    // Calculates the representation factor for the overlay text
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

        const randomIndex = Math.floor(Math.random() * dreams.length);
        const randomDream = dreams[randomIndex];

        dreamPopup.innerHTML = `“${randomDream}”`;
        dreamPopup.classList.add('visible');

        event.target.style.color = '#e74c3c'; // Highlight on click
        
        setTimeout(() => {
            event.target.style.color = '#f1c40f'; // Revert to accent color
            dreamPopup.classList.remove('visible'); 
        }, 3000);
    }

    // --- Step 3: Figure Generation on Scroll (Smoother Batching) ---
    function renderFigureBatch(count) {
        if (isRendering || figuresRendered >= MAX_FIGURES_TO_RENDER || count <= 0) return;
        isRendering = true;

        let batchSize = Math.min(count, MAX_FIGURES_TO_RENDER - figuresRendered);
        let figuresToAppend = [];
        
        for (let i = 0; i < batchSize; i++) {
            const figure = document.createElement('div');
            figure.classList.add('child-figure');
            figure.addEventListener('click', showRandomDream); 
            figuresToAppend.push(figure);
        }

        // Recursive function with delay to append figures one by one for smooth animation
        function appendOneByOne(index) {
            if (index >= figuresToAppend.length) {
                figuresCountSpan.textContent = figuresRendered;
                isRendering = false;
                
                if (figuresRendered === MAX_FIGURES_TO_RENDER) {
                    statusOverlay.innerHTML = `Total <span class="data-point">${TOTAL_OOSC_NEVER_ENROLLED.toLocaleString()}</span> Lost Futures.<br>(<span class="data-point">${figuresRendered}</span> figures rendered, each representing <span class="data-point">${CHILDREN_PER_FIGURE.toLocaleString()}</span> children)`;
                }
                return;
            }

            const figure = figuresToAppend[index];
            figureContainer.appendChild(figure);
            
            // Trigger opacity change AFTER appending to ensure the fade-in transition works
            setTimeout(() => figure.style.opacity = '1', 10); 

            figuresRendered++;

            // Use a small delay (2ms) for the staggered effect
            setTimeout(() => appendOneByOne(index + 1), 2); 
        }

        appendOneByOne(0);
    }

    // --- Step 4: Scroll Tracking Logic ---
    function handleScroll() {
        if (figuresRendered >= MAX_FIGURES_TO_RENDER) return;

        const viewportHeight = window.innerHeight;
        const callToActionBottom = callToActionSection.getBoundingClientRect().bottom;

        // Check if the user is past the introductory text and into the visualization zone
        if (callToActionBottom <= viewportHeight * 0.2) {
            
            // scrollDistance measures how far the visualization section has scrolled past the top
            const scrollDistance = visualizationSection.getBoundingClientRect().top * -1;
            
            let targetFigures = Math.min(
                MAX_FIGURES_TO_RENDER, 
                Math.floor((scrollDistance / MAX_SCROLL_DISTANCE) * MAX_FIGURES_TO_RENDER)
            );

            let newFiguresToRender = targetFigures - figuresRendered;

            // Render figures in small, controlled chunks (max 100 figures per scroll event)
            if (newFiguresToRender > 0) {
                renderFigureBatch(Math.min(newFiguresToRender, 100)); 
            }
        }
    }
    
    // --- Initialization ---
    loadDreams();
    
    // Initial content for the status overlay
    statusOverlay.innerHTML = `Each figure represents <span class="data-point">${CHILDREN_PER_FIGURE.toLocaleString()}</span> children.`;

    // Attach the scroll listener
    window.addEventListener('scroll', handleScroll);
});
