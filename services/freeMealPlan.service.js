/**
 * Free Meal Plan Service
 * Provides free meal plan options using predefined recipes and simple logic
 * Fallback when OpenAI is not available or has no credits
 */

/**
 * Generate a free meal plan based on user preferences
 * @param {Object} userPreferences - User's meal preferences
 * @returns {Object} Meal plan with meals array
 */
function generateFreeMealPlan(userPreferences) {
  console.log('🆓 Generating free meal plan (no API required)');
  
  const { familySize, dietaryRestrictions, cookingTime, cuisinePreferences } = userPreferences;
  
  // Get all available meals that match preferences
  const availableMeals = filterMealsByPreferences(
    ALL_MEALS,
    dietaryRestrictions,
    cookingTime,
    cuisinePreferences
  );
  
  // Select 7 unique meals
  const selectedMeals = selectSevenUniqueMeals(availableMeals);
  
  // Assign days of the week
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealPlan = {
    meals: selectedMeals.map((meal, index) => ({
      day: days[index],
      title: meal.title,
      description: meal.description,
      cookingTime: meal.cookingTime,
      cuisine: meal.cuisine,
    })),
  };
  
  console.log('✅ Free meal plan generated successfully');
  return mealPlan;
}

/**
 * Filter meals by user preferences
 */
function filterMealsByPreferences(meals, restrictions, cookingTime, cuisines) {
  return meals.filter(meal => {
    // Check dietary restrictions
    const meetsRestrictions = restrictions.some(restriction => {
      if (restriction === 'None') return true;
      return meal.restrictions.includes(restriction);
    });
    
    // Check cooking time
    const timeValue = parseInt(meal.cookingTime);
    const preferredTime = parseInt(cookingTime);
    const meetsTime = timeValue <= preferredTime + 15; // Allow 15 min buffer
    
    // Check cuisine
    const meetsCuisine = cuisines.includes(meal.cuisine);
    
    return meetsRestrictions && meetsTime && meetsCuisine;
  });
}

/**
 * Select 7 unique meals randomly
 */
function selectSevenUniqueMeals(meals) {
  const shuffled = [...meals].sort(() => Math.random() - 0.5);
  
  // If we have less than 7 meals, repeat some
  if (shuffled.length < 7) {
    while (shuffled.length < 7) {
      shuffled.push(...shuffled.slice(0, 7 - shuffled.length));
    }
  }
  
  return shuffled.slice(0, 7);
}

/**
 * Database of free meal recipes
 */
