# 📦 Deployment Guide - Geeta's AI Meal Planner

This guide provides step-by-step instructions for deploying the application to various platforms.

## Table of Contents
- [Replit Deployment](#replit-deployment)
- [Heroku Deployment](#heroku-deployment)
- [Vercel Deployment](#vercel-deployment)
- [General Deployment Tips](#general-deployment-tips)

---

## 🔄 Replit Deployment

Replit is the recommended platform for this project as it's designed to work seamlessly with the development workflow.

### Step 1: Create Replit Account
1. Go to [replit.com](https://replit.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Import from GitHub
1. Click "Create Repl" button
2. Select "Import from GitHub"
3. Paste repository URL: `https://github.com/geetapajjuri/MealPlanner.git`
4. Choose language: **Node.js**
5. Click "Import from GitHub"

### Step 3: Configure Environment Variables
1. Click the 🔒 **Secrets** icon (lock) in the left sidebar
2. Add the following secrets:

| Key | Value | Required |
|-----|-------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `SLACK_WEBHOOK_URL` | Your Slack webhook URL | No |
| `PORT` | 3000 | No |
| `NODE_ENV` | production | No |

**Important:** These secrets are NOT committed to GitHub and are only stored in Replit.

### Step 4: Install Dependencies
Replit should automatically detect \`package.json\` and run \`npm install\`. If not:

1. Open the Shell tab
2. Run: \`npm install\`
3. Wait for installation to complete

### Step 5: Configure Run Command
1. Click the "⚙️" button or open \`.replit\` file
2. Ensure run command is: \`npm start\`
3. Save changes

### Step 6: Run the Application
1. Click the **Run** button (big green button at top)
2. Wait for server to start
3. You should see: "Server running on http://localhost:3000"
4. A webview panel will open with your application

### Step 7: Test the Application
1. Fill out the meal planning form
2. Click "Generate My Meal Plan"
3. Verify meal plan generates successfully
4. Test "Send to Slack" button
5. Verify meal plan appears in Slack

### Step 8: Access Your Application
- **Replit URL**: Your app will be available at \`https://your-repl-name.username.repl.co\`
- Share this URL with others to use your meal planner!

### Updating from GitHub
When you push changes to GitHub:

1. Open Replit Shell
2. Run: \`git pull origin main\`
3. Run: \`npm install\` (if dependencies changed)
4. Click **Run** to restart the server

### Replit-Specific Tips
- **Always On**: Upgrade to Replit Hacker plan to keep your app running 24/7
- **Custom Domain**: You can connect a custom domain in Replit settings
- **Resource Usage**: Monitor CPU/memory usage in the Stats panel
- **Logs**: Check the Console tab for server logs and errors

---

## 🚀 Heroku Deployment

### Prerequisites
- Heroku account ([signup.heroku.com](https://signup.heroku.com))
- Heroku CLI installed ([devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli))

### Step 1: Prepare Application
1. Ensure \`package.json\` has start script:
   \`\`\`json
   "scripts": {
     "start": "node server.js"
   }
   \`\`\`

2. Create \`Procfile\` in root directory:
   \`\`\`
   web: node server.js
   \`\`\`

### Step 2: Create Heroku App
\`\`\`bash
# Login to Heroku
heroku login

# Create new app
heroku create your-meal-planner-app

# Or use existing app
heroku git:remote -a your-existing-app
\`\`\`

### Step 3: Set Environment Variables
\`\`\`bash
heroku config:set OPENAI_API_KEY=your_openai_api_key
heroku config:set SLACK_WEBHOOK_URL=your_slack_webhook_url
heroku config:set NODE_ENV=production
\`\`\`

### Step 4: Deploy
\`\`\`bash
# Add changes
git add .
git commit -m "Prepare for Heroku deployment"

# Push to Heroku
git push heroku main

# If on different branch:
git push heroku your-branch:main
\`\`\`

### Step 5: Open Application
\`\`\`bash
heroku open
\`\`\`

### Heroku Tips
- **Logs**: \`heroku logs --tail\`
- **Restart**: \`heroku restart\`
- **Scale**: \`heroku ps:scale web=1\`
- **Add-ons**: Consider adding logging or monitoring add-ons

---

## ⚡ Vercel Deployment

**Note:** Vercel is optimized for serverless functions. This app uses a traditional Node.js server, so some modifications may be needed.

### Step 1: Install Vercel CLI
\`\`\`bash
npm install -g vercel
\`\`\`

### Step 2: Login to Vercel
\`\`\`bash
vercel login
\`\`\`

### Step 3: Configure for Vercel
1. Create \`vercel.json\` in root:
   \`\`\`json
   {
     "version": 2,
     "builds": [
       {
         "src": "server.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "/server.js"
       }
     ]
   }
   \`\`\`

### Step 4: Deploy
\`\`\`bash
vercel
\`\`\`

Follow the prompts to:
- Set up and deploy project
- Link to existing project or create new
- Configure environment variables

### Step 5: Set Environment Variables
Using Vercel dashboard:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add:
   - \`OPENAI_API_KEY\`
   - \`SLACK_WEBHOOK_URL\`
   - \`NODE_ENV\` (set to "production")

### Step 6: Redeploy
\`\`\`bash
vercel --prod
\`\`\`

---

## 🌐 General Deployment Tips

### Environment Variables
**Never commit sensitive data to GitHub!**
- Always use environment variables for API keys
- Use platform-specific secret management
- Double-check \`.gitignore\` includes \`.env\`

### Security Checklist
- ✅ Helmet.js enabled for security headers
- ✅ Rate limiting configured
- ✅ CORS properly set up
- ✅ Input validation on all endpoints
- ✅ No sensitive data in logs
- ✅ HTTPS enabled (automatic on most platforms)

### Performance Optimization
- Enable compression middleware
- Use CDN for static assets
- Implement caching where appropriate
- Monitor API usage and costs

### Monitoring & Logging
- Set up error tracking (e.g., Sentry)
- Monitor uptime (e.g., UptimeRobot)
- Track API usage and costs
- Set up alerts for errors

### Cost Management
**OpenAI API Costs:**
- GPT-4 costs per token
- Monitor usage in OpenAI dashboard
- Set spending limits
- Consider caching frequently requested meal plans

**Estimated Costs (as of 2025):**
- GPT-4: ~$0.03 per meal plan generation
- 100 meal plans/month ≈ $3/month
- Plus hosting costs (varies by platform)

### Testing Before Deployment
\`\`\`bash
# Set NODE_ENV to production locally
NODE_ENV=production npm start

# Test all features:
# - Form submission
# - Meal plan generation
# - Slack integration
# - Error handling
\`\`\`

### Deployment Checklist
- [ ] All environment variables configured
- [ ] Dependencies installed (\`npm install\`)
- [ ] Application builds successfully
- [ ] Health check endpoint accessible
- [ ] Meal plan generation works
- [ ] Slack integration works (if configured)
- [ ] Error pages display correctly
- [ ] Mobile responsive design verified
- [ ] HTTPS enabled
- [ ] API keys secured
- [ ] Logs configured
- [ ] Monitoring set up

---

## 🐛 Common Deployment Issues

### Issue: "Application Error" or 500 Error
**Solution:**
- Check platform logs for errors
- Verify all environment variables are set
- Ensure \`NODE_ENV=production\`
- Check OpenAI API key is valid

### Issue: Static Files Not Loading
**Solution:**
- Verify \`public\` folder is included in deployment
- Check Express static middleware configuration
- Ensure correct file paths in HTML

### Issue: API Key Not Working
**Solution:**
- Regenerate API key in OpenAI dashboard
- Remove any quotes or spaces from \`.env\`
- Verify key has proper permissions
- Check if you have API credits

### Issue: Slack Integration Fails
**Solution:**
- Verify webhook URL is correct
- Test webhook with curl
- Check Slack app permissions
- Ensure webhook is active

---

## 📊 Post-Deployment

### Monitor Your Application
1. **Health Check**: \`https://your-app.com/health\`
2. **Error Logs**: Check platform-specific logs
3. **API Usage**: Monitor OpenAI dashboard
4. **Performance**: Use platform metrics

### Maintenance Tasks
- **Weekly**: Check error logs
- **Monthly**: Review API costs
- **Quarterly**: Update dependencies
- **As Needed**: Rotate API keys

---

## 🆘 Getting Help

If you encounter deployment issues:
1. Check platform-specific documentation
2. Review error logs carefully
3. Verify all environment variables
4. Test locally first
5. Create an issue on GitHub

---

**Happy Deploying! 🚀**
