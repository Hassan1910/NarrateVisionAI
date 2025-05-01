# GitHub Actions Deployment Guide

This guide explains how to set up GitHub Actions for automatic deployment of NarrateVision to Vercel.

## Prerequisites

- GitHub repository with NarrateVision code
- Vercel account with a project set up

## Setting Up GitHub Actions

A GitHub Actions workflow file has been included in this repository at `.github/workflows/deploy.yml`. This workflow will automatically deploy your application to Vercel whenever you push to the master branch.

To make it work, you need to set up the following secrets in your GitHub repository:

1. Go to your GitHub repository
2. Click on "Settings"
3. Click on "Secrets and variables" → "Actions"
4. Add the following secrets:

   - `VERCEL_TOKEN`: Your Vercel authentication token
   - `VERCEL_PROJECT_ID`: Your Vercel project ID
   - `VERCEL_ORG_ID`: Your Vercel organization ID

## Getting Vercel Tokens and IDs

### Vercel Token

1. Go to your Vercel account settings: https://vercel.com/account/tokens
2. Click "Create" to create a new token
3. Give it a name (e.g., "GitHub Actions")
4. Copy the token and add it as the `VERCEL_TOKEN` secret in GitHub

### Project ID and Organization ID

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel link` in your project directory
3. After linking, check the `.vercel/project.json` file
4. It will contain both the `projectId` and `orgId`
5. Add these values as `VERCEL_PROJECT_ID` and `VERCEL_ORG_ID` secrets in GitHub

## Testing the Workflow

After setting up the secrets, you can test the workflow by:

1. Making a change to your code
2. Committing and pushing to the master branch
3. Going to the "Actions" tab in your GitHub repository to see the workflow run

You can also manually trigger the workflow by:

1. Going to the "Actions" tab
2. Selecting the "Deploy to Vercel" workflow
3. Clicking "Run workflow"

## Environment Variables

Make sure your Vercel project has all the necessary environment variables set up:

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

You can set these in the Vercel dashboard under your project settings.
