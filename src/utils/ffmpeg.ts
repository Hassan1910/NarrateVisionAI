import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Ensure video output directory exists
export const ensureOutputDir = (outputDir: string) => {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
};

export interface VideoGenerationOptions {
  imagePath: string;
  audioPath: string;
  outputDir: string;
  duration?: number;
  imagePaths?: string[]; // Array of image paths for slideshow
  transitionDuration?: number; // Duration of transitions between images in seconds
}

/**
 * Check if FFmpeg is installed and get version information
 * @returns Object with installed status and version info
 */
export const checkFFmpeg = async (): Promise<{ installed: boolean; version?: string }> => {
  return new Promise((resolve) => {
    let versionInfo = '';
    const process = spawn('ffmpeg', ['-version']);

    process.stdout.on('data', (data) => {
      versionInfo += data.toString();
    });

    process.on('error', () => {
      console.warn('FFmpeg not found on system PATH');
      resolve({ installed: false });
    });

    process.on('close', (code) => {
      if (code === 0 && versionInfo) {
        // Extract version from the output
        const versionMatch = versionInfo.match(/ffmpeg version (\S+)/);
        const version = versionMatch ? versionMatch[1] : 'unknown';
        console.log(`FFmpeg detected: version ${version}`);
        resolve({ installed: true, version });
      } else {
        console.warn('FFmpeg check failed with code:', code);
        resolve({ installed: false });
      }
    });
  });
};

/**
 * Create a fallback video when FFmpeg is not available
 * @param imagePath Path to the image file
 * @param outputPath Path where the output video should be saved
 * @returns Path to the created video file
 */
export const createFallbackVideo = async (imagePath: string, outputPath: string): Promise<string> => {
  console.log('Creating fallback video using HTML-based player');
  // Note: imagePath is passed but not used directly in this function.
  // It's used by the caller to create the HTML fallback player.

  // Create a minimal valid MP4 file as a placeholder
  // This is just a container with no actual video data
  const placeholderData = new Uint8Array([
    0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, 0x69, 0x73, 0x6F, 0x6D,
    0x00, 0x00, 0x02, 0x00, 0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
    0x6D, 0x70, 0x34, 0x31, 0x00, 0x00, 0x00, 0x08
  ]);

  fs.writeFileSync(outputPath, Buffer.from(placeholderData));

  // Also create a .ffmpeg_missing file to indicate FFmpeg was not available
  // This can be used by the frontend to show installation instructions
  const ffmpegMissingPath = path.join(path.dirname(outputPath), '.ffmpeg_missing');
  fs.writeFileSync(ffmpegMissingPath, 'FFmpeg is required for proper video generation. See INSTALL_FFMPEG.md for installation instructions.');

  return outputPath;
};

/**
 * Validate image file to ensure it's a valid image
 * @param imagePath Path to the image file
 * @returns Boolean indicating if the image is valid
 */
