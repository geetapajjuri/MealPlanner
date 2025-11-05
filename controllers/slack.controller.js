/**
 * Slack Controller
 * Handles requests to send meal plans to Slack
 */

const { sendToSlack } = require('../services/slack.service');

/**
 * Send meal plan to Slack controller
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
async function sendToSlackController(req, res) {
  const startTime = Date.now();
  
  try {
    // Extract meal plan from request body
    const mealPlan = req.body;
    
    console.log('📤 Slack send request received:', {
      meals: mealPlan.meals?.length || 0,
      timestamp: new Date().toISOString(),
    });
    
    // Validate meal plan
    if (!mealPlan.meals || !Array.isArray(mealPlan.meals) || mealPlan.meals.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid meal plan data. Meals array is required.',
      });
    }
    
    // Send to Slack
    const result = await sendToSlack(mealPlan);
    
    const responseTime = Date.now() - startTime;
    console.log(`${result.success ? '✅' : '❌'} Slack send completed in ${responseTime}ms`);
    
    if (result.success) {
      res.status(200).json({
        success: true,
        message: result.message,
        responseTime: `${responseTime}ms`,
      });
    } else {
      res.status(500).json({
        success: false,
        error: result.message,
        responseTime: `${responseTime}ms`,
      });
    }
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error('❌ Error in Slack controller:', {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
    
    res.status(500).json({
      success: false,
      error: 'Unable to send to Slack. Please try again.',
      responseTime: `${responseTime}ms`,
    });
  }
}

module.exports = {
  sendToSlackController,
};
