/**
 * Spanish Vocabulary Learning App
 * A flashcard application for learning Spanish words
 * 
 * This version features:
 * - Modular, organized code structure
 * - Better state management
 * - Improved error handling
 * - Clean separation of concerns
 */

// ========================
// App Configuration
// ========================
const CONFIG = {
    storageKey: 'spanishVocabKnownWords',
    animationDuration: 300, // ms
    cardFlipDuration: 500   // ms
};

class SpanishVocabApp {
    constructor() {
        this.elements = this.cacheDOM();
        this.state = this.initializeState();
        this.initialize();
    }

    /**
     * Cache DOM elements
     */
    cacheDOM() {
        return {
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
            categoriesGrid: document.querySelector('.categories-grid'),
            backButton: document.getElementById('back-button'),
            wordCounter: document.getElementById('word-counter')
        };
    }

    /**
     * Initialize application state
     */
    initializeState() {
        const savedData = JSON.parse(localStorage.getItem('knownWords') || '{}');
        const knownWords = new Set(savedData.words || []);
        const knownWordsTimestamps = savedData.timestamps || {};
        const wordScores = savedData.wordScores || {}; // Track how well user knows each word
        
        return {
            currentCategory: null,
            currentWord: null,
            currentWordIndex: -1,
            isTransitioning: false,
            knownWords,
            knownWordsTimestamps,
            wordScores, // Track scores for spaced repetition
            animationDuration: 300, // ms, should match CSS
            COOLDOWN_DAYS: 2, // Base cooldown for known words
            REVIEW_THRESHOLD: 3, // Number of successful recalls before word is considered known
            currentSessionWords: [] // Track words shown in current session
        };
    }

    /**
     * Initialize the application
     */
    initialize() {
        if (!this.validateElements()) {
            console.error('Required DOM elements are missing');
            return;
        }

        this.setupEventListeners();
        this.renderCategories();
        this.updateProgress();
    }

