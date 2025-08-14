// DOM Elements
const categoriesContainer = document.getElementById('categories');
const spanishWordElement = document.getElementById('spanish-word');
const translationElement = document.getElementById('translation');
const exampleElement = document.getElementById('example');
const knowItBtn = document.getElementById('know-it');
const dontKnowBtn = document.getElementById('dont-know');
const progressBar = document.getElementById('progress');
const progressText = document.getElementById('progress-text');

// App State
let currentCategory = null;
let currentWord = null;
let knownWords = JSON.parse(localStorage.getItem('knownWords')) || [];
let currentWordIndex = 0;

// Initialize the app
function init() {
    renderCategories();
    setupEventListeners();
    updateProgress();
}

// Render category cards
function renderCategories() {
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryWords = category.words;
        const knownCount = categoryWords.filter(word => 
            knownWords.includes(`${category.id}-${word.spanish}`)
        ).length;
        
        const progressPercent = (knownCount / categoryWords.length) * 100;
        
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.innerHTML = `
            <h3>${category.name}</h3>
            <p>${knownCount} من ${categoryWords.length} كلمة</p>
            <div class="category-progress">
                <div class="category-progress-bar" style="width: ${progressPercent}%"></div>
            </div>
        `;
        
        categoryCard.addEventListener('click', () => startCategory(category));
        categoriesContainer.appendChild(categoryCard);
    });
}

// Start learning a specific category
function startCategory(category) {
    currentCategory = category;
    currentWordIndex = 0;
    const categoriesGrid = document.querySelector('.categories-grid');
    const wordCard = document.querySelector('.word-card');
    
    // Hide categories and show word card
    categoriesGrid.style.display = 'none';
    wordCard.classList.remove('hidden');
    wordCard.classList.add('visible');
    
    // Show the first word
    showNextWord();
}

// Show the next word in the current category
function showNextWord() {
    const wordCard = document.querySelector('.word-card');
    const categoriesGrid = document.querySelector('.categories-grid');
    
    // Reset card state - hide translation and buttons
    translationElement.style.visibility = 'hidden';
    exampleElement.style.visibility = 'hidden';
    knowItBtn.style.display = 'none';
    dontKnowBtn.style.display = 'none';
    
    // Check if we've reached the end of the category
    if (currentWordIndex >= currentCategory.words.length) {
        const categoryName = currentCategory.name;
        // Fade out the card
        wordCard.classList.add('hidden');
        
        setTimeout(() => {
            wordCard.classList.remove('visible');
            categoriesGrid.style.display = 'grid';
            renderCategories();
            // Show completion message after UI updates
            setTimeout(() => {
                alert(`تهانينا! لقد أكملت قسم ${categoryName}`);
            }, 50);
        }, 300); // Match CSS transition duration
        return;
    }
    
    // Set the new word content
    currentWord = currentCategory.words[currentWordIndex];
    spanishWordElement.textContent = currentWord.spanish;
    translationElement.textContent = currentWord.translation;
    exampleElement.textContent = currentWord.example || '';
    
    // Show the card with fade-in animation
    wordCard.style.display = 'block';
    // Force reflow to ensure the initial state is applied
    void wordCard.offsetWidth;
    wordCard.classList.add('visible');
    
    // Clear any existing click handlers and add new one
    wordCard.onclick = null;
    wordCard.onclick = function() {
        if (translationElement.style.visibility === 'visible') {
            // Hide translation and buttons
            translationElement.style.visibility = 'hidden';
            exampleElement.style.visibility = 'hidden';
            knowItBtn.style.display = 'none';
            dontKnowBtn.style.display = 'none';
        } else {
            // Show translation and buttons
            translationElement.style.visibility = 'visible';
            exampleElement.style.visibility = 'visible';
            knowItBtn.style.display = 'inline-block';
            dontKnowBtn.style.display = 'inline-block';
        }
    };
}

// Mark the current word as known
function markAsKnown() {
    const wordId = `${currentCategory.id}-${currentWord.spanish}`;
    if (!knownWords.includes(wordId)) {
        knownWords.push(wordId);
        localStorage.setItem('knownWords', JSON.stringify(knownWords));
    }
    nextWord();
}

// Mark the current word as unknown
function markAsUnknown() {
    nextWord();
}

// Move to the next word
function nextWord() {
    currentWordIndex++;
    updateProgress();
    showNextWord();
}

// Update progress bar and text
function updateProgress() {
    const totalWords = categories.reduce((sum, cat) => sum + cat.words.length, 0);
    const knownCount = knownWords.length;
    const progressPercent = Math.round((knownCount / totalWords) * 100);
    
    progressBar.style.width = `${progressPercent}%`;
    progressText.textContent = `${progressPercent}% مكتمل`;
    
    // Update category progress in the UI
    renderCategories();
}

// Set up event listeners
function setupEventListeners() {
    knowItBtn.addEventListener('click', markAsKnown);
    dontKnowBtn.addEventListener('click', markAsUnknown);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            if (knowItBtn.style.display !== 'none') {
                markAsKnown();
            } else {
                // Show translation if hidden
                const event = new Event('click');
                spanishWordElement.dispatchEvent(event);
            }
        } else if (e.key === 'ArrowLeft') {
            if (knowItBtn.style.display !== 'none') {
                markAsUnknown();
            } else {
                // Show translation if hidden
                const event = new Event('click');
                spanishWordElement.dispatchEvent(event);
            }
        } else if ((e.key === ' ' || e.key === 'Enter') && knowItBtn.style.display !== 'none') {
            markAsKnown();
            e.preventDefault();
        }
    });
}

// Start the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);
