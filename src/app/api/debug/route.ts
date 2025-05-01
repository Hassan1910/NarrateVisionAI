import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Get information about the environment
    const cwd = process.cwd();
    const publicDir = path.join(cwd, 'public');
    const mediaDir = path.join(publicDir, 'media');
    
    // Check if directories exist
    const publicExists = fs.existsSync(publicDir);
    const mediaExists = fs.existsSync(mediaDir);
    
    // List directories in public folder
    let publicDirs = [];
    if (publicExists) {
      publicDirs = fs.readdirSync(publicDir).filter(item => {
        const itemPath = path.join(publicDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
    }
    
    // List directories in media folder
    let mediaDirs = [];
    if (mediaExists) {
      mediaDirs = fs.readdirSync(mediaDir).filter(item => {
        const itemPath = path.join(mediaDir, item);
        return fs.statSync(itemPath).isDirectory();
      });
    }
    
    // Create directories if they don't exist
    const dirs = [
      path.join(publicDir, 'media'),
      path.join(publicDir, 'media', 'images'),
      path.join(publicDir, 'media', 'audio'),
      path.join(publicDir, 'media', 'videos')
    ];
    
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
    
    return NextResponse.json({
      success: true,
      environment: {
        cwd,
        publicDir,
        mediaDir,
        publicExists,
        mediaExists,
        publicDirs,
        mediaDirs,
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform
      },
      message: 'Debug information retrieved successfully'
    });
  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}