const ALL_MEALS = [
  // Italian
  {
    title: 'Spaghetti Marinara',
    description: 'Classic Italian pasta with fresh tomato sauce, garlic, and basil. Simple yet delicious.',
    cookingTime: '25 minutes',
    cuisine: 'Italian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Penne Arrabbiata',
    description: 'Spicy Italian pasta with tomatoes, garlic, and red chili peppers. Quick and flavorful.',
    cookingTime: '20 minutes',
    cuisine: 'Italian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Caprese Salad with Pasta',
    description: 'Fresh mozzarella, tomatoes, and basil tossed with pasta. Light and refreshing.',
    cookingTime: '15 minutes',
    cuisine: 'Italian',
    restrictions: ['Vegetarian', 'Gluten-free', 'None'],
  },
  {
    title: 'Vegetarian Lasagna',
    description: 'Layers of pasta, ricotta, vegetables, and marinara sauce. Comfort food at its best.',
    cookingTime: '60 minutes',
    cuisine: 'Italian',
    restrictions: ['Vegetarian', 'None'],
  },
  
  // Mexican
  {
    title: 'Black Bean Tacos',
    description: 'Seasoned black beans in soft tortillas with fresh toppings. Easy and protein-rich.',
    cookingTime: '20 minutes',
    cuisine: 'Mexican',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  {
    title: 'Vegetarian Burrito Bowl',
    description: 'Rice, beans, veggies, and salsa in a bowl. Customizable and filling.',
    cookingTime: '25 minutes',
    cuisine: 'Mexican',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  {
    title: 'Cheese Quesadillas',
    description: 'Crispy tortillas filled with melted cheese. Quick weeknight dinner.',
    cookingTime: '15 minutes',
    cuisine: 'Mexican',
    restrictions: ['Vegetarian', 'None'],
  },
  {
    title: 'Veggie Fajitas',
    description: 'Sizzling peppers and onions with warm tortillas. Colorful and healthy.',
    cookingTime: '20 minutes',
    cuisine: 'Mexican',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  
  // Asian
  {
    title: 'Vegetable Stir-Fry',
    description: 'Colorful veggies with soy sauce and ginger over rice. Fast and nutritious.',
    cookingTime: '15 minutes',
    cuisine: 'Asian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  {
    title: 'Tofu Fried Rice',
    description: 'Rice with scrambled tofu, vegetables, and soy sauce. Great for using leftovers.',
    cookingTime: '20 minutes',
    cuisine: 'Asian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Vegetable Lo Mein',
    description: 'Soft noodles tossed with crisp vegetables in savory sauce. Takeout-style at home.',
    cookingTime: '20 minutes',
    cuisine: 'Asian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Pad Thai',
    description: 'Sweet and tangy rice noodles with peanuts and lime. Thai restaurant favorite.',
    cookingTime: '25 minutes',
    cuisine: 'Asian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  
  // American
  {
    title: 'Veggie Burger',
    description: 'Hearty plant-based burger with all the fixings. Classic American comfort.',
    cookingTime: '20 minutes',
    cuisine: 'American',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Grilled Cheese & Tomato Soup',
    description: 'Crispy grilled cheese with creamy tomato soup. Ultimate comfort meal.',
    cookingTime: '20 minutes',
    cuisine: 'American',
    restrictions: ['Vegetarian', 'None'],
  },
  {
    title: 'Mac and Cheese',
    description: 'Creamy, cheesy pasta that everyone loves. Quick and satisfying.',
    cookingTime: '20 minutes',
    cuisine: 'American',
    restrictions: ['Vegetarian', 'None'],
  },
  {
    title: 'Sweet Potato Fries Bowl',
    description: 'Baked sweet potato fries with black beans and avocado. Healthy and delicious.',
    cookingTime: '30 minutes',
    cuisine: 'American',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  
  // Mediterranean
  {
    title: 'Falafel with Hummus',
    description: 'Crispy chickpea fritters with creamy hummus and pita. Middle Eastern classic.',
    cookingTime: '30 minutes',
    cuisine: 'Mediterranean',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Greek Salad Bowl',
    description: 'Fresh vegetables, olives, feta, and chickpeas over rice. Light and refreshing.',
    cookingTime: '15 minutes',
    cuisine: 'Mediterranean',
    restrictions: ['Vegetarian', 'Gluten-free', 'None'],
  },
  {
    title: 'Vegetable Couscous',
    description: 'Fluffy couscous with roasted vegetables and herbs. Quick and flavorful.',
    cookingTime: '25 minutes',
    cuisine: 'Mediterranean',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
  {
    title: 'Shakshuka',
    description: 'Poached eggs in spicy tomato sauce with crusty bread. Israeli breakfast for dinner.',
    cookingTime: '30 minutes',
    cuisine: 'Mediterranean',
    restrictions: ['Vegetarian', 'Gluten-free', 'None'],
  },
  
  // Indian
  {
    title: 'Chana Masala',
    description: 'Spiced chickpeas in tomato sauce with rice. Protein-packed and flavorful.',
    cookingTime: '30 minutes',
    cuisine: 'Indian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  {
    title: 'Vegetable Curry',
    description: 'Mixed vegetables in creamy coconut curry sauce. Aromatic and comforting.',
    cookingTime: '35 minutes',
    cuisine: 'Indian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  {
    title: 'Dal (Lentil Curry)',
    description: 'Spiced red lentils with rice and naan. Simple, healthy, and filling.',
    cookingTime: '30 minutes',
    cuisine: 'Indian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'Gluten-free', 'None'],
  },
  {
    title: 'Paneer Tikka Masala',
    description: 'Indian cheese in creamy tomato sauce with rice. Rich and satisfying.',
    cookingTime: '40 minutes',
    cuisine: 'Indian',
    restrictions: ['Vegetarian', 'Gluten-free', 'None'],
  },
  
  // Quick Options (15 minutes)
  {
    title: 'Avocado Toast with Eggs',
    description: 'Smashed avocado on toast with fried eggs. Trendy and nutritious.',
    cookingTime: '10 minutes',
    cuisine: 'American',
    restrictions: ['Vegetarian', 'None'],
  },
  {
    title: 'Caprese Sandwich',
    description: 'Fresh mozzarella, tomatoes, and basil on crusty bread. Italian simplicity.',
    cookingTime: '10 minutes',
    cuisine: 'Italian',
    restrictions: ['Vegetarian', 'None'],
  },
  {
    title: 'Peanut Noodles',
    description: 'Quick noodles with peanut sauce and vegetables. Asian-inspired fast meal.',
    cookingTime: '15 minutes',
    cuisine: 'Asian',
    restrictions: ['Vegetarian', 'Vegan', 'Dairy-free', 'None'],
  },
];

module.exports = {
  generateFreeMealPlan,
};
