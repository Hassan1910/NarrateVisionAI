# GitHub Deployment Guide for NarrateVision

This guide will help you deploy NarrateVision to GitHub and Vercel.

## Prerequisites

- Git installed on your system
- GitHub account
- Vercel account (optional, for deployment)

## Automated Deployment

We've provided scripts to automate the GitHub and Vercel deployment process:

### Windows Users

1. Run `deploy-to-vercel.bat` by double-clicking it or running it from the command prompt
2. Follow the on-screen instructions
3. The script will:
   - Initialize a Git repository if needed
   - Help you set up a GitHub remote
   - Push your code to GitHub
   - Optionally deploy to Vercel

### macOS/Linux Users

1. Make the script executable: `chmod +x deploy-to-vercel.sh`
2. Run the script: `./deploy-to-vercel.sh`
3. Follow the on-screen instructions
4. The script will perform the same steps as the Windows version

## Manual Deployment

If you prefer to deploy manually, follow these steps:

### GitHub Deployment

1. Initialize a Git repository (if not already done):
   ```
   git init
   ```

2. Add all files to the repository:
   ```
   git add .
   ```

3. Commit the changes:
   ```
   git commit -m "Initial commit"
   ```

4. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name your repository (e.g., "narratevision")
   - Do NOT initialize with README, .gitignore, or license

5. Add the GitHub remote:
   ```
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   ```

6. Push to GitHub:
   ```
   git push -u origin master
   ```

### Vercel Deployment

1. Install Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Deploy to Vercel:
   ```
   vercel --prod
   ```

3. Follow the on-screen instructions to complete the deployment

## Environment Variables

Make sure to set the following environment variables in your Vercel project settings:

- `OPENAI_API_KEY`: Your OpenAI API key
- `API_PROVIDER`: Set to 'openai' or 'zero2launch'
- `VIDEO_OUTPUT_DIR`: Set to 'public/videos'
- `SHOW_FFMPEG_WARNING`: Set to 'true'
- `MAX_SLIDESHOW_IMAGES`: Set to '4' or your preferred number
- `TRANSITION_DURATION`: Set to '1' or your preferred duration
- `DEFAULT_IMAGE_STYLE`: Set to 'natural' or 'vivid'
- `DEFAULT_IMAGE_SIZE`: Set to '1024x1024'
- `DEFAULT_VOICE`: Set to 'alloy' or your preferred voice
- `AUDIO_QUALITY`: Set to 'high', 'medium', or 'low'
