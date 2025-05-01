'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function FFmpegGuidePage() {
  // Always use dark mode
  useEffect(() => {
    // Apply dark mode class
    document.documentElement.classList.add('dark');

    // Save preference to localStorage
    localStorage.setItem('darkMode', 'true');
  }, []);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] dark">
      {/* Modern Header with glassmorphism effect */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          {/* Top bar with logo and dark mode toggle */}
          <div className="flex justify-between items-center py-3 px-4 md:px-6">
            {/* Logo and brand */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
                <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  NarrateVision
                </span>
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">



            </div>
          </div>

          {/* Navigation bar */}
          <nav className="hidden md:flex border-t border-gray-100 dark:border-gray-800">
            <div className="flex space-x-1 px-4 py-2">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/documentation" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                Documentation
              </Link>
              <Link href="/ffmpeg-guide" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                FFmpeg Guide
              </Link>
              <Link href="/api-reference" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                API Reference
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Installing FFmpeg for NarrateVision
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            FFmpeg is required for NarrateVision to properly generate videos from images and audio. This guide will help you install FFmpeg on your system.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Windows Installation</h2>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Method 1: Using Chocolatey (Recommended)</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Install <a href="https://chocolatey.org/install" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Chocolatey</a> if you don't have it already</li>
              <li>Open PowerShell as Administrator</li>
              <li>Run the following command:
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md mt-1 font-mono text-sm">
                  choco install ffmpeg
                </div>
              </li>
              <li>Verify installation by opening a new PowerShell window and running:
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md mt-1 font-mono text-sm">
                  ffmpeg -version
                </div>
              </li>
            </ol>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Method 2: Manual Installation</h3>
            <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
              <li>Download the latest FFmpeg build from <a href="https://ffmpeg.org/download.html#build-windows" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">FFmpeg.org</a> or <a href="https://www.gyan.dev/ffmpeg/builds/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">gyan.dev</a></li>
              <li>Extract the ZIP file to a location on your computer (e.g., <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">C:\ffmpeg</code>)</li>
              <li>Add FFmpeg to your PATH:
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Right-click on "This PC" or "My Computer" and select "Properties"</li>
                  <li>Click on "Advanced system settings"</li>
                  <li>Click on "Environment Variables"</li>
                  <li>Under "System variables", find the "Path" variable, select it and click "Edit"</li>
                  <li>Click "New" and add the path to the FFmpeg <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">bin</code> folder (e.g., <code className="bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded text-sm">C:\ffmpeg\bin</code>)</li>
                  <li>Click "OK" on all dialogs to save the changes</li>
                </ul>
              </li>
              <li>Verify installation by opening a new Command Prompt or PowerShell window and running:
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md mt-1 font-mono text-sm">
                  ffmpeg -version
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Mac Installation</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            Install FFmpeg using Homebrew:
          </p>
          <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm mb-4">
            brew install ffmpeg
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Linux Installation</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Ubuntu/Debian:</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              sudo apt update<br />
              sudo apt install ffmpeg
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">CentOS/RHEL:</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              sudo yum install epel-release<br />
              sudo yum install ffmpeg ffmpeg-devel
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Verifying Installation</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            After installation, verify that FFmpeg is correctly installed by running:
          </p>
          <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm mb-4">
            ffmpeg -version
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            You should see version information for FFmpeg. If you see an error message, make sure FFmpeg is properly installed and added to your system PATH.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Troubleshooting</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-3">
            If you encounter issues with FFmpeg:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Make sure FFmpeg is in your system PATH</li>
            <li>Try restarting your computer after installation</li>
            <li>If using the application in development mode, restart the development server after installing FFmpeg</li>
            <li>Check if you have sufficient permissions to run FFmpeg</li>
            <li>Verify that the FFmpeg version is compatible with your operating system</li>
          </ol>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> NarrateVision has a fallback mechanism for video generation when FFmpeg is not available, but for optimal quality and performance, we strongly recommend installing FFmpeg.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Modern footer with gradient accent */}
      <footer className="relative mt-16">
        {/* Gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

        {/* Main footer content */}
        <div className="bg-white dark:bg-gray-900 pt-12 pb-8 px-4 transition-colors">
          <div className="max-w-6xl mx-auto">
            {/* Top section with logo and links */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
              {/* Logo and description */}
              <div className="md:col-span-4">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative h-8 w-8 overflow-hidden rounded-md bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                    NarrateVision
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Transform your text into engaging videos with AI-generated visuals and natural narration.
                </p>
              </div>

              {/* Links sections */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Product</h3>
                <ul className="space-y-3">
                  <li><Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Home</Link></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><Link href="/ffmpeg-guide" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">FFmpeg Guide</Link></li>
                  <li><Link href="/documentation" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Documentation</Link></li>
                  <li><Link href="/api-reference" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">API Reference</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom section with copyright */}
            <div className="pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} NarrateVision. All rights reserved.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 md:mt-0">
                  Built with Next.js, Tailwind CSS, and FFmpeg
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
