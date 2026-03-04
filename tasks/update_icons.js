#!/usr/bin/env node

/**
 * Update Icon Font from IcoMoon Export
 *
 * This script automates the process of updating TimelineJS icons from an IcoMoon export.
 * It handles font file renaming, WOFF2 generation, unicode mapping updates, and file copying.
 *
 * Usage:
 *   node tasks/update_icons.js /path/to/icomoon-download
 *   node tasks/update_icons.js ~/Downloads/icons-v1.0
 *
 * The script will:
 * 1. Rename font files from icons.* to tl-icons.*
 * 2. Generate WOFF2 format
 * 3. Copy font files to src/css/icons/
 * 4. Update all unicode values in Icons.less, SlideNav.less, and TimeNav.less
 * 5. Copy selection.json to src/css/icons/
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.join(__dirname, '..');
const ICONS_DIR = path.join(PROJECT_ROOT, 'src/css/icons');
const LESS_DIR = path.join(PROJECT_ROOT, 'src/less');

// Color output helpers
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
};

function log(message, color = '') {
    console.log(color + message + colors.reset);
}

function error(message) {
    log('ERROR: ' + message, colors.red);
    process.exit(1);
}

function success(message) {
    log('✓ ' + message, colors.green);
}

function info(message) {
    log('→ ' + message, colors.blue);
}

function warn(message) {
    log('⚠ ' + message, colors.yellow);
}

// Parse command line arguments
const icomoonPath = process.argv[2];

if (!icomoonPath || icomoonPath === '--help' || icomoonPath === '-h') {
    console.log('Usage: node tasks/update_icons.js /path/to/icomoon-download');
    console.log('');
    console.log('Example:');
    console.log('  node tasks/update_icons.js ~/Downloads/icons-v1.0');
    console.log('');
    process.exit(icomoonPath ? 0 : 1);
}

const absolutePath = path.resolve(icomoonPath);

if (!fs.existsSync(absolutePath)) {
    error(`Directory not found: ${absolutePath}`);
}

log('\n' + colors.bright + '=== TimelineJS Icon Update Tool ===' + colors.reset + '\n');

// Step 1: Verify required files exist
info('Checking IcoMoon export structure...');

const fontsDir = path.join(absolutePath, 'fonts');
const styleCss = path.join(absolutePath, 'style.css');
const selectionJson = path.join(absolutePath, 'selection.json');

if (!fs.existsSync(fontsDir)) {
    error('fonts/ directory not found. Make sure you extracted the IcoMoon ZIP file.');
}

if (!fs.existsSync(styleCss)) {
    error('style.css not found. Make sure you extracted the complete IcoMoon export.');
}

if (!fs.existsSync(selectionJson)) {
    warn('selection.json not found. This file is needed to re-import the project into IcoMoon.');
}

success('IcoMoon export structure verified');

// Step 2: Parse style.css to extract unicode mappings
info('Parsing icon unicode mappings from style.css...');

const styleCssContent = fs.readFileSync(styleCss, 'utf8');
const unicodeMappings = {};

// Match patterns like: .icon-name:before { content: "\e908"; }
const iconRegex = /\.icon-([a-z0-9_-]+):before\s*\{[^}]*content:\s*"\\([^"]+)"/gi;
let match;

while ((match = iconRegex.exec(styleCssContent)) !== null) {
    const iconName = match[1];
    const unicode = match[2];
    unicodeMappings[iconName] = unicode;
}

const iconCount = Object.keys(unicodeMappings).length;
success(`Found ${iconCount} icon definitions`);

if (iconCount === 0) {
    error('No icon definitions found in style.css');
}

// Step 3: Copy and rename font files
info('Processing font files...');

const fontExtensions = ['eot', 'svg', 'ttf', 'woff'];
let copiedFiles = [];

for (const ext of fontExtensions) {
    const srcFile = path.join(fontsDir, `icons.${ext}`);
    const destFile = path.join(ICONS_DIR, `tl-icons.${ext}`);

    if (fs.existsSync(srcFile)) {
        fs.copyFileSync(srcFile, destFile);
        copiedFiles.push(`tl-icons.${ext}`);
        success(`Copied tl-icons.${ext}`);
    } else {
        warn(`icons.${ext} not found - skipping`);
    }
}

// Step 4: Generate WOFF2
info('Generating WOFF2 format...');

const ttfFile = path.join(ICONS_DIR, 'tl-icons.ttf');
const woff2File = path.join(ICONS_DIR, 'tl-icons.woff2');

if (fs.existsSync(ttfFile)) {
    try {
        execSync(`pyftsubset "${ttfFile}" --output-file="${woff2File}" --flavor=woff2 --unicodes='*'`, {
            stdio: 'pipe'
        });
        success('Generated tl-icons.woff2');
        copiedFiles.push('tl-icons.woff2');
    } catch (err) {
        warn('Could not generate WOFF2. Install fonttools with: pip install fonttools brotli');
        warn('Or generate manually after running this script.');
    }
} else {
    warn('tl-icons.ttf not found - cannot generate WOFF2');
}

// Step 5: Copy selection.json
if (fs.existsSync(selectionJson)) {
    fs.copyFileSync(selectionJson, path.join(ICONS_DIR, 'selection.json'));
    success('Copied selection.json');
}

// Step 6: Update Icons.less
info('Updating unicode values in Icons.less...');

const iconsLessFile = path.join(LESS_DIR, 'icons/Icons.less');
let iconsLessContent = fs.readFileSync(iconsLessFile, 'utf8');

let updatedCount = 0;

// Update existing icons
for (const [iconName, unicode] of Object.entries(unicodeMappings)) {
    const tlIconName = iconName; // IcoMoon name maps directly

    // Create regex to match the icon definition
    // Match: .tl-icon-NAME:after { content: "\eXXXX"; }
    const regex = new RegExp(
        `(\\.tl-icon-${tlIconName.replace(/[-]/g, '\\-')}:after\\s*\\{\\s*content:\\s*)"\\\\[^"]+";`,
        'g'
    );

    if (regex.test(iconsLessContent)) {
        iconsLessContent = iconsLessContent.replace(
            new RegExp(
                `(\\.tl-icon-${tlIconName.replace(/[-]/g, '\\-')}:after\\s*\\{\\s*content:\\s*)"\\\\[^"]+";`,
                'g'
            ),
            `$1"\\${unicode}";`
        );
        updatedCount++;
    }
}

// Special mappings for navigation arrows
const specialMappings = [
    { name: 'chevron-right', icomoonName: 'keyboard_arrow_right' },
    { name: 'chevron-left', icomoonName: 'keyboard_arrow_left' },
    { name: 'goback', icomoonName: 'keyboard_arrow_left' },
    { name: 'goend', icomoonName: 'keyboard_arrow_right' },
    { name: 'prev2', icomoonName: 'keyboard_arrow_left' },
    { name: 'next2', icomoonName: 'keyboard_arrow_right' },
    { name: 'swipe-left', icomoonName: 'keyboard_arrow_left' },
    { name: 'swipe-right', icomoonName: 'keyboard_arrow_right' },
    { name: 'arrow-up', icomoonName: 'circle_up' },
    { name: 'arrow-down', icomoonName: 'circle_down' },
    { name: 'arrow-left', icomoonName: 'circle_left' },
    { name: 'arrow-right', icomoonName: 'circle_right' }
];

for (const mapping of specialMappings) {
    const icomoonName = mapping.icomoonName.replace(/_/g, '_');
    if (unicodeMappings[icomoonName]) {
        const regex = new RegExp(
            `(\\.tl-icon-${mapping.name.replace(/[-]/g, '\\-')}:after\\s*\\{\\s*content:\\s*)"\\\\[^"]+";`,
            'g'
        );

        if (regex.test(iconsLessContent)) {
            iconsLessContent = iconsLessContent.replace(
                new RegExp(
                    `(\\.tl-icon-${mapping.name.replace(/[-]/g, '\\-')}:after\\s*\\{\\s*content:\\s*)"\\\\[^"]+";`,
                    'g'
                ),
                `$1"\\${unicodeMappings[icomoonName]}";`
            );
            updatedCount++;
        }
    }
}

fs.writeFileSync(iconsLessFile, iconsLessContent, 'utf8');
success(`Updated ${updatedCount} icon definitions in Icons.less`);

// Step 7: Update SlideNav.less
info('Updating unicode values in SlideNav.less...');

const slideNavFile = path.join(LESS_DIR, 'slider/TL.SlideNav.less');
let slideNavContent = fs.readFileSync(slideNavFile, 'utf8');
let slideNavUpdates = 0;

if (unicodeMappings['keyboard_arrow_right']) {
    slideNavContent = slideNavContent.replace(
        /(\.tl-slidenav-next[^}]*\.tl-slidenav-icon:before\s*\{[^}]*content:\s*)"\\[^"]+";/,
        `$1"\\${unicodeMappings['keyboard_arrow_right']}";`
    );
    slideNavUpdates++;
}

if (unicodeMappings['keyboard_arrow_left']) {
    slideNavContent = slideNavContent.replace(
        /(\.tl-slidenav-previous[^}]*\.tl-slidenav-icon:before\s*\{[^}]*content:\s*)"\\[^"]+";/,
        `$1"\\${unicodeMappings['keyboard_arrow_left']}";`
    );
    slideNavUpdates++;
}

fs.writeFileSync(slideNavFile, slideNavContent, 'utf8');
success(`Updated ${slideNavUpdates} arrow definitions in SlideNav.less`);

// Step 8: Update TimeNav.less
info('Updating unicode values in TimeNav.less...');

const timeNavFile = path.join(LESS_DIR, 'timenav/TL.TimeNav.less');
let timeNavContent = fs.readFileSync(timeNavFile, 'utf8');
let timeNavUpdates = 0;

if (unicodeMappings['circle_up']) {
    timeNavContent = timeNavContent.replace(
        /(&:after\s*\{[^}]*content:\s*)"\\[^"]+";/,
        `$1"\\${unicodeMappings['circle_up']}";`
    );
    timeNavUpdates++;
}

fs.writeFileSync(timeNavFile, timeNavContent, 'utf8');
success(`Updated ${timeNavUpdates} arrow definitions in TimeNav.less`);

// Summary
log('\n' + colors.bright + '=== Update Complete ===' + colors.reset + '\n');

success(`Font files: ${copiedFiles.length} files copied to src/css/icons/`);
success(`Icons.less: ${updatedCount} unicode values updated`);
success(`SlideNav.less: ${slideNavUpdates} arrow values updated`);
success(`TimeNav.less: ${timeNavUpdates} arrow values updated`);

log('\n' + colors.yellow + 'Next steps:' + colors.reset);
log('  1. Run: npm run build');
log('  2. Test icons in browser');
log('  3. Commit changes if everything looks good');
log('');
