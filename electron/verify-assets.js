const fs = require('fs');
const path = require('path');
const { app } = require('electron');

/**
 * Verifies that all required assets are present in the packaged application
 * @returns {Object} Results of the verification
 */
function verifyAssets() {
    const results = {
        success: true,
        errors: [],
        paths: {
            checked: [],
            found: [],
            missing: []
        }
    };

    // Paths to check for assets
    const assetDirectories = [
        // For packaged app
        path.join(process.resourcesPath, 'client/public'),
        path.join(process.resourcesPath, 'app/client/public'),
        path.join(app.getAppPath(), 'client/public'),
        // **NEW** – assets inside the Vite build
        path.join(process.resourcesPath, 'client/dist'),
        path.join(process.resourcesPath, 'app/client/dist'),
        path.join(app.getAppPath(), 'client/dist'),

        // For development
        path.join(__dirname, '../client/public'),
        path.join(__dirname, '../client/dist')
    ];

    // Log which paths we're checking
    console.log('Checking the following paths for assets:');
    assetDirectories.forEach(dir => {
        results.paths.checked.push(dir);
        console.log(` - ${dir}`);
    });

    // Check each path
    let assetsFound = false;
    for (const dir of assetDirectories) {
        try {
            if (fs.existsSync(dir)) {
                results.paths.found.push(dir);
                console.log(`Assets directory found: ${dir}`);

                // Check for images subdirectory
                const imagesDir = path.join(dir, 'images');
                if (fs.existsSync(imagesDir)) {
                    console.log(`Images directory found: ${imagesDir}`);

                    // Check title images directory
                    const titleImagesDir = path.join(imagesDir, 'title-images');
                    if (fs.existsSync(titleImagesDir)) {
                        console.log(`Title images directory found: ${titleImagesDir}`);

                        // Count PNG files
                        const files = fs.readdirSync(titleImagesDir).filter(f => f.endsWith('.png'));
                        console.log(`Found ${files.length} title image(s) in ${titleImagesDir}`);

                        if (files.length > 0) {
                            assetsFound = true;
                        }
                    } else {
                        console.log(`Title images directory NOT found at: ${titleImagesDir}`);
                        results.errors.push(`Title images directory missing: ${titleImagesDir}`);
                    }
                } else {
                    console.log(`Images directory NOT found at: ${imagesDir}`);
                    results.errors.push(`Images directory missing: ${imagesDir}`);
                }
            } else {
                results.paths.missing.push(dir);
            }
        } catch (err) {
            console.error(`Error checking path ${dir}:`, err);
            results.errors.push(`Error checking ${dir}: ${err.message}`);
        }
    }

    if (!assetsFound) {
        results.success = false;
        results.errors.push('No asset directories containing title images were found');
    }

    return results;
}

// Export the function for use in main.js
module.exports = { verifyAssets };

// If run directly, execute and print results
if (require.main === module) {
    const results = verifyAssets();
    console.log('\nVerification results:', JSON.stringify(results, null, 2));

    if (!results.success) {
        console.error('\nAsset verification failed!');
        console.error('Errors:');
        results.errors.forEach(err => console.error(` - ${err}`));
    } else {
        console.log('\nAsset verification successful!');
    }
} 