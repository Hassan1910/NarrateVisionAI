# Guide to Creating Videos with Multiple Image Transitions

## Understanding the System

The audio2video system has a feature called "Image Sequence" that's designed to create videos with multiple images and transitions. Here's how to make it work:

## Prerequisites

1. **API Key**: The system requires an OpenAI API key to generate images and audio. Make sure this is properly configured.
2. **Text Segmentation**: The system splits your narration into segments (up to 4 by default) and generates an image for each segment.
3. **FFmpeg**: For optimal video generation, FFmpeg should be installed (though the app has a fallback).

## Step-by-Step Guide

### Step 1: Prepare Your Narration Text

The key to getting multiple images is to structure your text in a way that helps the system identify clear segments:

```
First segment with a clear ending point.

Second segment with its own distinct visual elements.

Third segment that stands on its own.

Fourth segment with a strong conclusion.
```

**Important Tips:**
- Use periods to end sentences clearly
- Add blank lines between segments
- Keep segments relatively balanced in length
- Make each segment visually distinct

### Step 2: Open the Application

- Go to http://localhost:3000 in your browser

### Step 3: Enter Your Narration Text

For your motivational video, use this optimized version:

```
Success doesn't come overnight. It's built, one small step at a time.

Each morning you rise, you're given a new opportunity to grow.

Consistency means showing up, even when you don't feel like it.

At first, the progress may seem invisible. But every action adds up. And one day, you'll look back and see how far you've come.

Stay consistent. Your future self is already proud of you. Remember, success is the sum of small efforts, repeated day in and day out. - Robert Collier
```

### Step 4: Select the Right Options

1. **Voice**: Choose "alloy" (or another voice you prefer)
2. **Image Style**: Select "natural" for realistic images
3. **Video Effect**: Choose "Image Sequence" - this is crucial for multiple images

### Step 5: Generate the Video

- Click the "Generate Video" button
- The system will:
  1. Split your narration into segments
  2. Generate an image for each segment
  3. Generate audio from your narration
  4. Combine everything into a video with transitions

### Step 6: Troubleshooting

If you don't see multiple images in your video:

1. **Check the Console**: Open your browser's developer tools (F12) and check for any errors
2. **API Key Issues**: Make sure the OpenAI API key is valid and has sufficient credits
3. **Text Segmentation**: Try making your segments more distinct with clearer breaks
4. **Reduce Text Length**: If your text is too long, try a shorter version first to test
5. **Try Different Formatting**: Add more line breaks or use shorter sentences

## Technical Details

The system uses these components for multiple image videos:

1. `splitTextIntoSegments()` function to divide your narration
2. `/api/generate-multiple-images` endpoint to create images for each segment
3. `ImageSequence` component to display the images with transitions

## Testing with a Simple Example

To verify the multiple image feature is working, try this very simple test:

```
This is the first segment.

This is the second segment.

This is the third segment.

This is the fourth segment.
```

This minimal example should produce 4 distinct images if the feature is working correctly.
