# Naver Blog HTML Structure Analysis

## 1. Overview
- **Source URL**: `https://section.blog.naver.com/`
- **Total HTML Length**: ~390KB
- **Session State**: Logged in (User: `kmg9463`)

## 2. Structural Elements

### Formatting & Typography
Naver Blog uses specific semantic tags for styling:
- **Bold/Strong**: `<strong>` (120 occurrences) - Used for Headers (`.title`, `.title_post`) and emphasized text.
- **Icons**: `<i>` (344 occurrences) - Heavily used for sprite icons (e.g., `.sp_common`, `.icon_arrow`).
- **Emphasis**: `<em>` (66 occurrences) - Often used for counts (`.gnb_ico_num`) or auxiliary text.
- **Obsolete Tags**: No `<b>`, `<u>`, `mark` tags found.

### Key Layout Sections
- **Header**: `<header id="header">` containing GNB (Global Navigation Bar).
- **Main Content**: `<main id="container" class="container">`.
- **Hot Topics**: `<section class="hot_topic">` containing list groups.

### Common Components (Class Analysis)
Top classes indicate a heavy use of:
1.  **Lists**: `item` (150), `ul` (98), `li` (514).
2.  **Icons**: `sp_common` (149), `icon_video_play` (43).
3.  **Interaction**: `button` (104), `_button` (120), `u_likeit_list` (120).
4.  **Accessibility**: `blind` (41) class used for screen reader text.

## 3. Selector Strategies
For scraping or automation, use these robust selectors:
- **Post Titles**: `strong.title_post`
- **Post Summaries**: `p.text_post`
- **Author Nicknames**: `span.nickname`
- **Images**: `img` with `bg-image` attribute (lazy loading detected).

## 4. Naver Smart Editor (Automation Selectors)
The editor is hosted within an iframe.
- **Iframe Identifier**: `#mainFrame`
- **Title Input**: `.se-documentTitle .se-module-text`
- **Content Area**: `.se-content`
- **Bold Toolbar Button**: `button.se-bold-toolbar-button` (data-name="bold")
- **Italic Toolbar Button**: `button.se-italic-toolbar-button` (data-name="italic")
- **Publish Button**: `button.publish_btn__m9KHH` (data-click-area="tpb.publish")

## 5. Functional Experimentation Results
- **Typing**: Successfully used `frame.type` on `.se-title-text` (Title) and `.se-content` (Body).
- **Formatting**: Verified that clicking `button.se-bold-toolbar-button` toggles the bold state.
- **Publish Layer**: The publish button opens a settings layer with the following components:
  - **Category**: Selectable dropdown (detected as part of `publish_layer`).
  - **Tags**: Input area for hashtags.
  - **Visibility**: Radio buttons for Public/Private/Buddy-only.
  - **Final Button**: A green "발행" button at the bottom of the column.

## 6. Automation Status: READY
The Naver Blog Smart Editor One is fully automatable using the following strategy:
1. **Navigate**: Use `blog.naver.com` and click the "Write" button.
2. **Iframe Context**: All operations must target the `#mainFrame` iframe.
3. **Interactions**: Use `click-iframe` to focus and `type-iframe` or `keyboardType` (when focused) to input content.
4. **Publishing**: Click the main publish button, fill in tags/category in the layer, and click the final publish button.

## 7. Files Created
- `index.html`: Raw captured Naver Blog Home HTML.
- `editor_iframe.html`: Raw captured Smart Editor internal HTML.
- `analyze_structure.js`: Node.js script for general analysis.
- `analyze_editor.js`: Node.js script for Smart Editor analysis.
