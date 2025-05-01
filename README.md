# NarrateVision

Transform Words into Visual Stories with AI-generated visuals and narration.

![NarrateVision Logo](https://via.placeholder.com/1200x630?text=NarrateVision)

## Features

- **Text-to-Video Conversion**: Enter narration text and get a complete video with visuals and audio
- **AI-Generated Images**: Automatically creates images based on your text
- **Text-to-Speech Narration**: Converts your text to natural-sounding speech
- **Multiple Video Effects**: Choose from different animation styles
- **Slideshow Creation**: Generate videos with multiple images and transitions
- **Customization Options**: Select voice, image style, and video effects
- **Dark Mode Support**: Comfortable viewing in any lighting condition
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface for a seamless user experience

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Requirements

- Node.js 18+ and npm/yarn/pnpm
- FFmpeg (for video generation) - See [INSTALL_FFMPEG.md](INSTALL_FFMPEG.md) for installation instructions
- OpenAI API key (for image and audio generation)

## Configuration

Configure the application by editing the `.env.local` file:

```
# API Keys
OPENAI_API_KEY=your_openai_api_key

# Storage settings
VIDEO_OUTPUT_DIR=/tmp/videos

# FFmpeg Configuration
SHOW_FFMPEG_WARNING=true

# Slideshow Configuration
MAX_SLIDESHOW_IMAGES=4
TRANSITION_DURATION=1

# Image and Audio Configuration
DEFAULT_IMAGE_STYLE=natural
DEFAULT_VOICE=alloy
```

## Creating Slideshow Videos

The application now supports creating slideshow videos with multiple images and transitions. See [slideshow-guide.md](slideshow-guide.md) for detailed instructions.

If you encounter any issues with the slideshow feature, refer to the [slideshow-troubleshooting.md](slideshow-troubleshooting.md) guide for solutions to common problems.

## User Interface

NarrateVision features a modern, intuitive user interface designed for ease of use:

- **Clean Design**: Minimalist interface that focuses on content creation
- **Visual Feedback**: Clear progress indicators and status messages
- **Responsive Layout**: Adapts to different screen sizes and devices
- **Dark Mode**: Toggle between light and dark themes based on preference
- **Accessibility**: Designed with accessibility in mind for all users

The application guides you through the video creation process with clear instructions and visual cues at each step.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
