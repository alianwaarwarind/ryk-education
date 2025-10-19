document.addEventListener('DOMContentLoaded', () => {
    const numFigures = 500;
    
    const container = document.getElementById('visualization-container');
    const aliContainer = document.getElementById('ali-container');
    const vizSection = document.getElementById('visualization-section');
    const introSection = document.getElementById('intro-section');
    const figures = [];
    // lastRevealedIndex is NO LONGER NEEDED

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
            span.className = 'figure'; // Start hidden
            span.innerHTML = '🧍‍♂️'; 
            span.addEventListener('click', () => {
                showDream(dreams[Math.floor(Math.random * dreams.length)]);
            });
            fragment.appendChild(span);
            figures.push(span);
        }
        container.appendChild(fragment);
    }

    // --- 2. Define Layout Constants ---
    let scrollStart = 0;
    let totalScrollableDistance = 0;
    let totalGridScroll = 0;

    function calculateLayout() {
        if (!vizSection || !container) return;
        scrollStart = vizSection.offsetTop;
        const vhInPixels = window.innerHeight / 100;
        totalScrollableDistance = 500 * vhInPixels;
        
        // Calculate the total scrollable height of the *grid* inside
        totalGridScroll = container.offsetHeight - vizSection.clientHeight;
        
        // --- NEW ---
        // Reveal all figures at once (they are hidden by opacity 0)
        // and add a staggered transition delay
        figures.forEach((figure, i) => {
            // Stagger the fade-in
            figure.style.transitionDelay = `${(i * 1.5)}ms`; 
            figure.classList.add('revealed');
        });
    }

    // --- 3. High-Performance Scroll Handling ---
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
    // THIS IS NOW MUCH SIMPLER AND FASTER
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

        // --- ALL LOOPS ARE GONE ---

        // --- UPDATED: TRANSFORM INSTEAD OF SCROLLTOP ---
        // This is hardware-accelerated and smooth
        const scrollAmount = totalGridScroll * progress;
        container.style.transform = `translateY(-${scrollAmount}px)`;
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
    
    // 1. Create figures as soon as DOM is ready
    createFigures();
    
    // 2. Wait for *everything* (images, fonts) to load
    window.addEventListener('load', () => {
        // 3. NOW, calculate the layout
        calculateLayout(); 
        
        // 4. Run update once to set the initial state
        requestAnimationFrame(()_=> updateVisualization(window.scrollY)); 
        
        // 5. NOW, add the scroll and resize listeners
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', () => {
            calculateLayout(); // Recalculate on resize
            updateVisualization(window.scrollY);
        }); 
    });
});