export const validateImage = (imagePath: string): boolean => {
  try {
    if (!fs.existsSync(imagePath)) {
      console.warn(`Image file does not exist: ${imagePath}`);
      return false;
    }

    // Read the first few bytes to check if it's a valid image
    const fd = fs.openSync(imagePath, 'r');
    const buffer = Buffer.alloc(12); // Read more bytes for better validation
    fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    // Check for JPEG, PNG, or other common image formats
    const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
    const isPNG = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;

    if (!isJPEG && !isPNG) {
      console.warn(`File is not a valid JPEG or PNG image: ${imagePath}`);
      return false;
    }

    // Check file size - extremely small files are likely corrupted
    const stats = fs.statSync(imagePath);
    if (stats.size < 100) { // Less than 100 bytes is definitely not a valid image
      console.warn(`Image file is too small (${stats.size} bytes): ${imagePath}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Error validating image ${imagePath}:`, error);
    return false;
  }
};

/**
 * Preprocess image to ensure it's compatible with FFmpeg
 * @param imagePath Path to the original image
 * @param tempDir Directory to store processed images
 * @returns Path to the processed image
 */
export const preprocessImage = async (imagePath: string, tempDir: string): Promise<string> => {
  try {
    if (!validateImage(imagePath)) {
      throw new Error(`Invalid image: ${imagePath}`);
    }

    // Create a unique filename for the processed image
    const processedFilename = `processed-${path.basename(imagePath)}`;
    const processedPath = path.join(tempDir, processedFilename);

    // Use FFmpeg to convert the image to a standard format
    // This helps fix many compatibility issues
    return new Promise<string>((resolve, reject) => {
      console.log(`Preprocessing image: ${imagePath}`);

      const ffmpegProcess = spawn('ffmpeg', [
        '-y',
        '-i', imagePath,
        '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
        '-pix_fmt', 'yuv420p',
        processedPath
      ]);

      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg preprocessing: ${data}`);
      });

      ffmpegProcess.on('close', (code) => {
        if (code === 0 && fs.existsSync(processedPath)) {
          console.log(`Successfully preprocessed image: ${imagePath}`);
          resolve(processedPath);
        } else {
          console.warn(`Failed to preprocess image: ${imagePath}`);
          // If preprocessing fails, return the original path
          resolve(imagePath);
        }
      });

      ffmpegProcess.on('error', (err) => {
        console.warn(`Error preprocessing image: ${err.message}`);
        // If preprocessing fails, return the original path
        resolve(imagePath);
      });
    });
  } catch (error) {
    console.error(`Error preprocessing image ${imagePath}:`, error);
    return imagePath; // Return original path if preprocessing fails
  }
};

/**
 * Generate a slideshow video from multiple images and an audio file using FFmpeg
 */
export const generateSlideshowVideo = async (options: VideoGenerationOptions): Promise<string> => {
  const { imagePaths = [], audioPath, outputDir, transitionDuration = 1 } = options;

  if (!imagePaths || imagePaths.length === 0) {
    throw new Error('No images provided for slideshow');
  }

  ensureOutputDir(outputDir);

  // Generate unique output filename and temporary files directory
  const outputFilename = `slideshow-${uuidv4()}.mp4`;
  const outputPath = path.join(outputDir, outputFilename);
  const tempDir = path.join(outputDir, `temp-${uuidv4()}`);

  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Check if FFmpeg is installed
  const ffmpegStatus = await checkFFmpeg();

  if (!ffmpegStatus.installed) {
    console.warn('FFmpeg not found. Using fallback video generation.');
    console.log('Please install FFmpeg for proper video generation. See INSTALL_FFMPEG.md for instructions.');
    return createFallbackVideo(imagePaths[0], outputPath);
  }

  console.log(`Using FFmpeg ${ffmpegStatus.version || 'unknown version'} to generate slideshow video`);

  try {
    // Validate all images and filter out invalid ones
    const validImagePaths = imagePaths.filter(imgPath => validateImage(imgPath));

    if (validImagePaths.length === 0) {
      console.error('No valid images found for slideshow');
      throw new Error('No valid images found for slideshow');
    }

    console.log(`Using ${validImagePaths.length} valid images out of ${imagePaths.length} provided`);

    // Preprocess all valid images to ensure compatibility with FFmpeg
    console.log('Preprocessing images for better compatibility...');
    const processedImagesDir = path.join(tempDir, 'processed');
    if (!fs.existsSync(processedImagesDir)) {
      fs.mkdirSync(processedImagesDir, { recursive: true });
    }

    // Process all images in parallel
    const processedImagePaths = await Promise.all(
      validImagePaths.map(async (imgPath, index) => {
        try {
          // Create a standardized image using FFmpeg
          const processedFilename = `processed-${index}.jpg`;
          const processedPath = path.join(processedImagesDir, processedFilename);

          // Use FFmpeg to convert the image to a standard format
          await new Promise<void>((resolve, reject) => {
            console.log(`Preprocessing image ${index + 1}/${validImagePaths.length}: ${imgPath}`);

            const ffmpegProcess = spawn('ffmpeg', [
              '-y',
              '-i', imgPath,
              '-vf', 'scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2',
              '-pix_fmt', 'yuv420p',
              processedPath
            ]);

            ffmpegProcess.stderr.on('data', (data) => {
              console.log(`FFmpeg preprocessing ${index + 1}: ${data}`);
            });

            ffmpegProcess.on('close', (code) => {
              if (code === 0 && fs.existsSync(processedPath)) {
                console.log(`Successfully preprocessed image ${index + 1}`);
                resolve();
              } else {
                console.warn(`Failed to preprocess image ${index + 1}: ${imgPath}`);
                reject(new Error(`Failed to preprocess image ${index + 1}`));
              }
            });

            ffmpegProcess.on('error', (err) => {
              console.warn(`Error preprocessing image ${index + 1}: ${err.message}`);
              reject(err);
            });
          }).catch(err => {
            console.error(`Error preprocessing image ${index + 1}:`, err);
            // If preprocessing fails, return the original path
            return imgPath;
          });

          // Check if the processed file exists and is valid
          if (fs.existsSync(processedPath) && validateImage(processedPath)) {
            return processedPath;
          } else {
            console.warn(`Processed image ${index + 1} is invalid, using original`);
            return imgPath;
          }
        } catch (error) {
          console.error(`Error processing image ${index + 1}:`, error);
          return imgPath; // Return original path if processing fails
        }
      })
    );

    console.log(`Preprocessing complete. Using ${processedImagePaths.length} processed images.`);

    // Create a text file with the list of processed images for FFmpeg
    const listFilePath = path.join(tempDir, 'images.txt');
    const listContent = processedImagePaths.map(imgPath => {
      // Ensure path is properly formatted for FFmpeg
      return `file '${imgPath.replace(/\\/g, '/')}'`;
    }).join('\n');

    fs.writeFileSync(listFilePath, listContent);
    console.log('Created image list file for FFmpeg');

    return new Promise<string>((resolve, reject) => {
      // Try different approaches for slideshow generation
      // First, try to use the concat demuxer approach which is more reliable
      console.log('Attempting slideshow generation with concat demuxer...');

      // Create a more detailed concat file with durations
      const detailedListContent = processedImagePaths.map(imgPath => {
        // Each image should appear for a few seconds
        return `file '${imgPath.replace(/\\/g, '/')}'\nduration 3`;
      }).join('\n');

      // Add the last image again without duration (required by the format)
      const lastImagePath = processedImagePaths[processedImagePaths.length - 1];
      const finalListContent = detailedListContent + `\nfile '${lastImagePath.replace(/\\/g, '/')}'`;

      // Write the detailed list file
      const detailedListFilePath = path.join(tempDir, 'detailed-images.txt');
      fs.writeFileSync(detailedListFilePath, finalListContent);

      console.log('Created detailed image list with durations');

      // Set up FFmpeg command for slideshow with transitions
      // Using a more robust approach with explicit options
      const ffmpegProcess = spawn('ffmpeg', [
        '-y', // Overwrite output file if it exists
        '-f', 'concat',
        '-safe', '0',
        '-i', detailedListFilePath,
        '-i', audioPath,
        '-c:v', 'libx264',
        '-preset', 'medium', // Better compatibility
        '-profile:v', 'high',
        '-level', '4.0',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-ar', '44100', // Standard audio sample rate
        '-pix_fmt', 'yuv420p',
        '-shortest',
        '-vf', `fps=25,scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2,format=yuv420p`,
        '-vsync', 'vfr',
        outputPath
      ]);

      // Handle process events
      ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg: ${data}`);
      });

      ffmpegProcess.on('close', (code) => {
        if (code === 0) {
          console.log('Successfully generated slideshow with concat demuxer approach');

          // Clean up temporary files
          try {
            if (fs.existsSync(listFilePath)) {
              fs.unlinkSync(listFilePath);
            }
            if (fs.existsSync(detailedListFilePath)) {
              fs.unlinkSync(detailedListFilePath);
            }
            if (fs.existsSync(tempDir)) {
              fs.rmdirSync(tempDir, { recursive: true });
            }
          } catch (cleanupError) {
            console.error('Error cleaning up temp files:', cleanupError);
          }

          resolve(outputPath);
        } else {
          console.warn(`First FFmpeg approach failed with code ${code}. Trying alternative approach...`);

          // Try a simpler approach as fallback
          try {
            // Create a simpler slideshow using the image2 demuxer
            console.log('Attempting slideshow generation with image2 demuxer...');

            // Create a temporary directory for frame sequence
            const framesDir = path.join(tempDir, 'frames');
            if (!fs.existsSync(framesDir)) {
              fs.mkdirSync(framesDir, { recursive: true });
            }

            // Copy all processed images to the frames directory with sequential names
            processedImagePaths.forEach((imgPath, idx) => {
              const framePath = path.join(framesDir, `frame_${idx.toString().padStart(3, '0')}.jpg`);
              fs.copyFileSync(imgPath, framePath);
            });

            // Use the image2 demuxer with a framerate that gives each image about 3 seconds
            const frameRate = processedImagePaths.length / 15; // Aim for ~15 seconds total

            const fallbackProcess = spawn('ffmpeg', [
              '-y',
              '-framerate', frameRate.toString(),
              '-i', path.join(framesDir, 'frame_%03d.jpg'),
              '-i', audioPath,
              '-c:v', 'libx264',
              '-preset', 'ultrafast', // Faster encoding for compatibility
              '-c:a', 'aac',
              '-b:a', '192k',
              '-pix_fmt', 'yuv420p',
              '-shortest',
              outputPath
            ]);

            fallbackProcess.stderr.on('data', (data) => {
              console.log(`FFmpeg fallback: ${data}`);
            });

            fallbackProcess.on('close', (fallbackCode) => {
              // Clean up temporary files
              try {
                if (fs.existsSync(listFilePath)) {
                  fs.unlinkSync(listFilePath);
                }
                if (fs.existsSync(detailedListFilePath)) {
                  fs.unlinkSync(detailedListFilePath);
                }
                if (fs.existsSync(tempDir)) {
                  fs.rmdirSync(tempDir, { recursive: true });
                }
              } catch (cleanupError) {
                console.error('Error cleaning up temp files:', cleanupError);
              }

              if (fallbackCode === 0) {
                console.log('Successfully generated slideshow with fallback approach');
                resolve(outputPath);
              } else {
                console.warn(`Both FFmpeg approaches failed. Using simple fallback.`);
                // Use the first processed image for fallback
                const fallbackImage = processedImagePaths.length > 0 ? processedImagePaths[0] : validImagePaths[0];
                createFallbackVideo(fallbackImage, outputPath)
                  .then(resolve)
                  .catch(reject);
              }
            });

            fallbackProcess.on('error', (err) => {
              console.warn(`Failed to start fallback FFmpeg process: ${err.message}. Using simple fallback.`);
              // Use the first processed image for fallback
              const fallbackImage = processedImagePaths.length > 0 ? processedImagePaths[0] : validImagePaths[0];
              createFallbackVideo(fallbackImage, outputPath)
                .then(resolve)
                .catch(reject);
            });
          } catch (fallbackError) {
            console.error('Error in fallback slideshow approach:', fallbackError);
            // Use the first processed image for fallback
            const fallbackImage = processedImagePaths.length > 0 ? processedImagePaths[0] : validImagePaths[0];
            createFallbackVideo(fallbackImage, outputPath)
              .then(resolve)
              .catch(reject);
          }
        }
      });

      ffmpegProcess.on('error', (err) => {
        console.warn(`Failed to start FFmpeg process: ${err.message}. Trying alternative approach...`);

        // Try the same fallback approach as in the 'close' handler
        try {
          // Create a simpler slideshow using the image2 demuxer
          console.log('Attempting slideshow generation with image2 demuxer after process error...');

          // Create a temporary directory for frame sequence
          const framesDir = path.join(tempDir, 'frames');
          if (!fs.existsSync(framesDir)) {
            fs.mkdirSync(framesDir, { recursive: true });
          }

          // Copy all processed images to the frames directory with sequential names
          processedImagePaths.forEach((imgPath, idx) => {
            const framePath = path.join(framesDir, `frame_${idx.toString().padStart(3, '0')}.jpg`);
            fs.copyFileSync(imgPath, framePath);
          });

          // Use the image2 demuxer with a framerate that gives each image about 3 seconds
          const frameRate = processedImagePaths.length / 15; // Aim for ~15 seconds total

          const fallbackProcess = spawn('ffmpeg', [
            '-y',
            '-framerate', frameRate.toString(),
            '-i', path.join(framesDir, 'frame_%03d.jpg'),
            '-i', audioPath,
            '-c:v', 'libx264',
            '-preset', 'ultrafast', // Faster encoding for compatibility
            '-c:a', 'aac',
            '-b:a', '192k',
            '-pix_fmt', 'yuv420p',
            '-shortest',
            outputPath
          ]);

          fallbackProcess.stderr.on('data', (data) => {
            console.log(`FFmpeg fallback: ${data}`);
          });

          fallbackProcess.on('close', (fallbackCode) => {
            // Clean up temporary files
            try {
              if (fs.existsSync(listFilePath)) {
                fs.unlinkSync(listFilePath);
              }
              if (fs.existsSync(detailedListFilePath)) {
                fs.unlinkSync(detailedListFilePath);
              }
              if (fs.existsSync(tempDir)) {
                fs.rmdirSync(tempDir, { recursive: true });
              }
            } catch (cleanupError) {
              console.error('Error cleaning up temp files:', cleanupError);
            }

            if (fallbackCode === 0) {
              console.log('Successfully generated slideshow with fallback approach');
              resolve(outputPath);
            } else {
              console.warn(`Both FFmpeg approaches failed. Using simple fallback.`);
              createFallbackVideo(validImagePaths[0], outputPath)
                .then(resolve)
                .catch(reject);
            }
          });

          fallbackProcess.on('error', (err) => {
            console.warn(`Failed to start fallback FFmpeg process: ${err.message}. Using simple fallback.`);
            // Use the first processed image for fallback
            const fallbackImage = processedImagePaths.length > 0 ? processedImagePaths[0] : validImagePaths[0];
            createFallbackVideo(fallbackImage, outputPath)
              .then(resolve)
              .catch(reject);
          });
        } catch (fallbackError) {
          console.error('Error in fallback slideshow approach:', fallbackError);
          // Use the first processed image for fallback
          const fallbackImage = processedImagePaths.length > 0 ? processedImagePaths[0] : validImagePaths[0];
          createFallbackVideo(fallbackImage, outputPath)
            .then(resolve)
            .catch(reject);
        }
      });
    });
  } catch (error) {
    console.error('Error generating slideshow:', error);
    // Just use the first image for fallback in case of complete failure
    const fallbackImage = imagePaths[0];
    return createFallbackVideo(fallbackImage, outputPath);
  }
};

