/**
 * OpenAI Service Module
 * Handles AI-powered meal plan generation using OpenAI GPT-4
 */

require('dotenv').config();
const OpenAI = require('openai');
const { generateFreeMealPlan } = require('./freeMealPlan.service');

// ============================================
// CONFIGURATION
// ============================================

// Validate API key (warn but don't throw - check at runtime instead)
if (!process.env.OPENAI_API_KEY) {
  console.warn('⚠️ OPENAI_API_KEY not configured. Meal plan generation will fail until configured.');
}

// Initialize OpenAI client (will be null if key not provided)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Configuration constants
const MODEL = 'gpt-4';
const TEMPERATURE = 0.7;
const MAX_TOKENS = 1500;
const MAX_RETRIES = 3;

// System prompt per PRD
const SYSTEM_PROMPT = `You are an expert meal planning assistant. Generate exactly 7 unique dinner meal suggestions for one week based on the provided user preferences. Return your response as valid JSON only.

Required JSON structure:
{
  "meals": [
    {
      "day": "Monday",
      "title": "Meal Name",
      "description": "Brief 2-3 sentence description",
      "cookingTime": "estimated minutes",
      "cuisine": "cuisine type"
    }
  ]
}

Requirements:
- Each meal must be unique and different
- Respect all dietary restrictions provided
- Stay within specified cooking time limits
- Include variety of cuisines as requested
- Avoid ingredients listed as dislikes
- Meals should be suitable for specified family size`;

// ============================================
// MAIN FUNCTIONS
// ============================================

/**
 * Generate a weekly meal plan based on user preferences
 * @param {Object} userPreferences - User's meal preferences
 * @param {number} userPreferences.familySize - Number of people (1-8)
 * @param {Array<string>} userPreferences.dietaryRestrictions - Dietary restrictions
 * @param {string} userPreferences.cookingTime - Preferred cooking time
 * @param {Array<string>} userPreferences.cuisinePreferences - Preferred cuisines
 * @param {string} userPreferences.dislikedIngredients - Disliked ingredients (optional)
 * @param {string} userPreferences.additionalNotes - Additional notes (optional)
 * @returns {Promise<Object>} Meal plan with meals array
 */
async function generateMealPlan(userPreferences) {
  console.log('🎯 Generating meal plan for:', {
    familySize: userPreferences.familySize,
    restrictions: userPreferences.dietaryRestrictions?.length,
    cuisines: userPreferences.cuisinePreferences?.length,
  });

  // Validate preferences
  validatePreferences(userPreferences);

  // Check if OpenAI is available
  if (!openai) {
    console.log('⚠️ OpenAI not configured, using free meal plan service');
    return generateFreeMealPlan(userPreferences);
  }

  // Try OpenAI first, fallback to free meal plan on error
  try {
    // Build user prompt
    const userPrompt = buildUserPrompt(userPreferences);
    
    console.log('📝 User prompt prepared, calling OpenAI API...');

    // Make API call with retry logic
    const mealPlan = await retryWithBackoff(
      () => callOpenAI(userPrompt),
      MAX_RETRIES
    );

    // Validate response
    validateMealPlan(mealPlan);

    console.log('✅ Meal plan generated successfully:', mealPlan.meals.length, 'meals');
    
    return mealPlan;
  } catch (error) {
    console.warn('⚠️ OpenAI failed, falling back to free meal plan:', error.message);
    return generateFreeMealPlan(userPreferences);
  }
}

/**
 * Call OpenAI API to generate meal plan
 * @param {string} userPrompt - User prompt with preferences
 * @returns {Promise<Object>} Parsed meal plan object
 */
