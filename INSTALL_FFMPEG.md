# Installing FFmpeg for Audio2Video Application

FFmpeg is required for the Audio2Video application to properly generate videos from images and audio. This guide will help you install FFmpeg on your system.

## Windows Installation

### Method 1: Using Chocolatey (Recommended)

1. Install [Chocolatey](https://chocolatey.org/install) if you don't have it already
2. Open PowerShell as Administrator
3. Run the following command:
   ```
   choco install ffmpeg
   ```
4. Verify installation by opening a new PowerShell window and running:
   ```
   ffmpeg -version
   ```

### Method 2: Manual Installation

1. Download the latest FFmpeg build from [FFmpeg.org](https://ffmpeg.org/download.html#build-windows) or [gyan.dev](https://www.gyan.dev/ffmpeg/builds/)
2. Extract the ZIP file to a location on your computer (e.g., `C:\ffmpeg`)
3. Add FFmpeg to your PATH:
   - Right-click on "This PC" or "My Computer" and select "Properties"
   - Click on "Advanced system settings"
   - Click on "Environment Variables"
   - Under "System variables", find the "Path" variable, select it and click "Edit"
   - Click "New" and add the path to the FFmpeg `bin` folder (e.g., `C:\ffmpeg\bin`)
   - Click "OK" on all dialogs to save the changes
4. Verify installation by opening a new Command Prompt or PowerShell window and running:
   ```
   ffmpeg -version
   ```

## Mac Installation

```
brew install ffmpeg
```

## Linux Installation

### Ubuntu/Debian:
```
sudo apt update
sudo apt install ffmpeg
```

### CentOS/RHEL:
```
sudo yum install epel-release
sudo yum install ffmpeg ffmpeg-devel
```

## Verifying Installation

After installation, verify that FFmpeg is correctly installed by running:
```
ffmpeg -version
```

You should see version information for FFmpeg. If you see an error message, make sure FFmpeg is properly installed and added to your system PATH.

## Troubleshooting

If you encounter issues with FFmpeg:

1. Make sure FFmpeg is in your system PATH
2. Try restarting your computer after installation
3. If using the application in development mode, restart the development server after installing FFmpeg
