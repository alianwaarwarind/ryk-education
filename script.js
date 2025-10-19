document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 5000;
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const ali = document.getElementById('ali');
    const figures = [];
    let lastRevealedIndex = -1; // Track the last figure revealed for the scroll effect

    const dreamPopup = document.getElementById('dream-popup');
    const dreamText = document.getElementById('dream-text');
    const closeDreamBtn = document.getElementById('close-dream');

    const dreams = [
        "To become a pilot, soaring above the very fields where I now toil.",
        "To build bridges and roads, connecting villages so no one feels isolated.",
        "To teach others, sharing knowledge that was once denied to me.",
        "To heal the sick, becoming a doctor and serving my community.",
        "To be an engineer, designing new ways to bring water to dry lands.",
        "To write stories, so the voices of children like me are heard.",
        "To be an artist, painting the vibrant colors of my homeland.",
        "To cultivate the best crops, ensuring food for every family.",
        "To run a small shop, providing for my family and neighbors.",
        "To invent something that makes life easier for everyone.",
        "To sing and share music that brings joy to people's hearts.",
        "To explore the world, beyond the boundaries of my village.",
        "To play sports, representing my country and inspiring others.",
        "To become a soldier, protecting my land and its people.",
        "To care for animals, ensuring they are healthy and well-treated.",
        "To cook delicious food that brings people together.",
        "To lead, becoming a voice for the voiceless in my community.",
        "To build beautiful homes, where families can live safely.",
        "To stitch clothes, creating beauty and livelihood.",
        "To use computers, connecting to a world of information."
    ];

    // --- 1. Create all figures (but keep them hidden) ---
    function createFigures() {
        const fragment = document.createDocumentFragment();

        for (let i = 0; i < numFigures; i++) {
            const span = document.createElement('span');
            span.className = 'figure';
            span.innerHTML = '🧍';
            span.dataset.index = i; // Store index for potential targeting
            
            // Add click listener for dreams
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

        // --- Ali Fade Logic (now using aliContainer) ---
        // Fade Ali and his text out as the user scrolls past the intro section
        const introSection = document.getElementById('intro-section');
        const introBottom = introSection.offsetTop + introSection.offsetHeight;
        
        // Ali should start fading when the top of aliContainer reaches the middle of the viewport
        const aliFadeStart = aliContainer.offsetTop - window.innerHeight / 2;
        // And finish fading when the bottom of introSection leaves the viewport
        const aliFadeEnd = introBottom - window.innerHeight / 4; 

        const aliProgress = Math.min(1, Math.max(0, (scrollY - aliFadeStart) / (aliFadeEnd - aliFadeStart)));
        aliContainer.style.opacity = (1 - aliProgress).toString();
        // Adjust for visibility, Ali should still be in the document flow
        aliContainer.style.pointerEvents = aliProgress >= 1 ? 'none' : 'auto';


        // --- Figure Reveal Logic ---
        const vizSection = document.getElementById('visualization-section');
        const outroSection = document.getElementById('outro-section');

        // The animation "active zone" is when the visualization section is sticky
        // It starts when the top of the visualization section hits the top of the viewport
        // and ends when the *top* of the outro section reaches the top of the viewport.
        const scrollStart = vizSection.offsetTop;
        const scrollEnd = outroSection.offsetTop; // When outro starts covering the sticky viz

        const totalScrollableDistance = scrollEnd - scrollStart;

        // Calculate current scroll distance within the "active zone"
        let scrollDistanceInViz = scrollY - scrollStart;

        // Clamp scroll distance
        scrollDistanceInViz = Math.min(totalScrollableDistance, Math.max(0, scrollDistanceInViz));

        // Calculate progress as a percentage (0.0 to 1.0)
        let progress = scrollDistanceInViz / totalScrollableDistance;
        progress = Math.min(1, Math.max(0, progress));

        // Determine how many figures should be revealed based on progress
        // Using Math.ceil to ensure at least 1 figure appears for any progress > 0
        const figuresToReveal = Math.ceil(progress * numFigures);
        
        // --- "Fallen" style reveal: only add 'revealed' class to new figures ---
        for (let i = 0; i < figuresToReveal; i++) {
            if (figures[i] && !figures[i].classList.contains('revealed')) {
                // Add a slight delay for the "drop-in" effect
                setTimeout(() => {
                    figures[i].classList.add('revealed');
                }, i * 2); // Small delay, e.g., 2ms per figure for a staggered effect
            }
        }

        // --- Hide figures if scrolling up ---
        for (let i = figuresToReveal; i < numFigures; i++) {
            if (figures[i] && figures[i].classList.contains('revealed')) {
                figures[i].classList.remove('revealed');
            }
        }
        
        lastRevealedIndex = figuresToReveal; // Update the tracker
    }

    // --- Dream Pop-up Functions ---
    function showDream(dream) {
        dreamText.textContent = dream;
        dreamPopup.classList.remove('hidden');
    }

    closeDreamBtn.addEventListener('click', () => {
        dreamPopup.classList.add('hidden');
    });

    // --- Initial Setup ---
    createFigures();
    window.addEventListener('scroll', updateVisualization, { passive: true });
    window.addEventListener('resize', updateVisualization); // Re-run on resize to adjust layout
    updateVisualization(); // Run once on load to set initial state

    // Ensure initial scroll position for the intro is pleasant
    window.scrollTo(0, 0);
});
