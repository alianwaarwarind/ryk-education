document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 500;
    
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section');
    const outroSection = document.getElementById('outro-section');
    const figures = [];
    
    // UPDATED: Initialize to 0
    let lastRevealedIndex = 0; 

    const dreamPopup = document.getElementById('dream-popup');
    const dreamText = document.getElementById('dream-text');
    const closeDreamBtn = document.getElementById('close-dream');

    const dreams = [
        "a pilot", "a bridge builder", "a teacher", "a doctor", "an engineer",
        "a writer", "an artist", "a farmer who feeds everyone", "a shop owner",
        "an inventor", "a musician", "an explorer", "a cricket star", "a soldier",
        "a veterinarian", "a chef", "a leader for my community", "a home builder",
        "a tailor", "a computer expert"
    ];

    // --- 1. Create all figures (but keep them hidden) ---
    function createFigures() {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < numFigures; i++) {
            const span = document.createElement('span');
            span.className = 'figure';
            span.innerHTML = '🧍‍♂️'; 
            
            span.addEventListener('click', () => {
                showDream(dreams[Math.floor(Math.random() * dreams.length)]);
            });

            fragment.appendChild(span);
            figures.push(span);
        }
        container.appendChild(fragment);
    }

    // --- 2. Update visualization based on scroll ---
    function updateVisualization() {
        const scrollY = window.scrollY;

        // --- Ali Fade Logic ---
        const introSection = document.getElementById('intro-section');
        const introBottom = introSection.offsetTop + introSection.offsetHeight;
        const aliFadeStart = aliContainer.offsetTop - window.innerHeight / 2;
        const aliFadeEnd = introBottom - window.innerHeight / 4; 
        const aliProgress = Math.min(1, Math.max(0, (scrollY - aliFadeStart) / (aliFadeEnd - aliFadeStart)));
        
        if (aliContainer) { 
             aliContainer.style.opacity = (1 - aliProgress).toString();
             aliContainer.style.pointerEvents = aliProgress >= 1 ? 'none' : 'auto';
        }

        // --- Figure Reveal Logic (FIXED) ---
        if (!vizSection || !outroSection) return; 

        const scrollStart = vizSection.offsetTop;
        const vhInPixels = window.innerHeight / 100;
        const totalScrollableDistance = 500 * vhInPixels; 
        
        let scrollDistanceInViz = scrollY - scrollStart;
        let progress = scrollDistanceInViz / totalScrollableDistance;
        progress = Math.min(1, Math.max(0, progress));

        // This is a *count* of figures to show (e.g., 111)
        const figuresToReveal = Math.floor(progress * numFigures);
        
        // --- CORRECTED REVEAL LOOP ---
        if (figuresToReveal > lastRevealedIndex) {
            // User is scrolling down
            // Loop from the last index (e.g., 0) up to the new count (e.g., 111)
            for (let i = lastRevealedIndex; i < figuresToReveal; i++) {
                if (figures[i]) {
                    figures[i].classList.add('revealed');
                }
            }
        } else if (figuresToReveal < lastRevealedIndex) {
            // User is scrolling up
            // Loop from the new count (e.g., 111) up to the old index (e.g., 120)
            for (let i = figuresToReveal; i < lastRevealedIndex; i++) {
                if (figures[i]) {
                    figures[i].classList.remove('revealed');
                }
            }
        }
        
        // Update the tracker to the new count
        lastRevealedIndex = figuresToReveal; 

        // --- CORRECTED SYNC INTERNAL SCROLL ---
        
        // Get the *actual last figure* based on the count
        // (index is count - 1)
        const lastFigure = figures[figuresToReveal - 1];
        
        if (lastFigure) {
            // Scroll the grid to keep this exact figure in view
            const newScrollTop = lastFigure.offsetTop - vizSection.clientHeight + lastFigure.offsetHeight + 20; // +20 for padding
            vizSection.scrollTop = Math.max(0, newScrollTop);
        
        } else if (progress < 0.01) {
             // If we're at the top, reset scroll to 0
             vizSection.scrollTop = 0;
        }
    }

    // --- Dream Pop-up Functions ---
    function showDream(dream) {
        dreamText.textContent = `"I dream of becoming ${dream}..."`;
        dreamPopup.classList.remove('hidden');
    }

    closeDreamBtn.addEventListener('click', () => {
        dreamPopup.classList.add('hidden');
    });

    // --- Initial Setup ---
    createFigures();
    
    requestAnimationFrame(() => {
        updateVisualization(); 
    });
    
    window.addEventListener('scroll', updateVisualization, { passive: true });
    window.addEventListener('resize', updateVisualization); 
});
