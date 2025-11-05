/**
 * Meal Plan Controller
 * Handles meal plan generation requests
 */

const { generateMealPlan } = require('../services/openai.service');

/**
 * Generate meal plan controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function generateMealPlanController(req, res) {
  const startTime = Date.now();
  
  try {
    // Extract user preferences from validated request body
    const userPreferences = {
      familySize: req.body.familySize,
      dietaryRestrictions: req.body.dietaryRestrictions,
      cookingTime: req.body.cookingTime,
      cuisinePreferences: req.body.cuisinePreferences,
      dislikedIngredients: req.body.dislikedIngredients || '',
      additionalNotes: req.body.additionalNotes || '',
    };
    
    console.log('📝 Generating meal plan request:', {
      familySize: userPreferences.familySize,
      restrictions: userPreferences.dietaryRestrictions,
      cookingTime: userPreferences.cookingTime,
      cuisines: userPreferences.cuisinePreferences,
      timestamp: new Date().toISOString(),
    });
    
    // Call OpenAI service to generate meal plan
    const mealPlan = await generateMealPlan(userPreferences);
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ Meal plan generated successfully in ${responseTime}ms`);
    
    // Return success response
    res.status(200).json({
      success: true,
      data: mealPlan,
      message: 'Meal plan generated successfully',
      responseTime: `${responseTime}ms`,
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('❌ Error generating meal plan:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    
    // Determine appropriate status code and error message
    let statusCode = 500;
    let errorMessage = 'An unexpected error occurred. Please try again later.';
    
    if (error.message.includes('API key')) {
      statusCode = 503;
      errorMessage = 'The AI service is not properly configured. Please contact support.';
    } else if (error.message.includes('rate limit') || error.message.includes('quota')) {
      statusCode = 503;
      errorMessage = 'The AI service is currently unavailable. Please try again in a few minutes.';
    } else if (error.message.includes('validation') || error.message.includes('Invalid')) {
      statusCode = 400;
      errorMessage = error.message;
    } else if (error.message.includes('temporarily unavailable')) {
      statusCode = 503;
      errorMessage = 'Unable to generate meal plan at this time. Please try again later.';
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      responseTime: `${responseTime}ms`,
    });
  }
}

module.exports = {
  generateMealPlanController,
};