/**
 * Generate a video from an image and audio file using FFmpeg
 */
export const generateVideo = async (options: VideoGenerationOptions): Promise<string> => {
  // Check if we should generate a slideshow video
  if (options.imagePaths && options.imagePaths.length > 1) {
    console.log(`Generating slideshow video with ${options.imagePaths.length} images`);
    return generateSlideshowVideo(options);
  }

  const { imagePath, audioPath, outputDir, duration } = options;

  ensureOutputDir(outputDir);

  // Generate unique output filename
  const outputFilename = `video-${uuidv4()}.mp4`;
  const outputPath = path.join(outputDir, outputFilename);

  // Check if FFmpeg is installed
  const ffmpegStatus = await checkFFmpeg();

  if (!ffmpegStatus.installed) {
    console.warn('FFmpeg not found. Using fallback video generation.');
    console.log('Please install FFmpeg for proper video generation. See INSTALL_FFMPEG.md for instructions.');
    return createFallbackVideo(imagePath, outputPath);
  }

  console.log(`Using FFmpeg ${ffmpegStatus.version || 'unknown version'} to generate video`);

  return new Promise<string>((resolve, reject) => {
    // Determine video duration - use audio length or provided duration
    const durationArg = duration ? ['-t', duration.toString()] : [];

    // Set up FFmpeg command with 720p resolution
    const ffmpegProcess = spawn('ffmpeg', [
      '-loop', '1',
      '-i', imagePath,
      '-i', audioPath,
      '-c:v', 'libx264',
      '-tune', 'stillimage',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-pix_fmt', 'yuv420p',
      '-shortest',
      '-vf', 'scale=1280:720',
      ...durationArg,
      outputPath
    ]);

    // Handle process events
    ffmpegProcess.stderr.on('data', (data) => {
      console.log(`FFmpeg: ${data}`);
    });

    ffmpegProcess.on('close', (code) => {
      if (code === 0) {
        resolve(outputPath);
      } else {
        console.warn(`FFmpeg process exited with code ${code}. Using fallback.`);
        createFallbackVideo(imagePath, outputPath)
          .then(resolve)
          .catch(reject);
      }
    });

    ffmpegProcess.on('error', (err) => {
      console.warn(`Failed to start FFmpeg process: ${err.message}. Using fallback.`);
      createFallbackVideo(imagePath, outputPath)
        .then(resolve)
        .catch(reject);
    });
  });
};

/**
 * Clean up temporary files after video generation
 */
export const cleanupFiles = (filePaths: string[]) => {
  filePaths.forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (error) {
      console.error(`Failed to delete ${filePath}:`, error);
    }
  });
};