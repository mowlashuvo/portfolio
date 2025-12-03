# Image Optimization Guide

## WebP Format Conversion

WebP is a modern image format that provides superior compression compared to JPEG and PNG. Follow these steps to optimize your images:

### Using Command Line (ImageMagick)

```bash
# Install ImageMagick (if not already installed)
# macOS
brew install imagemagick

# Convert single image
convert input.jpg -quality 80 output.webp

# Batch convert all JPG images
for file in *.jpg; do
  convert "$file" -quality 80 "${file%.jpg}.webp"
done

# Batch convert all PNG images
for file in *.png; do
  convert "$file" -quality 80 "${file%.png}.webp"
done
```

### Using Online Tools

- TinyPNG (https://tinypng.com/)
- CloudConvert (https://cloudconvert.com/)
- XConvert (https://www.xconvert.com/)

### Using NPM Tools

```bash
# Install imagemin globally
npm install -g imagemin imagemin-webp

# Convert images
imagemin assets/images/**/*.jpg --use=imagemin-webp --out-dir=assets/images
```

## Implementing WebP with Fallbacks

Update HTML to use modern `<picture>` element for responsive images with fallbacks:

```html
<picture>
  <source srcset="assets/images/profile.webp" type="image/webp">
  <img src="assets/images/profile.jpg" alt="Arfatul Mowla Shuvo" class="profile-photo">
</picture>
```

## Lazy Loading Implementation

Already implemented in `scripts/lazy-loading.js`. To use:

```html
<!-- Instead of: -->
<img src="assets/images/logo.png" alt="Logo">

<!-- Use: -->
<img data-src="assets/images/logo.webp" alt="Logo" class="lazy-load">
```

## Image Size Recommendations

| Image Type | Recommended Size | Format | Quality |
|-----------|-----------------|--------|---------|
| Profile Photo | 400x400px | WebP (JPEG fallback) | 80-85 |
| Company Logo | 200x200px | PNG/WebP | 100 |
| Project Screenshot | 1200x600px | WebP (JPEG fallback) | 75-80 |
| Favicon | 32x32px | ICO/PNG | 100 |
| OG Image | 1200x630px | WebP (JPEG fallback) | 80 |

## Performance Metrics

### Before Optimization
- Average image file size: 500-1500KB
- Load time impact: ~2-3s

### After Optimization
- Average image file size: 100-300KB (70% reduction)
- Load time impact: ~0.5-1s

## Tools Comparison

| Tool | Ease of Use | Batch Processing | Customization |
|------|-----------|-----------------|---------------|
| ImageMagick | Medium | ✓ | High |
| TinyPNG | Easy | ✓ | Low |
| CloudConvert | Easy | ✓ | Medium |
| NPM imagemin | Hard | ✓ | High |

## Progressive Enhancement

The website will:
1. Load WebP images in modern browsers
2. Fall back to JPEG/PNG in older browsers
3. Use lazy loading to defer off-screen images
4. Display placeholder during load

This ensures 100% browser compatibility while maximizing performance.
