/**
 * Geeta's AI Meal Planner - Frontend JavaScript
 * Handles form validation, API calls, and UI updates
 */

// ============================================
// STATE MANAGEMENT
// ============================================
let currentMealPlan = null;

// ============================================
// DOM ELEMENTS
// ============================================
const form = document.getElementById('mealPlanForm');
const submitBtn = document.getElementById('submitBtn');
const formSection = document.getElementById('formSection');
const resultsSection = document.getElementById('resultsSection');
const mealPlanContainer = document.getElementById('mealPlanContainer');
const errorContainer = document.getElementById('errorContainer');
const loadingOverlay = document.getElementById('loadingOverlay');
const generateNewBtn = document.getElementById('generateNewBtn');
const sendToSlackBtn = document.getElementById('sendToSlackBtn');
const slackStatus = document.getElementById('slackStatus');
const additionalNotes = document.getElementById('additionalNotes');
const charCount = document.getElementById('charCount');

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
  
  // Generate new plan button
  generateNewBtn.addEventListener('click', resetToForm);
  
  // Send to Slack button
  sendToSlackBtn.addEventListener('click', handleSendToSlack);
  
  // Character counter for additional notes
  additionalNotes.addEventListener('input', updateCharacterCount);
  
  console.log('✅ Meal Planner initialized');
});

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

/**
 * Handle form submission
 * @param {Event} e - Submit event
 */
async function handleFormSubmit(e) {
  e.preventDefault();
  
  // Clear previous errors
  clearErrors();
  
  // Validate form
  const formData = collectFormData();
  const validationErrors = validateFormData(formData);
  
  if (validationErrors.length > 0) {
    displayErrors(validationErrors);
    return;
  }
  
  // Show loading state
  setLoadingState(true);
  
  try {
    // Call API to generate meal plan
    const response = await fetch('/api/generate-meal-plan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate meal plan');
    }
    
    if (data.success && data.data && data.data.meals) {
      // Store meal plan
      currentMealPlan = data.data;
      
      // Display meal plan
      displayMealPlan(data.data);
    } else {
      throw new Error('Invalid response format from server');
    }
    
  } catch (error) {
    console.error('Error generating meal plan:', error);
    displayErrors([
      error.message || 'Unable to generate meal plan. Please try again.'
    ]);
  } finally {
    setLoadingState(false);
  }
}

/**
 * Collect form data into structured object
 * @returns {Object} Form data
 */
function collectFormData() {
  const familySize = document.getElementById('familySize').value;
  
  // Collect checked dietary restrictions
  const dietaryRestrictions = Array.from(
    document.querySelectorAll('input[name="dietaryRestrictions"]:checked')
  ).map(input => input.value);
  
  // Get selected cooking time
  const cookingTime = document.querySelector('input[name="cookingTime"]:checked')?.value || '';
  
  // Collect checked cuisine preferences
  const cuisinePreferences = Array.from(
    document.querySelectorAll('input[name="cuisinePreferences"]:checked')
  ).map(input => input.value);
  
  const dislikedIngredients = document.getElementById('dislikedIngredients').value.trim();
  const additionalNotes = document.getElementById('additionalNotes').value.trim();
  
  return {
    familySize: parseInt(familySize) || 0,
    dietaryRestrictions,
    cookingTime,
    cuisinePreferences,
    dislikedIngredients,
    additionalNotes,
  };
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {Array} Array of error messages
 */
function validateFormData(formData) {
  const errors = [];
  
  // Validate family size
  if (!formData.familySize || formData.familySize < 1 || formData.familySize > 8) {
    errors.push('Please select a valid family size (1-8 people)');
  }
  
  // Validate dietary restrictions
  if (!formData.dietaryRestrictions || formData.dietaryRestrictions.length === 0) {
    errors.push('Please select at least one dietary restriction (or select "None")');
  }
  
  // Validate cooking time
  if (!formData.cookingTime) {
    errors.push('Please select your preferred cooking time');
  }
  
  // Validate cuisine preferences
  if (!formData.cuisinePreferences || formData.cuisinePreferences.length === 0) {
    errors.push('Please select at least one cuisine preference');
  }
  
  return errors;
}

// ============================================
// UI STATE MANAGEMENT
// ============================================

/**
 * Set loading state
 * @param {boolean} isLoading - Whether to show loading state
 */
function setLoadingState(isLoading) {
  if (isLoading) {
    loadingOverlay.style.display = 'flex';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Generating Your Meal Plan...';
    
    // Disable all form inputs
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => input.disabled = true);
  } else {
    loadingOverlay.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Generate My Meal Plan';
    
    // Re-enable all form inputs
    const inputs = form.querySelectorAll('input, select, textarea, button');
    inputs.forEach(input => input.disabled = false);
  }
}

/**
 * Display errors to user
 * @param {Array} errors - Array of error messages
 */
