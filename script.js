document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 5000;
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
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

        // --- Figure Reveal Logic (New and Optimized) ---
        const vizWrapper = document.getElementById('visualization-wrapper');
        if (!vizWrapper) return; // Exit if wrapper not found

        // The animation "active zone" is the height of the wrapper
        const scrollStart = vizWrapper.offsetTop;
        // The total scrollable distance is the wrapper's height minus one viewport height
        // (because the animation is *done* when the wrapper's bottom hits the viewport's bottom)
        const totalScrollableDistance = vizWrapper.offsetHeight - window.innerHeight;
        
        // Calculate current scroll distance within the "active zone"
        let scrollDistanceInViz = scrollY - scrollStart;

        // Calculate progress as a percentage (0.0 to 1.0)
        let progress = scrollDistanceInViz / totalScrollableDistance;
        
        // Clamp progress between 0 and 1
        progress = Math.min(1, Math.max(0, progress));

        const figuresToReveal = Math.floor(progress * numFigures);
        
        // --- HIGH-PERFORMANCE REVEAL LOOP ---
        // NO setTimeout. This just adds/removes classes.
        
        if (figuresToReveal > lastRevealedIndex) {
            // User is scrolling down: Show new figures
            for (let i = lastRevealedIndex + 1; i <= figuresToReveal; i++) {
                if (figures[i]) {
                    figures[i].classList.add('revealed');
                }
            }
        } else if (figuresToReveal < lastRevealedIndex) {
            // User is scrolling up: Hide figures
            for (let i = figuresToReveal + 1; i <= lastRevealedIndex; i++) {
                if (figures[i]) {
                    figures[i].classList.remove('revealed');
                }
            }
        }
        
        lastRevealedIndex = figuresToReveal; // Update the tracker
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
    window.addEventListener('scroll', updateVisualization, { passive: true });
    window.addEventListener('resize', updateVisualization); 
    updateVisualization(); // Run once on load
});
