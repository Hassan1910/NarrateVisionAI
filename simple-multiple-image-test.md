# Simple Test for Multiple Image Transitions

## Extremely Simple Test Script

Copy and paste this minimal text into the application:

```
This is a red apple on a white table.

This is a blue ocean with waves.

This is a green forest with tall trees.

This is a yellow sun in a clear sky.
```

## Why This Test Works

1. **Very Short Segments**: Each segment is just one sentence
2. **Clear Visual Distinction**: Each segment describes a completely different object/scene with different colors
3. **Simple Language**: No complex descriptions that might confuse the AI
4. **Equal Length**: All segments are approximately the same length

## Application Settings

- **Voice**: alloy
- **Image Style**: vivid (to make the colors more pronounced)
- **Video Effect**: Image Sequence

## Expected Results

If the multiple image feature is working correctly, you should see:
1. An image of a red apple
2. An image of a blue ocean
3. An image of a green forest
4. An image of a yellow sun

The transitions between these images should be clear and distinct due to the dramatically different content and colors.

## What to Look For

1. **During Generation**: Check if the system indicates it's generating multiple images
2. **In the Preview**: Look for the image thumbnails at the bottom of the video player
3. **During Playback**: Watch if the images change as the narration progresses

## If This Test Fails

If even this simple test doesn't produce multiple images, there might be:
1. An issue with the OpenAI API key
2. A bug in the application's image sequence feature
3. A configuration problem with the environment variables

In that case, you might need to check the application logs or contact the developer for assistance.
