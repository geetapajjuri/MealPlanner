/**
 * Validation Middleware
 * Validates incoming meal plan requests using express-validator
 */

const { body, validationResult } = require('express-validator');

/**
 * Validation rules for meal plan generation request
 */
const validateMealPlanRequest = [
  // Family size validation
  body('familySize')
    .notEmpty()
    .withMessage('Family size is required')
    .isInt({ min: 1, max: 8 })
    .withMessage('Family size must be between 1 and 8')
    .toInt(),
  
  // Dietary restrictions validation
  body('dietaryRestrictions')
    .notEmpty()
    .withMessage('Dietary restrictions are required')
    .isArray({ min: 1 })
    .withMessage('At least one dietary restriction must be selected'),
  
  body('dietaryRestrictions.*')
    .isString()
    .withMessage('Each dietary restriction must be a string')
    .isIn([
      'Vegetarian',
      'Vegan',
      'Gluten-free',
      'Dairy-free',
      'Nut allergies',
      'Keto',
      'Paleo',
      'None'
    ])
    .withMessage('Invalid dietary restriction'),
  
  // Cooking time validation
  body('cookingTime')
    .notEmpty()
    .withMessage('Cooking time is required')
    .isString()
    .withMessage('Cooking time must be a string')
    .isIn(['15 minutes', '30 minutes', '45 minutes', '1+ hour'])
    .withMessage('Invalid cooking time selection'),
  
  // Cuisine preferences validation
  body('cuisinePreferences')
    .notEmpty()
    .withMessage('Cuisine preferences are required')
    .isArray({ min: 1 })
    .withMessage('At least one cuisine preference must be selected'),
  
  body('cuisinePreferences.*')
    .isString()
    .withMessage('Each cuisine preference must be a string')
    .isIn([
      'Italian',
      'Mexican',
      'Asian',
      'American',
      'Mediterranean',
      'Indian'
    ])
    .withMessage('Invalid cuisine preference'),
  
  // Disliked ingredients validation (optional)
  body('dislikedIngredients')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Disliked ingredients must be a string')
    .isLength({ max: 200 })
    .withMessage('Disliked ingredients must be 200 characters or less')
    .trim(),
  
  // Additional notes validation (optional)
  body('additionalNotes')
    .optional({ checkFalsy: true })
    .isString()
    .withMessage('Additional notes must be a string')
    .isLength({ max: 500 })
    .withMessage('Additional notes must be 500 characters or less')
    .trim(),
];

/**
 * Handle validation errors
 */
function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    
    console.warn('⚠️ Validation errors:', errorMessages);
    
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errorMessages,
    });
  }
  
  next();
}

/**
 * Validation rules for Slack send request
 */
const validateSlackRequest = [
  body('meals')
    .notEmpty()
    .withMessage('Meals array is required')
    .isArray({ min: 1 })
    .withMessage('Meals must be an array with at least one meal'),
  
  body('meals.*.day')
    .notEmpty()
    .withMessage('Each meal must have a day'),
  
  body('meals.*.title')
    .notEmpty()
    .withMessage('Each meal must have a title'),
  
  body('meals.*.description')
    .notEmpty()
    .withMessage('Each meal must have a description'),
];

module.exports = {
  validateMealPlanRequest,
  validateSlackRequest,
  handleValidationErrors,
};
