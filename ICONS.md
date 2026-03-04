# Icon Font Management

TimelineJS uses [IcoMoon](https://icomoon.io/app) to manage its icon font. This document explains how to update the icon font when you've made changes on the IcoMoon website.

Generally, you would begin at icomoon.io by either restoring an old project from local storage or importing `selection.json` (in `src/css/icons`) to get a baseline. You can then add new icons and download the generated font as a ZIP file.

## Overview

**Icon Font Name:** `tl-icons`
**Icon Class Prefix:** `tl-icon-`
**Icon Font Files Location:** `src/css/icons/`
**Icon CSS/LESS Location:** `src/less/icons/Icons.less`

## Updating Icons from IcoMoon Export

When you export a new icon set from IcoMoon, you'll receive a ZIP file containing:
- `fonts/` directory with font files
- `style.css` with icon class definitions
- `selection.json` (your project file - **keep this safe!**)
- `demo.html` to preview icons

### Step-by-Step Update Process

**IMPORTANT:** When you export from IcoMoon, unicode values for icons may change. You MUST update all unicode values in the CSS, not just add new icons. Use the automated script (see below) to avoid errors.

#### 1. Extract the IcoMoon Download

Extract the downloaded ZIP file to a temporary location (e.g., `~/Downloads/icons-v1.0/`)

#### 2. Run the Automated Update Script (Recommended)

```bash
node tasks/update_icons.js /path/to/icomoon-download
```

This script will automatically:
- Rename font files from `icons.*` to `tl-icons.*`
- Generate WOFF2 format
- Copy font files to the correct location
- Update all unicode values in Icons.less, SlideNav.less, and TimeNav.less
- Update selection.json

Then skip to step 6 (Build and Test).

#### 2. Manual Update Process (Alternative)

If you prefer to update manually, follow steps 3-5 below.

#### 3. Rename Font Files

The icomoon export names files `icons.*` but TimelineJS needs them as `tl-icons.*`.

```bash
cd /path/to/icomoon-download/fonts/

# Rename all font files
mv icons.eot tl-icons.eot
mv icons.svg tl-icons.svg
mv icons.ttf tl-icons.ttf
mv icons.woff tl-icons.woff
```

#### 4. Generate WOFF2 (if not included)

IcoMoon may not include WOFF2 format. Generate it from the TTF file:

**Option A: Using online converter**
- Visit https://cloudconvert.com/ttf-to-woff2
- Upload `tl-icons.ttf`
- Download `tl-icons.woff2`

**Option B: Using fonttools (if installed)**
```bash
pip install fonttools brotli
pyftsubset tl-icons.ttf --output-file=tl-icons.woff2 --flavor=woff2
```

#### 5. Copy Font Files to Project

```bash
# From the icomoon download fonts directory:
cp tl-icons.* /path/to/TimelineJS3/src/css/icons/

# Verify files were copied
ls -lh /path/to/TimelineJS3/src/css/icons/tl-icons.*
```

You should see all 5 files:
- `tl-icons.eot` (~27K)
- `tl-icons.svg` (~76K)
- `tl-icons.ttf` (~26K)
- `tl-icons.woff` (~27K)
- `tl-icons.woff2` (~7K)

#### 6. Update ALL Unicode Values in LESS Files

**CRITICAL:** You must update unicode values for ALL icons, not just new ones. IcoMoon may reassign unicode values when you add or remove icons.

**Files that need updating:**
1. `src/less/icons/Icons.less` - All icon definitions
2. `src/less/slider/TL.SlideNav.less` - Navigation arrows (chevron-right/left)
3. `src/less/timenav/TL.TimeNav.less` - Timeline arrows (arrow-up)

**For Icons.less:**
- Compare every `.tl-icon-*` class with the corresponding `.icon-*` class in IcoMoon's `style.css`
- Update ALL unicode values to match
- For new icons, add new classes following the pattern

**Example from icomoon style.css:**
```css
.icon-tiktok:before {
  content: "\e908";
}
.icon-twitter:before {
  content: "\ea96";
}
```

**Update in Icons.less (change prefix and use :after):**
```less
.tl-icon-tiktok:after {
	content: "\e908";
}
.tl-icon-twitter:after {
	content: "\ea96";  /* Update existing icon unicode! */
}
```

**Important differences:**
- Change `.icon-` prefix to `.tl-icon-`
- Change `:before` to `:after`
- Use tabs for indentation (to match existing style)

**For SlideNav.less and TimeNav.less:**
- Look for any hardcoded unicode values (e.g., `content: "\e64f"`)
- Find the corresponding icon in IcoMoon's style.css
- Update to the new unicode value

#### 7. Build and Test

```bash
npm run build
```

Test in the browser to verify icons display correctly.

#### 8. Backup Your IcoMoon Project

**IMPORTANT:** Copy `selection.json` from the download to `src/css/icons/selection.json` in this repository. This file is required to import your project back into IcoMoon for future edits.

## Automated Update Script

The `tasks/update_icons.js` script automates the entire icon update process, reducing the risk of errors from manual unicode mapping.

**Usage:**
```bash
node tasks/update_icons.js /path/to/icomoon-download
```

**What the script does:**
1. ✓ Validates IcoMoon export structure
2. ✓ Parses all unicode mappings from style.css
3. ✓ Renames font files from `icons.*` to `tl-icons.*`
4. ✓ Generates WOFF2 format (requires fonttools: `pip install fonttools brotli`)
5. ✓ Copies all font files to `src/css/icons/`
6. ✓ Updates ALL unicode values in `Icons.less`
7. ✓ Updates navigation arrows in `SlideNav.less`
8. ✓ Updates timeline arrows in `TimeNav.less`
9. ✓ Copies `selection.json` for future IcoMoon imports
10. ✓ Provides summary of all changes

**Example output:**
```
=== TimelineJS Icon Update Tool ===

→ Checking IcoMoon export structure...
✓ IcoMoon export structure verified
→ Parsing icon unicode mappings from style.css...
✓ Found 125 icon definitions
→ Processing font files...
✓ Copied tl-icons.eot
✓ Copied tl-icons.svg
✓ Copied tl-icons.ttf
✓ Copied tl-icons.woff
→ Generating WOFF2 format...
✓ Generated tl-icons.woff2
✓ Copied selection.json
→ Updating unicode values in Icons.less...
✓ Updated 67 icon definitions in Icons.less
→ Updating unicode values in SlideNav.less...
✓ Updated 2 arrow definitions in SlideNav.less
→ Updating unicode values in TimeNav.less...
✓ Updated 1 arrow definitions in TimeNav.less

=== Update Complete ===

✓ Font files: 5 files copied to src/css/icons/
✓ Icons.less: 67 unicode values updated
✓ SlideNav.less: 2 arrow values updated
✓ TimeNav.less: 1 arrow values updated

Next steps:
  1. Run: npm run build
  2. Test icons in browser
  3. Commit changes if everything looks good
```

## Common Tasks

### Adding a Single New Icon

1. Go to https://icomoon.io/app
2. Click "Import Icons" and upload your `selection.json` from `src/css/icons/`
3. Search for and add the new icon you want
4. Click "Generate Font" → "Download"
5. Extract the downloaded ZIP file
6. Run the automated update script:
   ```bash
   node tasks/update_icons.js ~/Downloads/icons-v1.0
   ```
7. Build and test:
   ```bash
   npm run build
   ```

### Checking Which Icons Are Available

Open `src/css/icons/icons.html` in a browser to see all available icons with their character codes.

Or check `src/less/icons/Icons.less` for the list of `.tl-icon-*` classes.

### Troubleshooting

**Icons showing as placeholder boxes (e.g., "EBUF"):**
- **Most common cause:** Unicode values in LESS files don't match the font files
- Check that ALL unicode values were updated, not just new icons
- Run the automated update script to fix: `node tasks/update_icons.js /path/to/icomoon-download`

**Icons not displaying:**
- Check that all 5 font files were copied correctly
- Verify file permissions (should be readable)
- Check browser console for 404 errors on font files
- Clear browser cache and rebuild
- Verify font files match between src/css/icons/ and dist/css/icons/

**Wrong icon appears:**
- Double-check the unicode value (e.g., `\e908`) matches between icomoon and Icons.less
- Ensure you changed `:before` to `:after`
- Verify you updated ALL icons, not just added new ones

**Font files too large:**
- Consider removing unused icons in IcoMoon to reduce file size
- WOFF2 is the most compressed format (modern browsers)

## File Locations Reference

```
TimelineJS3/
├── tasks/
│   └── update_icons.js           # Automated icon update script
├── src/
│   ├── css/
│   │   └── icons/
│   │       ├── tl-icons.eot      # Font files (5 formats)
│   │       ├── tl-icons.svg
│   │       ├── tl-icons.ttf
│   │       ├── tl-icons.woff
│   │       ├── tl-icons.woff2
│   │       ├── selection.json    # IcoMoon project file
│   │       └── icons.html        # Icon preview (optional)
│   └── less/
│       ├── icons/
│       │   └── Icons.less        # Icon class definitions
│       ├── slider/
│       │   └── TL.SlideNav.less  # Navigation arrow icons
│       └── timenav/
│           └── TL.TimeNav.less   # Timeline arrow icons
```

## Notes

- The `@font-face` declaration is in `Icons.less` and should not need updating
- Icons use the `@{icon-path}` variable which resolves to the correct path during build
- The project uses LESS, not pure CSS, so syntax differences matter
- All icon classes use `:after` pseudo-elements (not `:before` like standard IcoMoon exports)
