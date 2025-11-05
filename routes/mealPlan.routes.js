/**
 * Meal Plan Routes
 * API routes for meal planning operations
 */

const express = require('express');
const router = express.Router();

// Controllers
const { generateMealPlanController } = require('../controllers/mealPlan.controller');
const { sendToSlackController } = require('../controllers/slack.controller');

// Middleware
const { sanitizeInputs } = require('../middleware/sanitize.middleware');
const { 
  validateMealPlanRequest, 
  validateSlackRequest,
  handleValidationErrors 
} = require('../middleware/validate.middleware');

// ============================================
// MIDDLEWARE FOR ALL ROUTES
// ============================================

// Log all API requests
router.use((req, res, next) => {
  console.log(`📡 API Request: ${req.method} ${req.path}`, {
    timestamp: new Date().toISOString(),
    ip: req.ip,
  });
  next();
});

// ============================================
// ROUTES
// ============================================

/**
 * POST /api/generate-meal-plan
 * Generate a weekly meal plan based on user preferences
 */
router.post(
  '/generate-meal-plan',
  sanitizeInputs,
  validateMealPlanRequest,
  handleValidationErrors,
  generateMealPlanController
);

/**
 * POST /api/send-to-slack
 * Send meal plan to Slack channel
 */
router.post(
  '/send-to-slack',
  sanitizeInputs,
  validateSlackRequest,
  handleValidationErrors,
  sendToSlackController
);

// ============================================
// EXPORTS
// ============================================

module.exports = router;
