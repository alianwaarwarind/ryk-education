document.addEventListener('DOMContentLoaded', () => {
    // --- Project Constants ---
    const TOTAL_OOSC_NEVER_ENROLLED = 451123; // The key figure
    const MAX_FIGURES_TO_RENDER = 5000;      // Max number of emojis we will actually draw
    
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
            // Ensure the path is correct: './data/dreams.json'
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
        event.target.style.color = '#e74c3c'; // Use primary color for highlight
        
        // Hide and revert color after 3 seconds
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
            
            // Collect the figures
            figuresToAppend.push(figure);
        }

        // Use a recursive function with a delay to append figures one by one
        function appendOneByOne(index) {
            if (index >= figuresToAppend.length) {
                // Done with the current batch
                figuresCountSpan.textContent = figuresRendered;
                isRendering = false;
                
                // Final overlay update
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

            // Use a small delay (e.g., 2ms) between appending each figure for the smooth effect
            setTimeout(() => appendOneByOne(index + 1), 2); 
        }

        // Start the recursive appending
        appendOneByOne(0);
    }

    // --- Step 4: Scroll Tracking Logic ---
    function handleScroll() {
        // Only run logic if we haven't finished rendering all figures
        if (figuresRendered >= MAX_FIGURES_TO_RENDER) return;

        const viewportHeight = window.innerHeight;
        const callToActionBottom = callToActionSection.getBoundingClientRect().bottom;

        // Condition 1: Check if the user has scrolled past the "Call to Action"
        if (callToActionBottom <= viewportHeight * 0.2) {
            
            // Calculate how far into the visualization section they are (negative value becomes positive)
            const scrollDistance = visualizationSection.getBoundingClientRect().top * -1;
            
            // **Crucial for smooth scroll:** This total distance controls the speed of figure appearance.
            // 15000px requires the user to scroll significantly, creating a drawn-out, impactful reveal.
            const MAX_SCROLL_DISTANCE = 15000; 
            
            let targetFigures = Math.min(
                MAX_FIGURES_TO_RENDER, 
                Math.floor((scrollDistance / MAX_SCROLL_DISTANCE) * MAX_FIGURES_TO_RENDER)
            );

            let newFiguresToRender = targetFigures - figuresRendered;

            // Render figures in small chunks (e.g., 100 figures) to respond quickly to scroll
            if (newFiguresToRender > 0) {
                renderFigureBatch(Math.min(newFiguresToRender, 100)); 
            }
        }
    }
    
    // --- Initialization ---
    loadDreams();
    
    // Initial content for the status overlay
    statusOverlay.innerHTML = `Each figure represents <span class="data-point">${CHILDREN_PER_FIGURE.toLocaleString()}</span> children.`;

    // Attach the scroll listener to the window
    window.addEventListener('scroll', handleScroll);
});