    /**
     * Validate required DOM elements
     */
    validateElements() {
        return Object.values(this.elements).every(element => {
            if (!element) {
                console.error('Missing required element:', 
                    Object.keys(this.elements).find(key => this.elements[key] === element));
                return false;
            }
            return true;
        });
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Back button
        if (this.elements.backButton) {
            this.elements.backButton.addEventListener('click', () => this.returnToCategories());
        }

        // Category selection
        if (this.elements.categoriesContainer) {
            this.elements.categoriesContainer.addEventListener('click', (e) => {
                const categoryCard = e.target.closest('.category-card');
                if (categoryCard) {
                    const categoryId = categoryCard.dataset.categoryId;
                    const selectedCategory = categories.find(cat => cat.id === categoryId);
                    if (selectedCategory) {
                        this.startCategory(selectedCategory);
                    }
                }
            });
        }

        // Card controls
        if (this.elements.knowItBtn) {
            this.elements.knowItBtn.addEventListener('click', () => this.markAsKnown());
        }

        if (this.elements.dontKnowBtn) {
            this.elements.dontKnowBtn.addEventListener('click', () => this.markAsUnknown());
        }

        // Card flip
        if (this.elements.cardFront) {
            this.elements.cardFront.addEventListener('click', () => this.flipCard());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' || e.code === 'Enter') {
                if (this.elements.wordCard.classList.contains('card-flipped')) {
                    this.markAsKnown();
                } else {
                    this.flipCard();
                }
                e.preventDefault();
            } else if (e.code === 'ArrowRight') {
                this.markAsKnown();
                e.preventDefault();
            } else if (e.code === 'ArrowLeft') {
                this.markAsUnknown();
                e.preventDefault();
            } else if (e.code === 'Escape') {
                this.returnToCategories();
                e.preventDefault();
            }
        });
    }

    /**
     * Render category cards
     */
    renderCategories() {
        if (!this.elements.categoriesContainer) return;

        this.elements.categoriesContainer.innerHTML = categories.map(category => {
            const knownCount = this.getKnownWordCount(category.id);
            const progressPercent = category.words.length > 0 
                ? Math.round((knownCount / category.words.length) * 100) 
                : 0;
            
            return `
                <div class="category-card" data-category-id="${category.id}">
                    <h3>${category.name}</h3>
                    <p>${knownCount} من ${category.words.length} كلمة</p>
                    <div class="category-progress">
                        <div class="category-progress-bar" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Get count of known words in a category
     */
    getKnownWordCount(categoryId) {
        return Array.from(this.state.knownWords).filter(wordKey => {
            const [storedCategoryId] = wordKey.split('::');
            return storedCategoryId === categoryId;
        }).length;
    }

    /**
     * Start learning a category
     */
    startCategory(category) {
        if (!category?.words?.length) {
            console.error('Invalid category or empty word list');
            return;
        }

        this.state.currentCategory = category;
        this.state.currentWordIndex = -1;
        this.state.isTransitioning = false;
        this.state.currentSessionWords = [];

        const now = Date.now();
        const wordsWithScores = [];
        
        // Calculate scores for each word in the category
        category.words.forEach(word => {
            const wordKey = `${category.id}::${word.spanish}`;
            const isKnown = this.state.knownWords.has(wordKey);
            const lastSeen = this.state.knownWordsTimestamps[wordKey] || 0;
            const score = this.state.wordScores[wordKey] || 0;
            const cooldownTime = isKnown ? 
                this.state.COOLDOWN_DAYS * 24 * 60 * 60 * 1000 : 0;
            
            // Calculate word priority (lower is more important)
            let priority = 0;
            // Words not seen yet have highest priority
            if (lastSeen === 0) priority = 0;
            // Then words with lower scores (more difficult)
            else priority = 1 + (1 / (score + 1));
            // Then words that haven't been seen in a while
            priority += (now - lastSeen) / (1000 * 60 * 60 * 24); // Convert to days

            wordsWithScores.push({
                ...word,
                key: wordKey,
                priority,
                isKnown,
                lastSeen,
                cooldownTime,
                score
            });
        });

        // Sort words by priority (ascending)
        wordsWithScores.sort((a, b) => a.priority - b.priority);

        // Update UI state
        document.body.classList.add('word-card-active');
        this.elements.categoriesGrid.style.display = 'none';
        this.elements.wordCard.classList.remove('hidden');
        this.elements.wordCard.classList.add('visible');
        
        // Start with the sorted words
        this.state.availableWords = wordsWithScores;
        this.showNextWord();
    }

    /**
     * Show the next word in the current category
     */
    showNextWord() {
        if (this.state.isTransitioning) return;
        
        this.state.currentWordIndex++;
        this.updateWordCounter();
        
        // Check if we've gone through all available words
        if (this.state.currentWordIndex >= this.state.availableWords.length) {
            this.completeCategory();
            return;
        }
        
        this.state.isTransitioning = true;
        this.state.currentWord = this.state.availableWords[this.state.currentWordIndex];
        
        // Reset card state
        this.elements.wordCard.style.opacity = '0';
        this.elements.wordCard.classList.remove('card-flipped');
        
        // Update word content
        this.elements.spanishWord.textContent = this.state.currentWord.spanish;
        this.elements.translation.textContent = this.state.currentWord.translation;
        this.elements.example.textContent = this.state.currentWord.example || '';
        
        // Animate card in
        requestAnimationFrame(() => {
            this.elements.wordCard.style.opacity = '1';
            setTimeout(() => {
                this.state.isTransitioning = false;
            }, this.state.animationDuration);
        });
    }

    /**
     * Mark current word as known
     */
    markAsKnown() {
        if (!this.state.currentWord || !this.state.currentCategory) return;

        const wordKey = this.getWordKey();
        
        // Update word score (increment by 1, max of REVIEW_THRESHOLD)
        this.state.wordScores[wordKey] = Math.min(
            (this.state.wordScores[wordKey] || 0) + 1,
            this.state.REVIEW_THRESHOLD
        );

        // If word is consistently known, add to known words
        if (this.state.wordScores[wordKey] >= this.state.REVIEW_THRESHOLD) {
            this.state.knownWords.add(wordKey);
            
            // Set cooldown based on how well the word is known
            const now = new Date();
            const cooldownDays = this.calculateCooldownDays(wordKey);
            now.setDate(now.getDate() + cooldownDays);
            this.state.knownWordsTimestamps[wordKey] = now.getTime();
        }
        
        this.saveKnownWords();
        this.advanceToNextWord();
    }

    /**
     * Calculate cooldown days based on word's score and history
     */
    calculateCooldownDays(wordKey) {
        const score = this.state.wordScores[wordKey] || 0;
        const lastSeen = this.state.knownWordsTimestamps[wordKey] || 0;
        const now = Date.now();
        
        // If word was recently seen, increase cooldown
        if (lastSeen > 0) {
            const daysSinceLastSeen = (now - lastSeen) / (1000 * 60 * 60 * 24);
            return Math.min(
                Math.ceil(daysSinceLastSeen * 1.5), // Increase cooldown by 50%
                this.state.COOLDOWN_DAYS * 2 // But not more than double the base cooldown
            );
        }
        
        // For new words, use base cooldown
        return this.state.COOLDOWN_DAYS;
    }

    /**
     * Mark current word as unknown
     */
    markAsUnknown() {
        if (!this.state.currentWord || !this.state.currentCategory) {
            this.advanceToNextWord();
            return;
        }

        const wordKey = this.getWordKey();
        
        // Decrease score but don't go below 0
        this.state.wordScores[wordKey] = Math.max(
            (this.state.wordScores[wordKey] || 1) - 2, // Penalize more for not knowing
            0
        );
        
        // Remove from known words if it was there
        this.state.knownWords.delete(wordKey);
        
        // Move word to the front of the queue to review it again soon
        const currentWord = this.state.availableWords[this.state.currentWordIndex];
        if (currentWord) {
            // Insert the current word 3 positions ahead for quick review
            const insertAt = Math.min(
                this.state.currentWordIndex + 3,
                this.state.availableWords.length - 1
            );
            this.state.availableWords.splice(insertAt, 0, currentWord);
        }
        
        this.saveKnownWords();
        this.advanceToNextWord();
    }

    /**
     * Generate a unique key for a word
     */
    getWordKey() {
        return `${this.state.currentCategory.id}::${this.state.currentWord.spanish}`;
    }

    /**
     * Move to the next word with animation handling
     */
    advanceToNextWord() {
        if (this.elements.wordCard.classList.contains('card-flipped')) {
            this.elements.wordCard.classList.remove('card-flipped');
            setTimeout(() => this.showNextWord(), 180);
        } else {
            this.showNextWord();
        }
    }

    /**
     * Handle category completion
     */
    completeCategory() {
        this.elements.wordCard.classList.add('hidden');
        document.body.classList.remove('word-card-active');
        this.elements.wordCard.classList.remove('visible');
        this.elements.categoriesGrid.style.display = 'grid';
        this.renderCategories();
    }

    /**
     * Return to categories view
     */
    returnToCategories() {
        if (this.elements.cardInner.style.transform === 'rotateY(180deg)') {
            this.elements.cardInner.style.transform = 'rotateY(0deg)';
        }
        this.completeCategory();
    }

    /**
     * Update the word counter display
     */
    updateWordCounter() {
        if (!this.state.currentCategory || !this.elements.wordCounter) return;
        
        const totalWords = this.state.currentCategory.words.length;
        const currentPosition = Math.min(this.state.currentWordIndex + 1, totalWords);
        this.elements.wordCounter.textContent = `${currentPosition} من ${totalWords} كلمة`;
    }

    /**
     * Save known words to localStorage
     */
    saveKnownWords() {
        localStorage.setItem('knownWords', JSON.stringify({
            words: Array.from(this.state.knownWords),
            timestamps: this.state.knownWordsTimestamps,
            wordScores: this.state.wordScores
        }));
        this.updateProgress();
    }

    /**
     * Update progress indicators
     */
    updateProgress() {
        if (!this.elements.progressBar || !this.elements.progressText) return;

        const totalWords = categories.reduce((sum, cat) => sum + cat.words.length, 0);
        const progressPercent = totalWords > 0 
            ? Math.round((this.state.knownWords.size / totalWords) * 100) 
            : 0;

        this.elements.progressBar.style.width = `${progressPercent}%`;
        this.elements.progressText.textContent = `${progressPercent}% مكتمل`;
        this.renderCategories();
    }

    /**
     * Flip the flashcard
     */
    flipCard() {
        if (this.state.isTransitioning) return;

        this.elements.wordCard.classList.toggle('card-flipped');
        this.state.isTransitioning = true;
        
        setTimeout(() => {
            this.state.isTransitioning = false;
        }, this.state.animationDuration);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SpanishVocabApp();
});
