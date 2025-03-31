# Windows Icon Troubleshooting Guide

If your Windows application is not showing the correct icon, you can try the following steps to fix it.

## Fixing Windows Icon Issues

### Option 1: Run the Fix Script

The `fix-win-icon.js` script can be used to fix the icon after the build process:

```bash
# Navigate to the electron directory
cd electron

# Install dependencies if you haven't already
pnpm install

# Run the fix script
pnpm fix-win-icon
```

### Option 2: Clear the Windows Icon Cache

Windows maintains an icon cache, which might prevent your icon changes from being visible immediately. To clear the icon cache:

1. Press `Win + R` to open the Run dialog
2. Type `ie4uinit.exe -ClearIconCache` and press Enter
3. Alternatively, type `ie4uinit.exe -show` and press Enter

You might need to restart Windows Explorer or reboot your computer for the changes to take effect.

### Option 3: Rebuild with Custom Icon Path

Try specifying a different location for the icon file:

1. Copy your icon file to the root of your app directory
2. Update the `electron-builder` configuration in `package.json` to use this icon path
3. Rebuild the application

```json
"build": {
  "win": {
    "icon": "./my-custom-icon.ico"
  }
}
```

### Option 4: Verify Icon Format

Windows icons require specific formats:

1. Make sure your `.ico` file includes multiple resolutions (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
2. Use the `create-win-icon.js` script to generate a properly formatted icon file:

```bash
node scripts/create-win-icon.js
```

### Option 5: Manual Resource Editing

You can directly edit the executable's resources using `rcedit` after the build process:

```bash
npx rcedit "path/to/your/app.exe" --set-icon "path/to/your/icon.ico"
```

Replace the paths with the actual paths to your application's executable and icon file.

## Troubleshooting Steps

If you're still having issues with the icon:

1. Check the build logs for any errors related to icon processing
2. Make sure the icon file exists in the specified location before building
3. Try using a simpler icon file with fewer colors
4. Ensure all icon sizes are square (width equals height)
5. Verify that the icon file is not corrupted by opening it in an image editor

## Technical Details

Windows applications use resources embedded in the `.exe` file to store icons. There are a few requirements for Windows icons:

- Windows requires icons in the `.ico` format
- The `.ico` file should contain multiple image sizes (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
- Icons should have both 32-bit (RGBA) and 8-bit versions for backward compatibility
- For proper display in Windows Explorer, File Explorer, taskbar, and desktop, all sizes should be included