/**
 * Spanish Vocabulary Learning App
 * A flashcard application for learning Spanish words
 */

// DOM Elements
const elements = {
    categoriesContainer: document.getElementById('categories'),
    spanishWord: document.getElementById('spanish-word'),
    translation: document.getElementById('translation'),
    example: document.getElementById('example'),
    knowItBtn: document.getElementById('know-it'),
    dontKnowBtn: document.getElementById('dont-know'),
    progressBar: document.getElementById('progress'),
    progressText: document.getElementById('progress-text'),
    wordCard: document.getElementById('word-card'),
    cardInner: document.querySelector('.card-inner'),
    cardFront: document.querySelector('.card-front'),
    cardBack: document.querySelector('.card-back'),
    controls: document.querySelector('.controls'),
    categoriesGrid: document.querySelector('.categories-grid')
};

// App State
const state = {
    currentCategory: null,
    currentWord: null,
    currentWordIndex: -1,
    isTransitioning: false,
    knownWords: new Set(JSON.parse(localStorage.getItem('knownWords') || '[]'))
};

/**
 * Initialize the application
 */
function init() {
    // Check if all required elements exist
    if (!validateElements()) {
        console.error('Required DOM elements are missing');
        return;
    }

    renderCategories();
    setupEventListeners();
    updateProgress();
}

/**
 * Validate that all required DOM elements exist
 */
function validateElements() {
    return Object.values(elements).every(element => {
        if (!element) {
            console.error('Missing required element:', Object.keys(elements).find(key => elements[key] === element));
            return false;
        }
        return true;
    });
}

/**
 * Render category cards
 */
