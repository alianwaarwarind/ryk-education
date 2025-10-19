document.addEventListener('DOMContentLoaded', () => {
    // UPDATED: Reduced from 5000 to 500
    const numFigures = 500;
    
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section');
    const figures = [];
    let lastRevealedIndex = -1; 

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

        // --- Figure Reveal Logic ---
        const vizWrapper = document.getElementById('visualization-wrapper');
        if (!vizWrapper || !vizSection) return; 

        const scrollStart = vizWrapper.offsetTop;
        const totalScrollableDistance = vizWrapper.offsetHeight - window.innerHeight;
        
        let scrollDistanceInViz = scrollY - scrollStart;
        let progress = scrollDistanceInViz / totalScrollableDistance;
        progress = Math.min(1, Math.max(0, progress));

        const figuresToReveal = Math.floor(progress * numFigures);
        
        // --- HIGH-PERFORMANCE REVEAL LOOP ---
        if (figuresToReveal > lastRevealedIndex) {
            for (let i = lastRevealedIndex + 1; i < figuresToReveal; i++) { // Use '<' to stop before the last one
                if (figures[i] && !figures[i].classList.contains('revealed')) {
                    figures[i].classList.add('revealed');
                }
            }
        } else if (figuresToReveal < lastRevealedIndex) {
            for (let i = figuresToReveal + 1; i <= lastRevealedIndex; i++) {
                if (figures[i]) {
                    figures[i].classList.remove('revealed');
                }
            }
        }
        
        lastRevealedIndex = figuresToReveal;

        // --- UPDATED: SYNC INTERNAL SCROLL (THE "EMPTY SCREEN" FIX) ---
        
        // Find the last figure that should be visible
        const lastFigure = figures[lastRevealedIndex];
        
        if (lastFigure) {
            // Add the 'revealed' class to this specific figure
            // (we skipped it in the loop)
            if (!lastFigure.classList.contains('revealed')) {
                 lastFigure.classList.add('revealed');
            }

            // Calculate where the top of the grid needs to be
            // to keep this last figure just in view at the bottom
            const newScrollTop = lastFigure.offsetTop - vizSection.clientHeight + lastFigure.offsetHeight + 20; // +20 for padding
            
            // Set the scroll position, ensuring it's not negative
            vizSection.scrollTop = Math.max(0, newScrollTop);
        
        } else if (progress < 0.01) {
             // Ensure we're scrolled to the top at the beginning
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
