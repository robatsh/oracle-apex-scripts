# Oracle Forms Cell Duplication Function for APEX Interactive Grid

This JavaScript snippet imitates the "cell duplication" function from Oracle Forms within an Oracle APEX Interactive Grid.  
It enables pressing the **F3** key (without modifiers) to copy the value from the cell directly above into the currently active cell.

---

## Features

- Works inside Oracle APEX Interactive Grid.
- Copies cell values from the row above to the current cell.
- Safely handles cases when the model does not contain a value by falling back to the DOM content.
- Prevents the default browser F3 behavior (search).
- Logs detailed debug information in the browser console.

---

## How to use

1. Include this JavaScript snippet in your Oracle APEX page's **Function and Global Variable Declaration** or as a Dynamic Action (JavaScript code).
2. Ensure jQuery is available (APEX usually includes it by default).
3. Activate a cell inside the Interactive Grid and press **F3** to copy the value from the cell above.

---

## Notes

- This script only listens for F3 without any Ctrl, Alt, or Shift modifiers.
- The code does **not modify the grid's structure** and works purely with the APEX Interactive Grid API and DOM.
- The script is designed for Oracle APEX Interactive Grid with classic grid view and standard CSS classes.

---

## License

This script is provided as-is under the MIT License. Feel free to adapt and extend it to your needs.

---

## Author

LWL3BN
https://github.com/robatsh 
