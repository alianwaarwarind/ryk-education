document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 5000;
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section');
    const figures = [];
    let lastRevealedIndex = -1; // Track the last figure revealed

    const dreamPopup = document.getElementById('dream-popup');
    const dreamText = document.getElementById('dream-text');
    const closeDreamBtn = document.getElementById('close-dream');

    const dreams = [
        "To become a pilot.",
        "To build bridges.",
        "To teach others.",
        "To heal the sick.",
        "To be an engineer.",
        "To write stories.",
        "To be an artist.",
        "To grow food for everyone.",
        "To run a small shop.",
        "To invent something new.",
        "To sing and share music.",
        "To explore the world.",
        "To play cricket for my country.",
        "To become a soldier.",
        "To care for animals.",
        "To cook delicious food.",
        "To be a leader for my community.",
        "To build beautiful homes.",
        "To stitch colorful clothes.",
        "To use computers."
    ];

    // --- 1. Create all figures (but keep them hidden) ---
    function createFigures() {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < numFigures; i++) {
            const span = document.createElement('span');
            span.className = 'figure';
            span.innerHTML = '🧍‍♂️'; // Use consistent emoji
            
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

        // --- UPDATED: SYNC INTERNAL SCROLL ---
        // This logic now scrolls the container to keep the
        // "action line" (new figures) at the BOTTOM of the screen.
        
        // Calculate how far to scroll: (total grid height * progress) - (viewport height)
        const newScrollTop = (vizSection.scrollHeight * progress) - vizSection.clientHeight;
        
        // Set the scroll position, ensuring it's not negative
        vizSection.scrollTop = Math.max(0, newScrollTop);
    }

    // --- Dream Pop-up Functions ---
    function showDream(dream) {
        dreamText.textContent = `I dream... "${dream}"`;
        dreamPopup.classList.remove('hidden');
    }

    closeDreamBtn.addEventListener('click', () => {
        dreamPopup.classList.add('hidden');
    });

    // --- Initial Setup ---
    createFigures();
    
    // Use requestAnimationFrame to ensure layout is calculated *before*
    // the first run of updateVisualization
    requestAnimationFrame(() => {
        updateVisualization(); 
    });
    
    window.addEventListener('scroll', updateVisualization, { passive: true });
    window.addEventListener('resize', updateVisualization); 
});
