#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const packageJsonPath = path.join(__dirname, 'package.json');
const serverConstantsPath = path.join(__dirname, '..', 'server', 'constants.ts');

// Helper function to increment version
function incrementPatchVersion(version) {
    const parts = version.split('.');
    if (parts.length !== 3) {
        throw new Error(`Invalid version format: ${version}`);
    }

    // Increment the patch version (third number)
    parts[2] = (parseInt(parts[2], 10) + 1).toString();
    return parts.join('.');
}

// Update package.json
function updatePackageJson() {
    console.log(`Reading ${packageJsonPath}...`);
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    const newVersion = incrementPatchVersion(currentVersion);

    console.log(`Updating version from ${currentVersion} to ${newVersion}`);
    packageJson.version = newVersion;

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
    console.log(`Updated package.json version to ${newVersion}`);

    return newVersion;
}

// Update server constants.ts
function updateServerConstants(newVersion) {
    console.log(`Reading ${serverConstantsPath}...`);
    let constantsContent = fs.readFileSync(serverConstantsPath, 'utf8');

    // Find and replace version
    const versionRegex = /(export\s+const\s+VERSION\s*=\s*["'])([^"']+)(["'])/;
    if (!versionRegex.test(constantsContent)) {
        throw new Error('Could not find VERSION constant in constants.ts');
    }

    const currentVersion = constantsContent.match(versionRegex)[2];
    console.log(`Found version ${currentVersion} in constants.ts`);

    constantsContent = constantsContent.replace(
        versionRegex,
        `$1${newVersion}$3`
    );

    fs.writeFileSync(serverConstantsPath, constantsContent);
    console.log(`Updated constants.ts version to ${newVersion}`);
}

try {
    const newVersion = updatePackageJson();
    updateServerConstants(newVersion);
    console.log('Version bump complete!');
} catch (error) {
    console.error('Error bumping version:', error.message);
    process.exit(1);
} 