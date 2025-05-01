@echo off
echo Installing dependencies for NarrateVision...
npm install
npm install -D tailwindcss@4.0.0-alpha.2 @tailwindcss/postcss@4
echo Dependencies installed successfully!
echo You can now run the application with: npm run dev
pause
