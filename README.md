# 🍽️ Geeta's AI Meal Planner

AI-powered weekly meal planning application that generates personalized meal plans in minutes using OpenAI GPT-4 and integrates with Slack for easy sharing.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## ✨ Features

- **AI-Powered Meal Planning**: Generate 7 unique dinner suggestions for the week using OpenAI GPT-4
- **Personalized Recommendations**: Customizable based on:
  - Family size (1-8 people)
  - Dietary restrictions (Vegetarian, Vegan, Gluten-free, Keto, etc.)
  - Cooking time preferences (15 min to 1+ hour)
  - Cuisine preferences (Italian, Mexican, Asian, American, Mediterranean, Indian)
  - Disliked ingredients
  - Additional notes
- **Slack Integration**: Share meal plans directly to your Slack channel with one click
- **Modern UI**: Clean, responsive design that works on all devices
- **Security**: Built with security best practices including Helmet.js, rate limiting, and input validation
- **Fast & Reliable**: Includes retry logic, error handling, and loading states

## 🛠️ Tech Stack

### Backend
- **Node.js** (v18+)
- **Express.js** (v5.1.0) - Web framework
- **OpenAI API** (GPT-4) - AI meal plan generation
- **Helmet.js** - Security headers
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation
- **Axios** - HTTP client for Slack integration

### Frontend
- **Vanilla JavaScript** - No frameworks, pure JS
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables
- **Responsive Design** - Mobile-first approach

## 📋 Prerequisites

- **Node.js** v18.0.0 or higher
- **npm** v8.0.0 or higher
- **OpenAI API Key** - Get yours at [platform.openai.com](https://platform.openai.com/api-keys)
- **Slack Webhook URL** (optional) - Configure at [api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)

## 🚀 Getting Started

### 1. Clone the Repository

\`\`\`bash
git clone https://github.com/geetapajjuri/MealPlanner.git
cd MealPlanner
\`\`\`

### 2. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Configure Environment Variables

Create a \`.env\` file in the root directory:

\`\`\`bash
cp .env.example .env
\`\`\`

Edit \`.env\` and add your API keys:

\`\`\`env
# Server Configuration
PORT=3000
NODE_ENV=development

# OpenAI API Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Slack Webhook Configuration (Optional)
SLACK_WEBHOOK_URL=your_slack_webhook_url_here
\`\`\`

### 4. Run the Application

**Development mode** (with auto-reload):
\`\`\`bash
npm run dev
\`\`\`

**Production mode**:
\`\`\`bash
npm start
\`\`\`

### 5. Access the Application

Open your browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

## 📁 Project Structure

\`\`\`
MealPlanner/
├── public/                  # Frontend files
│   ├── index.html          # Main HTML file
│   ├── styles.css          # CSS styling
│   └── app.js              # Client-side JavaScript
├── services/               # Business logic
│   ├── openai.service.js   # OpenAI integration
│   └── slack.service.js    # Slack integration
├── controllers/            # Request handlers
│   ├── mealPlan.controller.js
│   └── slack.controller.js
├── routes/                 # API routes
│   └── mealPlan.routes.js
├── middleware/             # Custom middleware
│   ├── sanitize.middleware.js
│   └── validate.middleware.js
├── server.js              # Express server
├── package.json           # Dependencies
├── .env.example           # Environment template
├── .gitignore            # Git ignore rules
└── README.md             # This file
\`\`\`

## 🔌 API Endpoints

### Health Check
\`\`\`http
GET /health
\`\`\`
Returns server status and uptime.

### Generate Meal Plan
\`\`\`http
POST /api/generate-meal-plan
Content-Type: application/json

{
  "familySize": 4,
  "dietaryRestrictions": ["Vegetarian"],
  "cookingTime": "30 minutes",
  "cuisinePreferences": ["Italian", "Mexican"],
  "dislikedIngredients": "mushrooms",
  "additionalNotes": "Kid-friendly meals"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "meals": [
      {
        "day": "Monday",
        "title": "Pasta Primavera",
        "description": "Fresh vegetables tossed with pasta...",
        "cookingTime": "25 minutes",
        "cuisine": "Italian"
      }
      // ... 6 more meals
    ]
  },
  "message": "Meal plan generated successfully"
}
\`\`\`

### Send to Slack
\`\`\`http
POST /api/send-to-slack
Content-Type: application/json

{
  "meals": [ /* meal plan data */ ]
}
\`\`\`

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| \`PORT\` | No | Server port (default: 3000) |
| \`NODE_ENV\` | No | Environment: development/production |
| \`OPENAI_API_KEY\` | Yes | Your OpenAI API key |
| \`SLACK_WEBHOOK_URL\` | No | Slack incoming webhook URL |

### Getting API Keys

**OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy and paste into \`.env\`

**Slack Webhook URL:**
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Create a new app or select existing
3. Enable "Incoming Webhooks"
4. Add webhook to your workspace
5. Copy webhook URL to \`.env\`

## 🎨 Usage Guide

1. **Fill Out the Form**:
   - Select your family size
   - Choose dietary restrictions
   - Pick preferred cooking time
   - Select cuisine preferences
   - Optionally add disliked ingredients and notes

2. **Generate Meal Plan**:
   - Click "Generate My Meal Plan"
   - Wait 5-30 seconds for AI to generate plan
   - View your personalized 7-day meal plan

3. **Share to Slack** (Optional):
   - Click "Send to Slack"
   - Meal plan will be posted to your configured Slack channel

4. **Generate New Plan**:
   - Click "Generate New Plan" to start over

## 🐛 Troubleshooting

### Common Issues

**Server won't start:**
- Check if port 3000 is already in use
- Verify all dependencies are installed: \`npm install\`
- Check Node.js version: \`node --version\` (should be 18+)

**"Invalid API key" error:**
- Verify \`OPENAI_API_KEY\` is set in \`.env\`
- Ensure key is valid and has credits
- Check for extra spaces or quotes in \`.env\`

**Meal plan generation fails:**
- Check your OpenAI API quota/credits
- Verify network connection
- Check server logs for detailed errors

**Slack integration not working:**
- Verify \`SLACK_WEBHOOK_URL\` is correct
- Test webhook URL using curl
- Check if webhook is active in Slack settings

**Form validation errors:**
- Ensure all required fields are filled
- Select at least one dietary restriction
- Select at least one cuisine preference

## 🔒 Security Features

- **Helmet.js**: Secure HTTP headers
- **CORS**: Cross-origin request protection
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Sanitization**: XSS attack prevention
- **Input Validation**: Server-side validation with express-validator
- **Environment Variables**: Sensitive data never exposed client-side

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Replit
- Heroku
- Vercel
- AWS
- Other platforms

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👩‍💻 Author

**Geeta Pajjuri**
- GitHub: [@geetapajjuri](https://github.com/geetapajjuri)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Slack for webhook integration
- All contributors and users

## 📧 Support

If you encounter any issues or have questions:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Review existing [GitHub Issues](https://github.com/geetapajjuri/MealPlanner/issues)
3. Create a new issue with detailed information

---

**Built with ❤️ by Geeta** | Powered by OpenAI GPT-4
