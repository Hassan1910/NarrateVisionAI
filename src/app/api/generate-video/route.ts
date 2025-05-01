import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpegUtils from '@/utils/ffmpeg';
const { generateVideo, cleanupFiles } = ffmpegUtils;
import { generateSequenceVideo } from '@/utils/sequence-ffmpeg';

const OUTPUT_DIR = process.env.VIDEO_OUTPUT_DIR || '/tmp/videos';
const PUBLIC_VIDEOS_DIR = path.join(process.cwd(), 'public', 'media', 'videos');

// Initialize directories
[OUTPUT_DIR, PUBLIC_VIDEOS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { imagePath, audioPath, imagePaths } = body; // text is used later in the function

  if (!audioPath) {
    return NextResponse.json({ error: 'Audio path is required' }, { status: 400 });
  }

  // Check if we have multiple images or a single image
  if (!imagePath && (!imagePaths || !Array.isArray(imagePaths) || imagePaths.length === 0)) {
    return NextResponse.json({ error: 'Either imagePath or imagePaths is required' }, { status: 400 });
  }

  // Verify audio file exists
  if (!fs.existsSync(audioPath)) {
    return NextResponse.json({ error: 'Audio file not found' }, { status: 400 });
  }

  // If we have multiple images, verify they all exist
  if (imagePaths && Array.isArray(imagePaths) && imagePaths.length > 0) {
    const missingImages = imagePaths.filter(imgPath => !fs.existsSync(imgPath));
    if (missingImages.length > 0) {
      return NextResponse.json({
        error: 'Some image files not found',
        details: `Missing ${missingImages.length} images`
      }, { status: 400 });
    }
  } else if (imagePath && !fs.existsSync(imagePath)) {
    // If we have a single image, verify it exists
    return NextResponse.json({ error: 'Image file not found' }, { status: 400 });
  }

  try {
    let videoPath;

    // Check if this is a sequence video request (multiple images with "sequence" effect)
    const isSequence = body.effect === 'sequence' && imagePaths && Array.isArray(imagePaths) && imagePaths.length > 1;

    if (isSequence) {
      console.log('Using specialized sequence video generation for multiple images');
      // Use our specialized sequence video generation function
      videoPath = await generateSequenceVideo(
        imagePaths,
        audioPath,
        OUTPUT_DIR
      );
    } else {
      // Use standard video generation for other cases
      videoPath = await generateVideo({
        imagePath: imagePath || (imagePaths && imagePaths[0]),
        imagePaths: imagePaths,
        audioPath,
        outputDir: OUTPUT_DIR
      });
    }

    try {
      // Ensure public directory exists
      if (!fs.existsSync(PUBLIC_VIDEOS_DIR)) {
        fs.mkdirSync(PUBLIC_VIDEOS_DIR, { recursive: true });
      }

      // For public access, copy to public directory
      const publicVideoFilename = path.basename(videoPath);
      const publicVideoPath = path.join('media/videos', publicVideoFilename);
      const fullPublicPath = path.join(PUBLIC_VIDEOS_DIR, publicVideoFilename);

      // Ensure image directory exists
      const publicImagesDir = path.join(process.cwd(), 'public', 'media', 'images');
      if (!fs.existsSync(publicImagesDir)) {
        fs.mkdirSync(publicImagesDir, { recursive: true });
      }

      // Handle multiple images or single image
      const imagePathsToCleanup: string[] = [];
      let primaryImagePath = '';
      let primaryImageUrl = '';
      const publicImageUrls: string[] = [];

      // Process images - either multiple or single
      if (imagePaths && Array.isArray(imagePaths) && imagePaths.length > 0) {
        // Handle multiple images
        for (const imgPath of imagePaths) {
          const publicImageFilename = `img-${uuidv4()}${path.extname(imgPath)}`;
          const publicImagePath = path.join('media/images', publicImageFilename);
          const fullPublicImagePath = path.join(publicImagesDir, publicImageFilename);

          // Copy image to public directory
          fs.copyFileSync(imgPath, fullPublicImagePath);
          console.log(`Image saved to: ${fullPublicImagePath}`);

          // Add to cleanup list
          imagePathsToCleanup.push(imgPath);

          // Add to public URLs list
          publicImageUrls.push(`/${publicImagePath}`);

          // Set primary image (first one) for fallback
          if (!primaryImagePath) {
            primaryImagePath = publicImagePath;
            primaryImageUrl = `/${publicImagePath}`;
          }
        }
      } else if (imagePath) {
        // Handle single image
        const publicImageFilename = `img-${uuidv4()}${path.extname(imagePath)}`;
        const publicImagePath = path.join('media/images', publicImageFilename);
        const fullPublicImagePath = path.join(publicImagesDir, publicImageFilename);

        // Copy image to public directory
        fs.copyFileSync(imagePath, fullPublicImagePath);
        console.log(`Image saved to: ${fullPublicImagePath}`);

        // Add to cleanup list
        imagePathsToCleanup.push(imagePath);

        // Set primary image
        primaryImagePath = publicImagePath;
        primaryImageUrl = `/${publicImagePath}`;
        publicImageUrls.push(primaryImageUrl);
      }

      // Copy video to public directory
      fs.copyFileSync(videoPath, fullPublicPath);
      console.log(`Video saved to: ${fullPublicPath}`);

      // Clean up temporary files (except the final video)
      cleanupFiles(imagePathsToCleanup);

      // If FFmpeg is not available, use our sample HTML file
      const isFFmpegAvailable = !videoPath.includes('fallback');

      // Create proper URLs for the resources
      const videoUrl = `/${publicVideoPath}`;
      const fallbackUrl = `/sample-video.html?image=${primaryImageUrl}&text=${encodeURIComponent(body.text || '')}`;

      return NextResponse.json({
        success: true,
        videoPath: publicVideoPath,
        // If FFmpeg is not available, use our sample HTML with parameters
        videoUrl: isFFmpegAvailable ? videoUrl : fallbackUrl,
        imagePath: primaryImagePath,
        imageUrl: primaryImageUrl,
        imageUrls: publicImageUrls,
        isSlideshow: imagePaths && Array.isArray(imagePaths) && imagePaths.length > 1,
        isSequence: isSequence,
        effect: body.effect || 'simple'
      });
    } catch (saveError: any) {
      console.error('Error saving video files:', saveError);

      // Return a fallback response
      return NextResponse.json({
        success: false,
        error: 'Failed to save video files',
        details: saveError.message || 'Unknown error'
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error('Error generating video:', error);

    return NextResponse.json(
      { error: 'Failed to generate video', details: error.message },
      { status: 500 }
    );
  }
}