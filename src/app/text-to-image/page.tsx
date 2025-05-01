'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import TextToImageForm from '@/components/TextToImageForm';

export default function TextToImagePage() {
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] dark custom-scrollbar">
      {/* Modern Header with glassmorphism effect */}
      <header className="sticky top-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Top bar with logo and dark mode toggle */}
          <div className="flex justify-between items-center py-3 sm:py-4 px-3 sm:px-4 md:px-6">
            {/* Logo and brand */}
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-2">
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
              </Link>
            </div>

            {/* Right side controls */}
            <div className="flex items-center space-x-4">
              {/* Create button (visible on all screens) */}
              <Link
                href="/#create"
                className="hidden sm:flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-violet-500 text-white hover:from-indigo-700 hover:to-violet-600 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 transform duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Video
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-all duration-200"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Desktop Navigation bar */}
          <nav className="hidden md:flex">
            <div className="flex space-x-2 px-4 py-3">
              <Link href="/" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                Home
              </Link>
              <Link href="/text-to-image" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-violet-500 shadow-sm">
                Text to Image
              </Link>
              <Link href="/documentation" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                Documentation
              </Link>
              <Link href="/ffmpeg-guide" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                FFmpeg Guide
              </Link>
              <Link href="/api-reference" className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200">
                API Reference
              </Link>
            </div>
          </nav>

          {/* Mobile menu - improved animation and styling */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              mobileMenuOpen
                ? 'max-h-64 opacity-100 translate-y-0'
                : 'max-h-0 opacity-0 -translate-y-2'
            }`}
          >
            <nav className="px-4 py-2 pb-4 space-y-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-b-lg shadow-lg">
              <Link
                href="/"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:bg-gray-200 dark:active:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/text-to-image"
                className="block px-4 py-3 rounded-lg text-base font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 active:bg-indigo-100 dark:active:bg-indigo-900/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                Text to Image
              </Link>
              <Link
                href="/documentation"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:bg-gray-200 dark:active:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
              <Link
                href="/ffmpeg-guide"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:bg-gray-200 dark:active:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                FFmpeg Guide
              </Link>
              <Link
                href="/api-reference"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 active:bg-gray-200 dark:active:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                API Reference
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-8 sm:py-12 mt-4 sm:mt-6">
        {/* Hero section with modern design */}
        <div className="mb-8 sm:mb-12 text-center relative">
          {/* Background decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-r from-indigo-500/5 to-violet-500/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.05),transparent)] -z-10"></div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            Text to <span className="bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent animate-gradient-shift">Image</span> Generator
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            Create stunning AI-generated images from your text descriptions
          </p>
        </div>

        {/* Main form card with modern design */}
        <div className="card p-4 sm:p-6 md:p-8 mb-8 sm:mb-12 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzMzMiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptNiA2djZoNnYtNmgtNnptLTEyIDBoNnY2aC02di02em0xMiAwaDZ2NmgtNnYtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-50 dark:opacity-30 -z-10"></div>
          <TextToImageForm />
        </div>

        {/* Features section with modern cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-16">
          <div className="glass p-5 sm:p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 transform">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500/20 to-indigo-500/10 dark:from-indigo-500/30 dark:to-indigo-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-400 dark:to-indigo-300 bg-clip-text text-transparent">Creative Prompts</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Describe any scene, concept, or style and watch it come to life with AI-powered image generation</p>
          </div>

          <div className="glass p-5 sm:p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 transform">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-violet-500/20 to-violet-500/10 dark:from-violet-500/30 dark:to-violet-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-violet-600 dark:text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-violet-600 to-violet-500 dark:from-violet-400 dark:to-violet-300 bg-clip-text text-transparent">Multiple Styles</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Choose from natural, vivid, or artistic styles to perfectly match your creative vision</p>
          </div>

          <div className="glass p-5 sm:p-6 md:p-8 rounded-2xl shadow-soft hover:shadow-soft-lg transition-all duration-300 hover:-translate-y-1 transform sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/10 dark:from-fuchsia-500/30 dark:to-fuchsia-500/10 rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-fuchsia-600 dark:text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 dark:from-fuchsia-400 dark:to-fuchsia-300 bg-clip-text text-transparent">Instant Download</h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">Download your generated images instantly for use in any project or to create stunning videos</p>
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
      <footer className="relative mt-12 sm:mt-16 md:mt-20">
        {/* Gradient accent */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-600 via-violet-500 to-fuchsia-500 animate-gradient-shift bg-[length:200%_200%]"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-600/5 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-violet-600/5 blur-3xl"></div>
        </div>

        {/* Main footer content */}
        <div className="glass pt-10 sm:pt-12 md:pt-16 pb-8 sm:pb-10 px-3 sm:px-4 transition-all relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Footer navigation */}
            <nav className="flex flex-wrap justify-center gap-1.5 sm:gap-2 md:gap-8 mb-8 sm:mb-10">
              <Link
                href="/"
                className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/50 active:bg-gray-200 dark:active:bg-gray-700"
              >
                Home
              </Link>
              <Link
                href="/text-to-image"
                className="px-3 sm:px-4 py-2 text-indigo-600 dark:text-indigo-400 transition-all duration-200 text-xs sm:text-sm md:text-base rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 active:bg-indigo-100 dark:active:bg-indigo-900/40"
              >
                Text to Image
              </Link>
              <Link
                href="/documentation"
                className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/50 active:bg-gray-200 dark:active:bg-gray-700"
              >
                Documentation
              </Link>
              <Link
                href="/ffmpeg-guide"
                className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/50 active:bg-gray-200 dark:active:bg-gray-700"
              >
                FFmpeg Guide
              </Link>
              <Link
                href="/api-reference"
                className="px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-xs sm:text-sm md:text-base rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/50 active:bg-gray-200 dark:active:bg-gray-700"
              >
                API Reference
              </Link>
            </nav>

            {/* Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center pt-6 sm:pt-8 border-t border-gray-200/30 dark:border-gray-800/30">
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} NarrateVision. All rights reserved.
              </p>
              <div className="flex items-center mt-3 md:mt-0">
                <span className="inline-flex h-5 sm:h-6 w-5 sm:w-6 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 mr-2 sm:mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-indigo-500 dark:text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </span>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Built with Next.js, Tailwind CSS, and AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
