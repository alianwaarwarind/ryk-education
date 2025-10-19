document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 500;
    
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section');
    const introSection = document.getElementById('intro-section');
    const figures = [];
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

    // --- 2. Define Layout Constants ---
    // These are calculated once to avoid layout thrashing
    let scrollStart = 0;
    let totalScrollableDistance = 0;
    let totalGridScroll = 0;

    function calculateLayout() {
        scrollStart = vizSection.offsetTop;
        const vhInPixels = window.innerHeight / 100;
        totalScrollableDistance = 500 * vhInPixels;
        
        // Calculate the total scrollable height of the *grid* inside
        totalGridScroll = vizSection.scrollHeight - vizSection.clientHeight;
    }

    // --- 3. High-Performance Scroll Handling (THE FIX) ---
    let lastScrollY = window.scrollY;
    let ticking = false;

    function onScroll() {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateVisualization(lastScrollY);
                ticking = false;
            });
            ticking = true;
        }
    }

    // --- 4. Update visualization (now runs in rAF) ---
    function updateVisualization(scrollY) {
        
        // --- Ali Fade Logic ---
        if (aliContainer && introSection) {
            const introBottom = introSection.offsetTop + introSection.offsetHeight;
            const aliFadeStart = aliContainer.offsetTop - window.innerHeight / 2;
            const aliFadeEnd = introBottom - window.innerHeight / 4; 
            const aliProgress = Math.min(1, Math.max(0, (scrollY - aliFadeStart) / (aliFadeEnd - aliFadeStart)));
            
            aliContainer.style.opacity = (1 - aliProgress).toString();
            aliContainer.style.pointerEvents = aliProgress >= 1 ? 'none' : 'auto';
        }

        // --- Figure Reveal Logic ---
        if (totalScrollableDistance <= 0) return; 

        let scrollDistanceInViz = scrollY - scrollStart;
        let progress = scrollDistanceInViz / totalScrollableDistance;
        progress = Math.min(1, Math.max(0, progress));

        const figuresToReveal = Math.floor(progress * numFigures);
        
        // --- Reveal Loop ---
        if (figuresToReveal > lastRevealedIndex) {
            for (let i = lastRevealedIndex; i < figuresToReveal; i++) {
                if (figures[i]) {
                    figures[i].classList.add('revealed');
                }
            }
        } else if (figuresToReveal < lastRevealedIndex) {
            for (let i = figuresToReveal; i < lastRevealedIndex; i++) {
                if (figures[i]) {
                    figures[i].classList.remove('revealed');
                }
            }
        }
        
        lastRevealedIndex = figuresToReveal; 

        // --- SIMPLIFIED SYNC INTERNAL SCROLL ---
        // This is much faster and less "jumpy".
        // It scrolls the grid proportionally to the page scroll.
        vizSection.scrollTop = totalGridScroll * progress;
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
    
    // Calculate layout *after* figures are created and DOM is ready
    calculateLayout(); 
    
    // Run update once on load
    requestAnimationFrame(() => updateVisualization(window.scrollY)); 
    
    // Add listeners
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        calculateLayout(); // Recalculate on resize
        updateVisualization(window.scrollY);
    }); 
});
