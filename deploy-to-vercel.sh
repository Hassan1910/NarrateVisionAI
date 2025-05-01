#!/bin/bash

echo "NarrateVision GitHub and Vercel Deployment Tool"
echo "============================================="
echo

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Check if repository is already initialized
if [ ! -d .git ]; then
    echo "Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit"
else
    echo "Git repository already initialized."
fi

# Check if remote origin exists
if ! git remote -v | grep origin &> /dev/null; then
    echo
    echo "No GitHub remote found. Let's set up GitHub..."
    echo
    read -p "Enter your GitHub username: " GITHUB_USERNAME
    read -p "Enter repository name [narratevision]: " REPO_NAME

    if [ -z "$REPO_NAME" ]; then
        REPO_NAME="narratevision"
    fi

    echo
    echo "Setting up GitHub repository..."
    echo
    echo "1. Go to https://github.com/new"
    echo "2. Create a new repository named '$REPO_NAME'"
    echo "3. Do NOT initialize with README, .gitignore, or license"
    echo "4. Come back here when done"
    echo
    read -p "Press Enter to continue..."

    echo "Adding GitHub remote..."
    git remote add origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

    echo
    read -p "Would you like to push to GitHub now? (y/n): " PUSH_NOW
    if [[ $PUSH_NOW =~ ^[Yy]$ ]]; then
        echo "Pushing to GitHub..."
        git push -u origin master
    fi
else
    echo "GitHub remote already configured."

    echo
    read -p "Would you like to commit and push changes to GitHub? (y/n): " COMMIT_PUSH
    if [[ $COMMIT_PUSH =~ ^[Yy]$ ]]; then
        read -p "Enter commit message [Update NarrateVision]: " COMMIT_MSG
        if [ -z "$COMMIT_MSG" ]; then
            COMMIT_MSG="Update NarrateVision"
        fi

        echo "Committing changes..."
        git add .
        git commit -m "$COMMIT_MSG"

        echo "Pushing to GitHub..."
        git push
    fi
fi

echo
echo "GitHub setup completed!"
echo

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

echo
read -p "Would you like to deploy to Vercel now? (y/n): " DEPLOY_NOW
if [[ $DEPLOY_NOW =~ ^[Yy]$ ]]; then
    echo "Running Vercel deployment..."
    vercel --prod
    echo "Deployment process completed!"
else
    echo "Skipping Vercel deployment."
fi

echo
echo "All tasks completed!"