function renderCategories() {
    if (!elements.categoriesContainer) return;

    elements.categoriesContainer.innerHTML = categories.map(category => {
        const categoryWords = category.words;
        const knownCount = Array.from(state.knownWords).filter(wordKey => {
            const [categoryId] = wordKey.split('::');
            return categoryId === category.id;
        }).length;
        
        const progressPercent = categoryWords.length > 0 
            ? Math.round((knownCount / categoryWords.length) * 100) 
            : 0;
        
        return `
            <div class="category-card" data-category-id="${category.id}">
                <h3>${category.name}</h3>
                <p>${knownCount} من ${categoryWords.length} كلمة</p>
                <div class="category-progress">
                    <div class="category-progress-bar" style="width: ${progressPercent}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * Start learning a specific category
 */
function startCategory(category) {
    if (!category || !category.words || category.words.length === 0) {
        console.error('Invalid category or empty word list');
        return;
    }

    state.currentCategory = category;
    state.currentWordIndex = 0;
    state.isTransitioning = false;

    // Hide categories and show word card
    elements.categoriesGrid.style.display = 'none';
    elements.wordCard.classList.remove('hidden');
    elements.wordCard.classList.add('visible');
    
    // Show the first word
    showNextWord();
}

/**
 * Show the next word in the current category
 */
function showNextWord() {
    if (state.isTransitioning) return;
    
    // Check if we've reached the end of the category
    if (!state.currentCategory || state.currentWordIndex >= state.currentCategory.words.length) {
        completeCategory();
        return;
    }
    
    state.isTransitioning = true;
    
    // Reset card state
    elements.wordCard.style.opacity = '0';
    elements.wordCard.classList.remove('card-flipped');
    
    // Set the new word content
    state.currentWord = state.currentCategory.words[state.currentWordIndex];
    elements.spanishWord.textContent = state.currentWord.spanish;
    elements.translation.textContent = state.currentWord.translation;
    elements.example.textContent = state.currentWord.example || '';
    
    // Make sure the card is visible
    elements.wordCard.classList.remove('hidden');
    
    // Force a reflow to ensure the reset is applied
    void elements.wordCard.offsetHeight;
    
    // Fade in the new word
    setTimeout(() => {
        elements.wordCard.style.opacity = '1';
        state.isTransitioning = false;
    }, 10);
}

/**
 * Handle category completion
 */
function completeCategory() {
    if (!state.currentCategory) return;
    
    const categoryName = state.currentCategory.name;
    
    // Fade out the card
    elements.wordCard.classList.add('hidden');
    
    setTimeout(() => {
        elements.wordCard.classList.remove('visible');
        elements.categoriesGrid.style.display = 'grid';
        renderCategories();
        
        // Show completion message
        showNotification(`تهانينا! لقد أكملت قسم ${categoryName}`);
    }, 300);
}

/**
 * Show a notification to the user
 */
function showNotification(message) {
    // You can replace this with a more sophisticated notification system
    alert(message);
}

/**
 * Mark the current word as known
 */
function markAsKnown() {
    if (!state.currentWord || !state.currentCategory) return;

    const wordKey = `${state.currentCategory.id}::${state.currentWord.spanish}`;
    state.knownWords.add(wordKey);
    saveKnownWords();

    // If card is flipped, flip it back and wait for animation to finish
    if (elements.wordCard.classList.contains('card-flipped')) {
        elements.wordCard.classList.remove('card-flipped');
        setTimeout(nextWord, 180); // Wait for flip animation
    } else {
        nextWord(); // Proceed immediately if not flipped
    }
}

/**
 * Mark the current word as unknown
 */
function markAsUnknown() {
    if (!state.currentWord || !state.currentCategory) {
        nextWord();
        return;
    }

    const wordKey = `${state.currentCategory.id}::${state.currentWord.spanish}`;
    state.knownWords.delete(wordKey);
    saveKnownWords();

    // If card is flipped, flip it back and wait for animation to finish
    if (elements.wordCard.classList.contains('card-flipped')) {
        elements.wordCard.classList.remove('card-flipped');
        setTimeout(nextWord, 180); // Wait for flip animation
    } else {
        nextWord(); // Proceed immediately if not flipped
    }
}

/**
 * Save known words to localStorage
 */
function saveKnownWords() {
    localStorage.setItem('knownWords', JSON.stringify(Array.from(state.knownWords)));
    updateProgress();
}

/**
 * Move to the next word
 */
function nextWord() {
    if (state.currentCategory && state.currentWordIndex < state.currentCategory.words.length - 1) {
        state.currentWordIndex++;
        showNextWord();
    } else {
        // Reached the end of the category
        if (state.currentCategory) {
            state.currentWordIndex = state.currentCategory.words.length;
            showNextWord(); // This will trigger category completion
        }
    }
}

/**
 * Update progress bar and text
 */
function updateProgress() {
    if (!elements.progressBar || !elements.progressText) return;

    const totalWords = categories.reduce((sum, cat) => sum + cat.words.length, 0);
    const knownCount = state.knownWords.size;
    const progressPercent = totalWords > 0 ? Math.round((knownCount / totalWords) * 100) : 0;

    elements.progressBar.style.width = `${progressPercent}%`;
    elements.progressText.textContent = `${progressPercent}% مكتمل`;

    // Update category progress in the UI
    renderCategories();
}

/**
 * Flip the card
 */
function flipCard() {
    if (state.isTransitioning) return;

    elements.wordCard.classList.toggle('card-flipped');

    // Add a small delay before allowing another flip to prevent rapid toggling
    state.isTransitioning = true;
    setTimeout(() => {
        state.isTransitioning = false;
    }, 500); // Match this with your CSS transition duration
}

/**
 * Set up all event listeners for the application
 */
function setupEventListeners() {
    // Event listener for category selection
    if (elements.categoriesContainer) {
        elements.categoriesContainer.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const categoryId = categoryCard.dataset.categoryId;
                const selectedCategory = categories.find(cat => cat.id === categoryId);
                if (selectedCategory) {
                    startCategory(selectedCategory);
                }
            }
        });
    }

    // Event listeners for card controls
    if (elements.knowItBtn) {
        elements.knowItBtn.addEventListener('click', markAsKnown);
    }

    if (elements.dontKnowBtn) {
        elements.dontKnowBtn.addEventListener('click', markAsUnknown);
    }

    // Event listener for flipping the card - ATTACH TO FRONT ONLY
    if (elements.cardFront) {
        elements.cardFront.addEventListener('click', flipCard);
    }
}

// Start the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
