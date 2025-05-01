import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import * as ffmpegUtils from './ffmpeg';

/**
 * Specialized function for generating a sequence video from multiple images
 * This uses a different approach than the standard slideshow function
 * to avoid the "No JPEG data found in image" error
 */
export const generateSequenceVideo = async (
  imagePaths: string[],
  audioPath: string,
  outputDir: string
): Promise<string> => {
  if (!imagePaths || imagePaths.length === 0) {
    throw new Error('No images provided for sequence video');
  }

  ffmpegUtils.ensureOutputDir(outputDir);

  // Generate unique output filename and temporary files directory
  const outputFilename = `sequence-${uuidv4()}.mp4`;
  const outputPath = path.join(outputDir, outputFilename);
  const tempDir = path.join(outputDir, `temp-${uuidv4()}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Check if FFmpeg is installed
  const ffmpegStatus = await ffmpegUtils.checkFFmpeg();

  if (!ffmpegStatus.installed) {
    console.warn('FFmpeg not found. Using fallback video generation.');
    console.log('Please install FFmpeg for proper video generation. See INSTALL_FFMPEG.md for instructions.');
    return ffmpegUtils.createFallbackVideo(imagePaths[0], outputPath);
  }

  console.log(`Using FFmpeg ${ffmpegStatus.version || 'unknown version'} to generate sequence video`);

  try {
    // Create a frames directory for the sequence
    const framesDir = path.join(tempDir, 'frames');
    if (!fs.existsSync(framesDir)) {
      fs.mkdirSync(framesDir, { recursive: true });
    }

    // Process each image to ensure it's in a compatible format
    console.log(`Processing ${imagePaths.length} images for sequence...`);

    // Copy and rename each image to ensure sequential naming
    for (let i = 0; i < imagePaths.length; i++) {
      const imgPath = imagePaths[i];
      const framePath = path.join(framesDir, `frame_${i.toString().padStart(3, '0')}.png`);

      // Use FFmpeg to convert each image to a standard format
      await new Promise<void>((resolve, reject) => {
        console.log(`Processing image ${i + 1}/${imagePaths.length}`);

        const ffmpegProcess = spawn('ffmpeg', [
          '-y',
          '-i', imgPath,
          '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
          framePath
        ]);

        ffmpegProcess.stderr.on('data', (data) => {
          console.log(`FFmpeg preprocessing ${i + 1}: ${data}`);
        });

        ffmpegProcess.on('close', (code) => {
          if (code === 0) {
            console.log(`Successfully processed image ${i + 1}`);
            resolve();
          } else {
            console.warn(`Failed to process image ${i + 1}. Code: ${code}`);
            reject(new Error(`Failed to process image ${i + 1}`));
          }
        });

        ffmpegProcess.on('error', (err) => {
          console.warn(`Error processing image ${i + 1}: ${err.message}`);
          reject(err);
        });
      }).catch(err => {
        console.error(`Error processing image ${i + 1}:`, err);
        // Continue with next image even if this one fails
      });
    }

    // Check if we have any processed frames
    const frameFiles = fs.readdirSync(framesDir).filter(file => file.startsWith('frame_'));
    if (frameFiles.length === 0) {
      throw new Error('No valid frames were created for the sequence');
    }

    console.log(`Successfully processed ${frameFiles.length} frames for sequence`);

    // Create the sequence video using the image2 demuxer
    return new Promise<string>((resolve, reject) => {
      console.log('Generating sequence video...');

      // Calculate framerate based on number of images and desired duration
      // Aim for about 3 seconds per image
      const totalDuration = 3 * frameFiles.length;
      const frameRate = frameFiles.length / totalDuration;

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-framerate', frameRate.toString(),
        '-i', path.join(framesDir, 'frame_%03d.png'),
        '-i', audioPath,
        '-c:v', 'libx264',
        '-preset', 'ultrafast', // Use ultrafast for better compatibility
        '-tune', 'stillimage',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-pix_fmt', 'yuv420p',
        '-shortest',
        outputPath
      ]);

      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg sequence: ${data}`);
      });

      ffmpegProcess.on('close', (code) => {
        try {
          // Clean up temporary files
          if (fs.existsSync(tempDir)) {
            fs.rmdirSync(tempDir, { recursive: true });
          }
        } catch (cleanupError) {
          console.error('Error cleaning up temp files:', cleanupError);
        }

        if (code === 0) {
          console.log('Successfully generated sequence video');
          resolve(outputPath);
        } else {
          console.warn(`FFmpeg process exited with code ${code}. Trying alternative approach...`);

          // Try an alternative approach with a different command
          const alternativeProcess = spawn('ffmpeg', [
            '-y',
            '-loop', '1',
            '-i', imagePaths[0], // Use first image as fallback
            '-i', audioPath,
            '-c:v', 'libx264',
            '-tune', 'stillimage',
            '-c:a', 'aac',
            '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            '-shortest',
            outputPath
          ]);

          alternativeProcess.stderr.on('data', (data) => {
            console.log(`FFmpeg alternative: ${data}`);
          });

          alternativeProcess.on('close', (altCode) => {
            if (altCode === 0) {
              console.log('Successfully generated video with alternative approach');
              resolve(outputPath);
            } else {
              console.warn(`Alternative FFmpeg process failed with code ${altCode}. Using fallback.`);
              ffmpegUtils.createFallbackVideo(imagePaths[0], outputPath)
                .then(resolve)
                .catch(reject);
            }
          });

          alternativeProcess.on('error', (err) => {
            console.warn(`Failed to start alternative FFmpeg process: ${err.message}. Using fallback.`);
            ffmpegUtils.createFallbackVideo(imagePaths[0], outputPath)
              .then(resolve)
              .catch(reject);
          });
        }
      });

      ffmpegProcess.on('error', (err) => {
        console.warn(`Failed to start FFmpeg process: ${err.message}. Using fallback.`);
        ffmpegUtils.createFallbackVideo(imagePaths[0], outputPath)
          .then(resolve)
          .catch(reject);
      });
    });
  } catch (error) {
    console.error('Error generating sequence video:', error);
    return ffmpegUtils.createFallbackVideo(imagePaths[0], outputPath);
  }
};
