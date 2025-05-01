'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function DocumentationPage() {
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



            </div>
          </div>

          {/* Navigation bar */}
          <nav className="hidden md:flex border-t border-gray-100 dark:border-gray-800">
            <div className="flex space-x-1 px-4 py-2">
              <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/text-to-image" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
                Text to Image
              </Link>
              <Link href="/documentation" className="px-3 py-2 rounded-md text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20">
                Documentation
              </Link>
              <Link href="/ffmpeg-guide" className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white transition-colors">
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
            NarrateVision Documentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            Learn how to use NarrateVision to create stunning videos from your text.
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
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>
              <a href="#getting-started" className="text-blue-600 dark:text-blue-400 hover:underline">Getting Started</a>
            </li>
            <li>
              <a href="#creating-videos" className="text-blue-600 dark:text-blue-400 hover:underline">Creating Videos</a>
            </li>
            <li>
              <a href="#image-sequence" className="text-blue-600 dark:text-blue-400 hover:underline">Image Sequence Videos</a>
            </li>
            <li>
              <a href="#customization" className="text-blue-600 dark:text-blue-400 hover:underline">Customization Options</a>
            </li>
            <li>
              <a href="#troubleshooting" className="text-blue-600 dark:text-blue-400 hover:underline">Troubleshooting</a>
            </li>
          </ul>
        </div>

        {/* Getting Started */}
        <div id="getting-started" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Getting Started</h2>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Prerequisites</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
            <li>An internet connection for AI image and audio generation</li>
            <li>FFmpeg installed for optimal video generation (though the app has a fallback) - <Link href="/ffmpeg-guide" className="text-blue-600 dark:text-blue-400 hover:underline">See installation guide</Link></li>
            <li>A modern web browser (Chrome, Firefox, Safari, or Edge)</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">System Requirements</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Node.js 18+ and npm/yarn/pnpm (for development)</li>
            <li>OpenAI API key (for image and audio generation)</li>
            <li>Sufficient storage space for generated videos</li>
          </ul>
        </div>

        {/* Creating Videos */}
        <div id="creating-videos" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Creating Videos</h2>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Basic Video Creation</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
            <li>Navigate to the NarrateVision homepage</li>
            <li>Enter your narration text in the text area</li>
            <li>Select your preferred voice from the dropdown menu</li>
            <li>Choose an image style that matches your content</li>
            <li>Select a video effect (Single Image or Image Sequence)</li>
            <li>Click "Generate Video" and wait for processing to complete</li>
            <li>Preview your video and download it if satisfied</li>
          </ol>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Tips for Better Results</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Use clear, descriptive language in your narration</li>
            <li>Keep sentences concise and well-structured</li>
            <li>Add line breaks between different segments or scenes</li>
            <li>Include visual descriptions if you want specific imagery</li>
            <li>For longer videos, consider breaking your text into smaller segments</li>
          </ul>
        </div>

        {/* Image Sequence Videos */}
        <div id="image-sequence" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Image Sequence Videos</h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The Image Sequence feature creates slideshow-style videos with multiple images and transitions.
          </p>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">How It Works</h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
            <li>Your narration text is split into segments (up to 4 by default)</li>
            <li>Each segment generates a different image</li>
            <li>The images are combined into a video with smooth transitions</li>
            <li>The audio narration plays over the slideshow</li>
          </ol>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Tips for Better Segmentation</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li>Use paragraph breaks (double line breaks) to clearly separate segments</li>
            <li>Keep segments relatively balanced in length</li>
            <li>Make each segment visually distinct in its description</li>
            <li>For best results, aim for 3-5 segments in your narration</li>
          </ul>

          <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md mt-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-2">Example Format:</h4>
            <pre className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
{`This is the first segment. It will generate one image.

This is the second segment. It will generate another image.

This is the third segment. It will generate a third image.

This is the final segment. It will generate the last image.`}
            </pre>
          </div>
        </div>

        {/* Customization Options */}
        <div id="customization" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Customization Options</h2>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Voice Options</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
            <li><strong>Alloy</strong>: Neutral, balanced voice (default)</li>
            <li><strong>Echo</strong>: Lower pitch, clear voice</li>
            <li><strong>Fable</strong>: Expressive, bright voice</li>
            <li><strong>Onyx</strong>: Deep, authoritative voice</li>
            <li><strong>Nova</strong>: Warm, pleasant voice</li>
            <li><strong>Shimmer</strong>: Crisp, higher-pitched voice</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Image Styles</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300 mb-4">
            <li><strong>Natural</strong>: Realistic, photographic style (default)</li>
            <li><strong>Vivid</strong>: Vibrant, colorful style with enhanced details</li>
            <li><strong>Artistic</strong>: Creative, stylized interpretations</li>
          </ul>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Video Effects</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
            <li><strong>Single Image</strong>: Uses one image with subtle animation effects</li>
            <li><strong>Image Sequence</strong>: Creates a slideshow with multiple images and transitions</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div id="troubleshooting" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8 transition-colors border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Troubleshooting</h2>

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Common Issues</h3>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">FFmpeg Missing</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Install FFmpeg following the instructions in our <Link href="/ffmpeg-guide" className="text-blue-600 dark:text-blue-400 hover:underline">FFmpeg Guide</Link>.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">Image Generation Fails</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Try a simpler description or check your internet connection. The system will use a placeholder image if generation fails.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">Audio Generation Fails</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Try shorter text or check your internet connection. Make sure your OpenAI API key is valid.
            </p>
          </div>

          <div className="mb-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">Video Generation Fails</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Check if both image and audio were generated successfully. The system has fallbacks for when FFmpeg is not available.
            </p>
          </div>

          <div>
            <h4 className="font-medium text-gray-700 dark:text-gray-200 mb-1">Image Sequence Not Working</h4>
            <p className="text-gray-600 dark:text-gray-300">
              Make sure your text has clear paragraph breaks. Try the example format shown in the Image Sequence section.
            </p>
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
                <strong>Need more help?</strong> Check our <Link href="/api-reference" className="underline">API Reference</Link> for advanced usage or try the example scripts in the application.
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
                  <li><Link href="/text-to-image" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm">Text to Image</Link></li>
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
