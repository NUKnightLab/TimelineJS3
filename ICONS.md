# Icon Font Management

TimelineJS uses [IcoMoon](https://icomoon.io/app) to manage its icon font. This document explains how to update the icon font when you've made changes on the IcoMoon website.

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

#### 1. Extract the IcoMoon Download

Extract the downloaded ZIP file to a temporary location (e.g., `~/Downloads/icons-v1.0/`)

#### 2. Rename Font Files

The icomoon export names files `icons.*` but TimelineJS needs them as `tl-icons.*`.

```bash
cd /path/to/icomoon-download/fonts/

# Rename all font files
mv icons.eot tl-icons.eot
mv icons.svg tl-icons.svg
mv icons.ttf tl-icons.ttf
mv icons.woff tl-icons.woff
```

#### 3. Generate WOFF2 (if not included)

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

#### 4. Copy Font Files to Project

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

#### 5. Update Icons.less

Open `src/less/icons/Icons.less` and add CSS classes for any new icons.

For each new icon in the icomoon `style.css` file, add a corresponding class:

**Example from icomoon style.css:**
```css
.icon-tiktok:before {
  content: "\e908";
}
```

**Add to Icons.less (change prefix and use :after):**
```less
.tl-icon-tiktok:after {
	content: "\e908";
}
```

**Important differences:**
- Change `.icon-` prefix to `.tl-icon-`
- Change `:before` to `:after`
- Use tabs for indentation (to match existing style)

#### 6. Build and Test

```bash
npm run build
```

Test in the browser to verify icons display correctly.

#### 7. Backup Your IcoMoon Project

**IMPORTANT:** Copy `selection.json` from the download to `src/css/icons/selection.json` in this repository. This file is required to import your project back into IcoMoon for future edits.

## Common Tasks

### Adding a Single New Icon

1. Go to https://icomoon.io/app
2. Click "Import Icons" and upload your `selection.json`
3. Search for and add the new icon you want
4. Click "Generate Font" → "Download"
5. Follow the update process above

### Checking Which Icons Are Available

Open `src/css/icons/icons.html` in a browser to see all available icons with their character codes.

Or check `src/less/icons/Icons.less` for the list of `.tl-icon-*` classes.

### Troubleshooting

**Icons not displaying:**
- Check that all 5 font files were copied correctly
- Verify file permissions (should be readable)
- Check browser console for 404 errors on font files
- Clear browser cache and rebuild

**Wrong icon appears:**
- Double-check the unicode value (e.g., `\e908`) matches between icomoon and Icons.less
- Ensure you changed `:before` to `:after`

**Font files too large:**
- Consider removing unused icons in IcoMoon to reduce file size
- WOFF2 is the most compressed format (modern browsers)

## File Locations Reference

```
TimelineJS3/
├── src/
│   ├── css/
│   │   └── icons/
│   │       ├── tl-icons.eot      # Font files (5 formats)
│   │       ├── tl-icons.svg
│   │       ├── tl-icons.ttf
│   │       ├── tl-icons.woff
│   │       ├── tl-icons.woff2
│   │       └── selection.json                 # IcoMoon project file
│   │       └── icons.html        # Icon preview (optional)
│   └── less/
│       └── icons/
│           └── Icons.less         # Icon class definitions
```

## Notes

- The `@font-face` declaration is in `Icons.less` and should not need updating
- Icons use the `@{icon-path}` variable which resolves to the correct path during build
- The project uses LESS, not pure CSS, so syntax differences matter
- All icon classes use `:after` pseudo-elements (not `:before` like standard IcoMoon exports)