async function callOpenAI(userPrompt) {
  // Check if OpenAI is configured
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.');
  }

  try {
    const completion = await openai.chat.completions.create({
      model: MODEL,
      temperature: TEMPERATURE,
      max_tokens: MAX_TOKENS,
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract response content
    const content = completion.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Empty response from OpenAI API');
    }

    console.log('📥 Received response from OpenAI');

    // Parse JSON response (handle markdown code blocks)
    const mealPlan = parseAIResponse(content);
    
    return mealPlan;

  } catch (error) {
    console.error('❌ OpenAI API error:', error.message);
    
    if (error.code === 'invalid_api_key') {
      throw new Error('Invalid OpenAI API key. Please check your configuration.');
    } else if (error.code === 'rate_limit_exceeded') {
      throw new Error('API rate limit exceeded. Please try again in a moment.');
    } else if (error.code === 'insufficient_quota') {
      throw new Error('OpenAI API quota exceeded. Please check your account.');
    } else {
      throw new Error('The AI service is temporarily unavailable. Please try again.');
    }
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Build user prompt from preferences
 * @param {Object} prefs - User preferences
 * @returns {string} Formatted user prompt
 */
function buildUserPrompt(prefs) {
  let prompt = `Generate a weekly meal plan for ${prefs.familySize} ${prefs.familySize === 1 ? 'person' : 'people'} with the following preferences:\n`;
  
  prompt += `- Dietary restrictions: ${formatArray(prefs.dietaryRestrictions)}\n`;
  prompt += `- Preferred cooking time: ${prefs.cookingTime}\n`;
  prompt += `- Cuisine preferences: ${formatArray(prefs.cuisinePreferences)}\n`;
  
  if (prefs.dislikedIngredients) {
    prompt += `- Disliked ingredients: ${prefs.dislikedIngredients}\n`;
  }
  
  if (prefs.additionalNotes) {
    prompt += `- Additional notes: ${prefs.additionalNotes}\n`;
  }
  
  return prompt;
}

/**
 * Format array as comma-separated string
 * @param {Array} arr - Array to format
 * @returns {string} Formatted string
 */
function formatArray(arr) {
  if (!arr || arr.length === 0) return 'None';
  return arr.join(', ');
}

/**
 * Parse AI response, handling various formats
 * @param {string} content - Response content from AI
 * @returns {Object} Parsed meal plan object
 */
function parseAIResponse(content) {
  // Remove markdown code blocks if present
  let jsonString = content.trim();
  
  // Remove ```json or ``` markers
  jsonString = jsonString.replace(/^```json\s*/i, '');
  jsonString = jsonString.replace(/^```\s*/, '');
  jsonString = jsonString.replace(/\s*```$/, '');
  jsonString = jsonString.trim();
  
  try {
    const mealPlan = JSON.parse(jsonString);
    return mealPlan;
  } catch (error) {
    console.error('❌ Failed to parse AI response as JSON:', error.message);
    console.error('Response content:', content.substring(0, 200));
    throw new Error('Invalid meal plan format received from AI. Please try again.');
  }
}

/**
 * Validate user preferences
 * @param {Object} prefs - User preferences to validate
 * @throws {Error} If validation fails
 */
function validatePreferences(prefs) {
  if (!prefs) {
    throw new Error('User preferences are required');
  }
  
  if (!prefs.familySize || prefs.familySize < 1 || prefs.familySize > 8) {
    throw new Error('Family size must be between 1 and 8');
  }
  
  if (!prefs.dietaryRestrictions || prefs.dietaryRestrictions.length === 0) {
    throw new Error('At least one dietary restriction must be specified');
  }
  
  if (!prefs.cookingTime) {
    throw new Error('Cooking time preference is required');
  }
  
  if (!prefs.cuisinePreferences || prefs.cuisinePreferences.length === 0) {
    throw new Error('At least one cuisine preference must be specified');
  }
}

/**
 * Validate generated meal plan
 * @param {Object} mealPlan - Meal plan to validate
 * @throws {Error} If validation fails
 */
function validateMealPlan(mealPlan) {
  if (!mealPlan || typeof mealPlan !== 'object') {
    throw new Error('Invalid meal plan structure');
  }
  
  if (!mealPlan.meals || !Array.isArray(mealPlan.meals)) {
    throw new Error('Meal plan must contain a meals array');
  }
  
  if (mealPlan.meals.length !== 7) {
    throw new Error(`Expected 7 meals, got ${mealPlan.meals.length}`);
  }
  
  // Validate each meal
  mealPlan.meals.forEach((meal, index) => {
    if (!meal.day || typeof meal.day !== 'string') {
      throw new Error(`Meal ${index + 1} missing or invalid 'day' field`);
    }
    
    if (!meal.title || typeof meal.title !== 'string') {
      throw new Error(`Meal ${index + 1} missing or invalid 'title' field`);
    }
    
    if (!meal.description || typeof meal.description !== 'string') {
      throw new Error(`Meal ${index + 1} missing or invalid 'description' field`);
    }
    
    if (!meal.cookingTime || typeof meal.cookingTime !== 'string') {
      throw new Error(`Meal ${index + 1} missing or invalid 'cookingTime' field`);
    }
    
    if (!meal.cuisine || typeof meal.cuisine !== 'string') {
      throw new Error(`Meal ${index + 1} missing or invalid 'cuisine' field`);
    }
  });
  
  console.log('✅ Meal plan validation passed');
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} retries - Number of retries
 * @returns {Promise} Result of function
 */
async function retryWithBackoff(fn, retries) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === retries - 1;
      
      if (isLastRetry) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      console.log(`⚠️ Attempt ${i + 1} failed, retrying in ${delay}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

// ============================================
// EXPORTS
// ============================================

module.exports = {
  generateMealPlan,
};
