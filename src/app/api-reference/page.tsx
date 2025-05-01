'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ApiReferencePage() {
  // Always use dark mode
  useEffect(() => {
    // Apply dark mode class
    document.documentElement.classList.add('dark');

    // Save preference to localStorage
    localStorage.setItem('darkMode', 'true');
  }, []);

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] dark">
      {/* Header */}
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
              {/* Create button */}



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
              <Link href="/ffmpeg-guide" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                FFmpeg Guide
              </Link>
              <Link href="/api-reference" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                API Reference
              </Link>
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            NarrateVision API Reference
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Complete reference for the NarrateVision API endpoints.
          </p>

          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Free API Access:</strong> For free API access and additional documentation, visit the <a href="https://zero2launch.gitbook.io/docs" target="_blank" rel="noopener noreferrer" className="underline font-medium">Zero2Launch Documentation</a> page.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">API Endpoints</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <a href="#generate-image" className="text-blue-600 dark:text-blue-400 hover:underline">Generate Image</a>
            </li>
            <li>
              <a href="#generate-multiple-images" className="text-blue-600 dark:text-blue-400 hover:underline">Generate Multiple Images</a>
            </li>
            <li>
              <a href="#generate-audio" className="text-blue-600 dark:text-blue-400 hover:underline">Generate Audio</a>
            </li>
            <li>
              <a href="#generate-video" className="text-blue-600 dark:text-blue-400 hover:underline">Generate Video</a>
            </li>
            <li>
              <a href="#check-ffmpeg" className="text-blue-600 dark:text-blue-400 hover:underline">Check FFmpeg</a>
            </li>
          </ul>
        </div>

        {/* Generate Image API */}
        <div id="generate-image" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Generate Image</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Endpoint</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              POST /api/generate-image
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generates an image based on a text prompt using AI.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Request Body</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "prompt": "A beautiful sunset over mountains",
  "style": "natural"  // Optional: "natural", "vivid", or "artistic"
}`}
              </pre>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Response</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "success": true,
  "imagePath": "/path/to/image.jpg",
  "imageUrl": "/media/images/image.jpg",
  "publicPath": "/public/media/images/image.jpg"
}`}
              </pre>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Error Response</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "error": "Text prompt is required"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Generate Multiple Images API */}
        <div id="generate-multiple-images" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Generate Multiple Images</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Endpoint</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              POST /api/generate-multiple-images
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Generates multiple images based on an array of text prompts.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Request Body</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "prompts": [
    "A beautiful sunset over mountains",
    "A serene lake surrounded by trees",
    "A bustling city street at night"
  ],
  "style": "natural"  // Optional: "natural", "vivid", or "artistic"
}`}
              </pre>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Response</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "success": true,
  "images": [
    {
      "imagePath": "/path/to/image1.jpg",
      "imageUrl": "/media/images/image1.jpg"
    },
    {
      "imagePath": "/path/to/image2.jpg",
      "imageUrl": "/media/images/image2.jpg"
    },
    {
      "imagePath": "/path/to/image3.jpg",
      "imageUrl": "/media/images/image3.jpg"
    }
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Generate Audio API */}
        <div id="generate-audio" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Generate Audio</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Endpoint</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              POST /api/generate-audio
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Converts text to speech using AI voice synthesis.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Request Body</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "text": "This is the narration text that will be converted to speech.",
  "voice": "alloy"  // Optional: "alloy", "echo", "fable", "onyx", "nova", "shimmer"
}`}
              </pre>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Response</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "success": true,
  "audioPath": "/path/to/audio.mp3",
  "audioUrl": "/media/audio/audio.mp3",
  "duration": 12.5  // Duration in seconds
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Generate Video API */}
        <div id="generate-video" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Generate Video</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Endpoint</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              POST /api/generate-video
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Combines images and audio into a video. Supports both single image and image sequence videos.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Request Body (Single Image)</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "imagePath": "/path/to/image.jpg",
  "audioPath": "/path/to/audio.mp3",
  "effect": "zoom"  // Optional: "zoom", "pan", "kenBurns"
}`}
              </pre>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Request Body (Image Sequence)</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "imagePaths": [
    "/path/to/image1.jpg",
    "/path/to/image2.jpg",
    "/path/to/image3.jpg"
  ],
  "audioPath": "/path/to/audio.mp3",
  "effect": "sequence",
  "transitionDuration": 1  // Optional: transition duration in seconds
}`}
              </pre>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Response</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "success": true,
  "videoPath": "/path/to/video.mp4",
  "videoUrl": "/media/videos/video.mp4"
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Check FFmpeg API */}
        <div id="check-ffmpeg" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Check FFmpeg</h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Endpoint</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md font-mono text-sm">
              GET /api/check-ffmpeg
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Checks if FFmpeg is installed on the system.
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Response</h3>
            <div className="bg-gray-100 dark:bg-gray-900 p-3 rounded-md">
              <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`{
  "showWarning": false,
  "ffmpegInstalled": true
}`}
              </pre>
            </div>
          </div>
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
                <strong>Note:</strong> All API endpoints require proper authentication and authorization. Make sure to include your API key in the request headers.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
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
