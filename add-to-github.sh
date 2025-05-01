#!/bin/bash

echo "NarrateVision GitHub Setup Tool"
echo "=============================="
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
    echo "Pushing to GitHub..."
    git push -u origin master
else
    echo "GitHub remote already configured."
    
    echo
    echo "Committing changes..."
    git add .
    git commit -m "Update NarrateVision for Vercel deployment"
    
    echo "Pushing to GitHub..."
    git push
fi

echo
echo "GitHub setup completed!"
echo
echo "Your code has been pushed to GitHub."
echo
echo "Next steps:"
echo "1. Go to https://vercel.com/new to create a new Vercel project"
echo "2. Import your GitHub repository"
echo "3. Configure environment variables in Vercel"
echo "4. Deploy your project"
echo
echo "For more details, see GITHUB_DEPLOYMENT.md and GITHUB_ACTIONS.md"
echo
