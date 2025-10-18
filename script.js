// CRITICAL FIX: Use 'load' event to ensure all images/fonts are measured before calculating height
window.addEventListener('load', () => {
    // --- Project Constants ---
    const TOTAL_OOSC_NEVER_ENROLLED = 451123;
    const MAX_FIGURES_TO_RENDER = 5000;
    const MAX_SCROLL_DISTANCE = 15000; 
    
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

        event.target.style.color = '#e74c3c'; 
        
        setTimeout(() => {
            event.target.style.color = '#f1c40f'; 
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
            
            setTimeout(() => figure.style.opacity = '1', 10); 

            figuresRendered++;

            setTimeout(() => appendOneByOne(index + 1), 2); 
        }

        appendOneByOne(0);
    }

    // --- Step 4: Scroll Tracking Logic ---
    function handleScroll() {
        if (figuresRendered >= MAX_FIGURES_TO_RENDER) return;

        // Calculate the height of the introductory content (Sections 1 and 2)
        // This is robust now thanks to the 'load' event
        const introSection = document.querySelector('.intro-section');
        const introContentHeight = introSection.offsetHeight + callToActionSection.offsetHeight;
        
        const totalScrolled = window.scrollY; 
        
        // This calculates the distance scrolled *inside* the 15,500px buffer area
        const scrollDistance = Math.max(0, totalScrolled - introContentHeight); 
        
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
