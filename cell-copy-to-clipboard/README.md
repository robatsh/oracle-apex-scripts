# Apex Cell Copy to Clipboard

This JavaScript snippet enables users to copy the content of form fields or text elements within an Oracle APEX page by pressing **Ctrl** and clicking on the element.

## What it does

- Listens for **Ctrl + Click** events inside the main page body (`.t-Body`).
- Copies the value from inputs, textareas, labels (linked to inputs), or other text containers to the clipboard.
- Excludes navigation menus and script tags to avoid unintended behavior.
- Shows a small “Copied!” confirmation popup near the mouse pointer.
- Uses the modern Clipboard API when available; falls back to legacy `execCommand('copy')` otherwise.
- Only triggers when **Ctrl** is pressed alone (no Alt, Shift, or Meta keys).

## How to use

1. Include the `apex-cell-copy-to-clipboard.js` file in your Oracle APEX page JavaScript (e.g., in the Function and Global Variable Declaration section or as a Dynamic Action).
2. On the page, hold down **Ctrl** and click on any form field or text element to copy its content to the clipboard instantly.

## Why use this script?

This script improves user experience by providing a quick and easy way to copy values from the page without selecting text manually or using context menus, especially useful for Oracle APEX applications with complex forms.

## License

MIT License
