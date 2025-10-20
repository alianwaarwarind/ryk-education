document.addEventListener('DOMContentLoaded', () => {
    // UPDATED: Doubled the figures
    const numFigures = 2000; 
    
    const container = document.getElementById('visualization-container');
    const button = document.getElementById('start-visualization');
    const figures = [];

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

    // --- 2. The NEW Animation Function ---
    function startVisualization() {
        // Hide the button so it can't be clicked again
        button.classList.add('hidden');
        
        // --- Randomly shuffle the figures array ---
        const shuffledFigures = figures.sort(() => Math.random() - 0.5);

        // Reveal figures in batches for a "filling" effect
        let i = 0;
        const interval = setInterval(() => {
            // Reveal a batch of 20 figures
            const batch = shuffledFigures.slice(i, i + 20);
            for (const figure of batch) {
                if (figure) {
                    figure.classList.add('revealed');
                }
            }
            
            i += 20;

            // Stop when all figures are revealed
            if (i >= numFigures) {
                clearInterval(interval);
            }
        // UPDATED: Slowed down the interval
        }, 75); // Every 75ms (reveals all 2000 in 7.5 seconds)
    }


    // --- 3. Dream Pop-up Functions ---
    function showDream(dream) {
        dreamText.textContent = `"I dream of becoming ${dream}..."`;
        dreamPopup.classList.remove('hidden');
    }

    closeDreamBtn.addEventListener('click', () => {
        dreamPopup.classList.add('hidden');
    });

    // --- 4. Initial Setup ---
    createFigures();
    
    // Add the click listener to the button
    button.addEventListener('click', startVisualization);
});