function displayErrors(errors) {
  if (errors.length === 0) return;
  
  errorContainer.innerHTML = errors.map(error => `
    <div class="error-message">
      <span class="error-icon">⚠️</span>
      <span>${error}</span>
    </div>
  `).join('');
  
  errorContainer.style.display = 'block';
  
  // Scroll to error
  errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * Clear error messages
 */
function clearErrors() {
  errorContainer.innerHTML = '';
  errorContainer.style.display = 'none';
}

/**
 * Update character count for additional notes
 */
function updateCharacterCount() {
  const count = additionalNotes.value.length;
  charCount.textContent = count;
  
  if (count > 450) {
    charCount.parentElement.style.color = 'var(--warning-color)';
  } else {
    charCount.parentElement.style.color = 'var(--text-secondary)';
  }
}

// ============================================
// MEAL PLAN DISPLAY
// ============================================

/**
 * Display meal plan in results section
 * @param {Object} mealPlan - Meal plan data with meals array
 */
function displayMealPlan(mealPlan) {
  if (!mealPlan || !mealPlan.meals || mealPlan.meals.length === 0) {
    displayErrors(['No meals were generated. Please try again.']);
    return;
  }
  
  // Clear previous results
  mealPlanContainer.innerHTML = '';
  
  // Create meal cards
  mealPlan.meals.forEach((meal, index) => {
    const mealCard = createMealCard(meal);
    mealPlanContainer.appendChild(mealCard);
  });
  
  // Hide form, show results
  formSection.style.display = 'none';
  resultsSection.style.display = 'block';
  
  // Reset Slack button state
  sendToSlackBtn.disabled = false;
  sendToSlackBtn.textContent = '📤 Send to Slack';
  slackStatus.style.display = 'none';
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  
  console.log('✅ Meal plan displayed:', mealPlan.meals.length, 'meals');
}

/**
 * Create a meal card element
 * @param {Object} meal - Meal data
 * @returns {HTMLElement} Meal card element
 */
function createMealCard(meal) {
  const card = document.createElement('div');
  card.className = 'meal-card';
  
  card.innerHTML = `
    <div class="meal-day">${escapeHtml(meal.day)}</div>
    <h3 class="meal-title">${escapeHtml(meal.title)}</h3>
    <p class="meal-description">${escapeHtml(meal.description)}</p>
    <div class="meal-badges">
      <span class="badge badge-time">⏱️ ${escapeHtml(meal.cookingTime)}</span>
      <span class="badge badge-cuisine">🍴 ${escapeHtml(meal.cuisine)}</span>
    </div>
  `;
  
  return card;
}

/**
 * Reset to form view
 */
function resetToForm() {
  // Hide results, show form
  resultsSection.style.display = 'none';
  formSection.style.display = 'block';
  
  // Clear form
  form.reset();
  
  // Clear errors
  clearErrors();
  
  // Reset character count
  charCount.textContent = '0';
  
  // Clear meal plan state
  currentMealPlan = null;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
  
  console.log('✅ Reset to form');
}

// ============================================
// SLACK INTEGRATION
// ============================================

/**
 * Send meal plan to Slack
 */
async function handleSendToSlack() {
  if (!currentMealPlan) {
    displaySlackStatus('error', 'No meal plan available to send');
    return;
  }
  
  // Set loading state for Slack button
  sendToSlackBtn.disabled = true;
  sendToSlackBtn.textContent = '📤 Sending...';
  slackStatus.style.display = 'none';
  
  try {
    const response = await fetch('/api/send-to-slack', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentMealPlan),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send to Slack');
    }
    
    if (data.success) {
      displaySlackStatus('success', '✅ Meal plan sent to Slack successfully!');
      sendToSlackBtn.textContent = '✓ Sent to Slack';
      // Keep button disabled after successful send
    } else {
      throw new Error(data.error || 'Failed to send to Slack');
    }
    
  } catch (error) {
    console.error('Error sending to Slack:', error);
    displaySlackStatus('error', `❌ ${error.message || 'Unable to send to Slack. Please try again.'}`);
    
    // Re-enable button on error
    sendToSlackBtn.disabled = false;
    sendToSlackBtn.textContent = '📤 Send to Slack';
  }
}

/**
 * Display Slack status message
 * @param {string} type - 'success' or 'error'
 * @param {string} message - Status message
 */
function displaySlackStatus(type, message) {
  slackStatus.className = `slack-status ${type}`;
  slackStatus.textContent = message;
  slackStatus.style.display = 'block';
  
  // Scroll to status message
  slackStatus.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
  if (!text) return '';
  
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Format array as comma-separated string
 * @param {Array} arr - Array to format
 * @returns {string} Formatted string
 */
function formatArray(arr) {
  if (!arr || arr.length === 0) return '';
  return arr.join(', ');
}

// ============================================
// CONSOLE GREETING
// ============================================
console.log('%c🍽️ Geeta\'s AI Meal Planner', 'font-size: 20px; font-weight: bold; color: #4f46e5;');
console.log('%cPowered by OpenAI GPT-4', 'font-size: 12px; color: #6b7280;');
console.log('%cReady to generate your personalized meal plan!', 'font-size: 12px; color: #10b981;');
