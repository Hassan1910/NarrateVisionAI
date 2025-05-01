# Creating Slideshow Videos with Multiple Images

This guide will help you create slideshow videos with multiple images using the audio2video application.

## What's New

The application now supports creating true slideshow videos with multiple images and transitions. This means:

1. Your narration text will be split into segments
2. Each segment will generate a different image
3. The images will be combined into a video with smooth transitions
4. The audio narration will play over the slideshow

## How to Create a Slideshow Video

### Step 1: Prepare Your Narration Text

The key to getting good image segments is to structure your text with clear breaks. Here are some effective ways to do this:

#### Method 1: Use Paragraphs (Recommended)

```
This is the first paragraph that will generate the first image.

This is the second paragraph that will generate a different image.

This is the third paragraph with its own distinct visual.

This is the fourth paragraph that will create the final image.
```

#### Method 2: Use Line Breaks

```
This is the first segment.
This is the second segment.
This is the third segment.
This is the fourth segment.
```

#### Method 3: Use Clear Sentences

```
This is the first sentence that will generate an image. This is the second sentence that will generate a different image. This is the third sentence with its own visual. This is the fourth sentence for the final image.
```

### Step 2: Select the Right Options

1. **Voice**: Choose any voice you prefer
2. **Image Style**: Select "natural" for realistic images or "vivid" for more colorful ones
3. **Video Effect**: Make sure to select "Image Sequence" - this is crucial for creating slideshows

### Step 3: Generate the Video

Click the "Generate Video from Text" button and wait for the process to complete:

1. The system will split your text into segments (up to 4 by default)
2. It will generate an image for each segment
3. It will create audio from your narration
4. It will combine everything into a slideshow video with transitions

## Tips for Better Results

1. **Clear Breaks**: Make sure your text has clear paragraph breaks or sentences
2. **Distinct Visuals**: Each segment should describe something visually distinct
3. **Balanced Length**: Try to keep segments roughly similar in length
4. **Descriptive Language**: Use vivid, descriptive language for better images

## Example Text for Testing

Try this example to test the slideshow functionality:

```
A red apple sits on a wooden table, its skin gleaming in the sunlight.

Ocean waves crash against a rocky shore, sending spray high into the air.

A dense forest of tall pine trees stretches toward a clear blue sky.

A golden sunset casts long shadows across a peaceful meadow filled with wildflowers.
```

## Troubleshooting

If you don't get multiple images in your slideshow:

1. Make sure you've selected "Image Sequence" as the video effect
2. Check that your text has clear breaks between segments
3. Try adding explicit paragraph breaks (double line breaks)
4. If all else fails, try the example text above to verify the feature is working

## Technical Details

The slideshow feature uses FFmpeg to combine multiple images with your audio narration. The system:

1. Splits your text into meaningful segments
2. Generates an image for each segment using AI
3. Creates a single audio file from your entire narration
4. Uses FFmpeg to combine the images and audio into a video with transitions
5. Displays the result with playback controls

Enjoy creating your slideshow videos!
