---
name: vision
description: Advanced computer vision and image processing. capable of OCR (reading text), annotation (drawing boxes), and cropping screenshots.
---

# Vision Capability

This skill allows agents to programmatically manipulate and analyze images. It is designed to be used in conjunction with the **Browsing Skill** for visual verification and debugging.

## Features

- **Annotation**: Draw bounding boxes and add text memos to images (useful for "visual debugging" or creating report screenshots).
- **Processing**: Crop images to specific regions (useful for focusing on a specific element).
- **Analysis**: Read text from images using OCR (useful for CAPTCHAs or non-DOM text).

## Installation

```bash
# In your skill's package.json
"dependencies": {
  "@agent/vision": "file:../../capabilities/vision"
}
```

## Usage (TypeScript)

Import the functions directly from the package.

```typescript
import { drawBox, addMemo, crop, analyzeText } from '@agent/vision';

(async () => {
    const input = 'screenshot.png';
    const output = 'annotated.png';

    // 1. Draw a Red Box around an element (e.g., a button)
    await drawBox(input, output, { left: 100, top: 100, width: 200, height: 50 }, 'red');

    // 2. Add a Memo ("Failed Here")
    await addMemo(output, output, 'Verification Failed Check', 'top-left');

    // 3. Crop a specific region
    await crop(input, 'cropped.png', { left: 0, top: 0, width: 500, height: 500 });

    // 4. Read Text (OCR)
    const text = await analyzeText('cropped.png');
    console.log('Extracted Text:', text);
})();
```

## API Reference

### `annotation.ts`

#### `drawBox(input, output, rect, color?)`
- `rect`: `{ left: number, top: number, width: number, height: number }`
- `color`: CSS color string (default: 'red').

#### `addMemo(input, output, text, position?)`
- `position`: 'top-left' | 'bottom-right' (default: 'top-left').

### `processing.ts`

#### `crop(input, output, rect)`
- Extracts the specified rectangle area.

#### `analyzeText(input)`
- Returns: `Promise<string>` (The extracted text).
