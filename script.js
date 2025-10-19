document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 5000;
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section'); // <-- ADDED
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
        
        if (aliContainer) { // Check if Ali container exists
             aliContainer.style.opacity = (1 - aliProgress).toString();
             aliContainer.style.pointerEvents = aliProgress >= 1 ? 'none' : 'auto';
        }

        // --- Figure Reveal Logic ---
        const vizWrapper = document.getElementById('visualization-wrapper');
        if (!vizWrapper || !vizSection) return; // Exit if elements not found

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
        
        lastRevealedIndex = figuresToReveal; // Update the tracker

        // --- ADDED: SYNC INTERNAL SCROLL ---
        // This scrolls the black box's content in sync with the page scroll
        const totalGridScroll = vizSection.scrollHeight - vizSection.clientHeight;
        vizSection.scrollTop = totalGridScroll * progress;
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
    // Run updateVisualization once *after* figures are created
    // to get the correct initial scrollHeight
    updateVisualization(); 
    
    window.addEventListener('scroll', updateVisualization, { passive: true });
    window.addEventListener('resize', updateVisualization); 
});
