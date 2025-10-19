document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 5000;
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section');
    const figures = [];
    let lastRevealedIndex = -1; 

    const dreamPopup = document.getElementById('dream-popup');
    const dreamText = document.getElementById('dream-text');
    const closeDreamBtn = document.getElementById('close-dream');

    // UPDATED: Changed to noun phrases for better formatting in the popup
    const dreams = [
        "a pilot",
        "a bridge builder",
        "a teacher",
        "a doctor",
        "an engineer",
        "a writer",
        "an artist",
        "a farmer who feeds everyone",
        "a shop owner",
        "an inventor",
        "a musician",
        "an explorer",
        "a cricket star",
        "a soldier",
        "a veterinarian",
        "a chef",
        "a leader for my community",
        "a home builder",
        "a tailor",
        "a computer expert"
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
            for (let i = lastRevealedIndex + 1; i <= figuresToReveal; i++) {
                if (figures[i]) {
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

        // --- REVERTED: SYNC INTERNAL SCROLL ---
        // This is the correct logic. It scrolls the grid up
        // as you scroll down, keeping the "action line"
        // (the newest figures) in view.
        
        const totalGridScroll = vizSection.scrollHeight - vizSection.clientHeight;
        vizSection.scrollTop = totalGridScroll * progress;
    }

    // --- Dream Pop-up Functions ---
    // UPDATED: Changed text to be more sensitive
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
