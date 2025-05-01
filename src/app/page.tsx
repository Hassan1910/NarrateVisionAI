'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { ToastContainer } from 'react-toastify';

// Dynamically import components to avoid hydration issues
const ImageToVideoForm = dynamic(() => import('@/components/ImageToVideoForm'), {
  ssr: false,
  loading: () => <div className="animate-pulse h-96 bg-gray-100 rounded-lg"></div>
});

const FFmpegWarning = dynamic(() => import('@/components/FFmpegWarning'), {
  ssr: false
});

export default function Home() {
  const [showFFmpegWarning, setShowFFmpegWarning] = useState(false);

  // Check if FFmpeg is missing on component mount
  useEffect(() => {
    const checkForFFmpegWarning = async () => {
      try {
        // Check if .ffmpeg_missing file exists in the output directory
        const response = await fetch('/api/check-ffmpeg');
        const data = await response.json();
        setShowFFmpegWarning(data.showWarning);
      } catch (error) {
        console.error('Error checking FFmpeg status:', error);
      }
    };

    checkForFFmpegWarning();
  }, []);

  // Always use dark mode
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Apply dark mode class
      document.documentElement.classList.add('dark');

      // Save preference to localStorage
      localStorage.setItem('darkMode', 'true');
    }
  }, []);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] dark custom-scrollbar">
      {/* Modern Header with glassmorphism effect */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Top bar with logo and dark mode toggle */}
          <div className="flex justify-between items-center py-4 px-4 md:px-6">
            {/* Logo and brand */}
            <div className="flex items-center space-x-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg animate-pulse-soft">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 to-transparent"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                  NarrateVision
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Transform Words into Visual Stories</p>
              </div>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Create button (visible on all screens) */}
              <a
                href="#create"
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-700 hover:to-violet-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Now
              </a>

              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all duration-200"
                aria-label="Open menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation bar */}
          <nav className="hidden md:flex">
            <div className="flex space-x-2 px-4 py-3">
              <a href="#" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-500 shadow-sm">
                Home
              </a>
              <a href="/text-to-image" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                Text to Image
              </a>
              <a href="/documentation" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                Documentation
              </a>
              <a href="/ffmpeg-guide" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                FFmpeg Guide
              </a>
              <a href="/api-reference" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                API Reference
              </a>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12 mt-6">
        {/* Hero section with modern design */}
        <div className="mb-12 text-center relative">
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent)] -z-10"></div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Create Stunning Videos from <span className="bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent animate-gradient-shift">Your Words</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            Transform your text into engaging videos with AI-generated visuals and natural narration
          </p>

          {/* CTA Button */}
          <a
            href="#create"
            className="inline-flex items-center px-6 py-3 text-base font-medium rounded-xl bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-700 hover:to-violet-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-1 transform duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Get Started Now
          </a>
        </div>

        {/* Show FFmpeg warning if needed */}
        {showFFmpegWarning && (
          <div className="mb-10">
            <FFmpegWarning />
          </div>
        )}

        {/* Main form card with ID for direct navigation */}
        <div id="create" className="card p-8 mb-12 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 dark:opacity-30 -z-10"></div>
          <ImageToVideoForm />
        </div>

        {/* Features section with modern cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 transform">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 dark:from-indigo-500/30 dark:to-indigo-500/10 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">AI-Generated Visuals</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Automatically creates stunning images that match your narrative text with advanced AI technology</p>
          </div>

          <div className="glass p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 transform">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500/20 to-violet-500/10 dark:from-violet-500/30 dark:to-violet-500/10 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-violet-600 dark:text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-violet-600 to-violet-500 dark:from-violet-400 dark:to-violet-300 bg-clip-text text-transparent">Natural Narration</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Convert your text to lifelike speech with multiple voice options and natural-sounding inflections</p>
          </div>

          <div className="glass p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 transform">
            <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/10 dark:from-fuchsia-500/30 dark:to-fuchsia-500/10 rounded-xl flex items-center justify-center mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-fuchsia-600 dark:text-fuchsia-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-fuchsia-300 bg-clip-text text-transparent">Customizable Effects</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">Choose from multiple animation styles and visual effects to create the perfect video for your needs</p>
          </div>
        </div>

        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>

      {/* Modern footer with gradient accent and glassmorphism */}
      <footer className="relative mt-20">
        {/* Gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 animate-gradient-shift bg-[length:200%_200%]"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-600/5 blur-3xl"></div>
        </div>

        {/* Main footer content */}
        <div className="glass pt-16 pb-10 px-4 transition-all relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Top section with logo and links */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-16">
              {/* Logo and description */}
              <div className="md:col-span-4">
                <div className="flex items-center space-x-3 mb-5">
                  <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
                    NarrateVision
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  Transform your text into engaging videos with AI-generated visuals and natural narration. Create stunning content in minutes.
                </p>
                <div className="flex space-x-5">
                  <a href="https://github.com/Hassan1910/NarrateVisionAI" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:-translate-y-1">
                    <span className="sr-only">GitHub</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:-translate-y-1">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 transform hover:-translate-y-1">
                    <span className="sr-only">YouTube</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>

              {/* Links sections with modern styling */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-5">Product</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Features</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Examples</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Testimonials</a></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-5">Resources</h3>
                <ul className="space-y-4">
                  <li><a href="/text-to-image" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Text to Image</a></li>
                  <li><a href="/ffmpeg-guide" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">FFmpeg Guide</a></li>
                  <li><a href="/documentation" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Documentation</a></li>
                  <li><a href="/api-reference" className="text-gray-600 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">API Reference</a></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-fuchsia-600 dark:text-fuchsia-400 uppercase tracking-wider mb-5">Company</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">About</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Blog</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Careers</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-fuchsia-600 dark:hover:text-fuchsia-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Contact</a></li>
                </ul>
              </div>

              <div className="md:col-span-2">
                <h3 className="text-sm font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider mb-5">Legal</h3>
                <ul className="space-y-4">
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Privacy</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Terms</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Cookie Policy</a></li>
                  <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 text-sm hover:translate-x-1 inline-block">Licenses</a></li>
                </ul>
              </div>
            </div>

            {/* Bottom section with copyright and modern divider */}
            <div className="pt-8 border-t border-gray-200/30 dark:border-gray-800/30">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  © {new Date().getFullYear()} NarrateVision. All rights reserved.
                </p>
                <div className="flex items-center mt-4 md:mt-0">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Built with Next.js, Tailwind CSS, and FFmpeg
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
