/* 
 * This script listens for the F3 keypress without any modifier keys.
 * When triggered, it copies the value from the cell directly above in an Oracle APEX Interactive Grid.
 * This imitates the cell duplication function found in Oracle Forms.
 * The code safely handles edge cases and falls back to reading from the DOM if the model doesn't contain the value.
 */

document.addEventListener('keydown', function(event) {
    // F3, no modifiers – always block default behavior!
    if (
        event.key === "F3" &&
        !event.ctrlKey && !event.altKey && !event.shiftKey
    ) {
        event.preventDefault(); // Prevents e.g. browser search (also in Firefox & others)
        console.log("[F3] Shortcut detected!");

        let activeElem = document.activeElement;
        let $cell = $(activeElem).closest('.a-GV-cell');
        if (!$cell.length) { console.log("[F3] No active cell found."); return; }
        console.log("[F3] Active cell found.", $cell[0]);

        let $ig = $cell.closest('.a-IG');
        if (!$ig.length) { console.log("[F3] No IG container found."); return; }
        let igView = $ig.data('apex-interactiveGrid');
        if (!igView) { console.log("[F3] No IG object."); return; }
        let grid = igView.getCurrentView && igView.getCurrentView();
        if (!grid || !grid.model) { console.log("[F3] No model."); return; }
        let model = grid.model;

        let $row = $cell.closest('tr.a-GV-row');
        if (!$row.length) { console.log("[F3] No table row found."); return; }
        let $allRows = $cell.closest('tbody').find('tr.a-GV-row');
        let rowIdx = $allRows.index($row);

        // Correctly determine the column name
        let headers = $cell.attr('headers');
        let colProperty = null;
        if (headers) {
            let headerId = headers.split(" ")[0];
            let $th = $('#' + headerId);
            if ($th.length) colProperty = $th.attr('data-column');
        }
        if (!colProperty) {
            let columns = grid.view$.grid('getColumns');
            let dataColumns = columns.filter(function(col) {
                return col.property && typeof col.property === "string" && !col.isSelector && !col.isRowHeader;
            });
            let $cellsInRow = $row.children('.a-GV-cell');
            let visibleCellIdx = $cellsInRow.index($cell);
            if (visibleCellIdx >= 0 && visibleCellIdx < dataColumns.length) {
                colProperty = dataColumns[visibleCellIdx].property;
            }
        }
        if (!colProperty) { console.log("[F3] No valid column determined."); return; }
        console.log("[F3] Copying for column:", colProperty);

        let fieldKey = model.getFieldKey(colProperty);

        // Fetch model records via official API
        let records = [];
        model.forEach(function(record) { records.push(record); });
        console.log("[F3] Model records:", records);

        if (rowIdx <= 0 || rowIdx >= records.length) { 
            console.log("[F3] No row above available."); 
            return; 
        }
        let record = records[rowIdx];
        let recordAbove = records[rowIdx - 1];
        let valueAbove = model.getValue(recordAbove, fieldKey);
        console.log("[F3] Value in row above (model):", valueAbove);

        // --- Fallback: If no value in model, get value from DOM ---
        if (
            typeof valueAbove === "undefined" ||
            valueAbove === null ||
            valueAbove === ""
        ) {
            let $prevRow = $allRows.eq(rowIdx - 1);
            let $cellsPrevRow = $prevRow.children('.a-GV-cell');
            let cellIdx = $row.children('.a-GV-cell').index($cell);
            let $prevCell = $cellsPrevRow.eq(cellIdx);
            let domValue = $prevCell.text().trim();
            if (domValue) {
                valueAbove = domValue;
                console.log("[F3] Fallback: Value taken directly from DOM:", domValue);
            } else {
                console.log("[F3] No value found even in DOM.");
            }
        }

        // Set the value
        let writtenToModel = false;
        try {
            if (valueAbove !== undefined && valueAbove !== null && valueAbove !== "") {
                model.setValue(record, fieldKey, valueAbove);
                writtenToModel = true;
                console.log("[F3] Value copied:", valueAbove);
            } else {
                console.log("[F3] No value to copy.");
            }
        } catch(e) {
            console.error("[F3] Error setting model value:", e);
        }

        // At least write to visible input field (e.g. for readonly/error in model)
        if (valueAbove !== undefined && valueAbove !== null && valueAbove !== "") {
            if (activeElem) {
                activeElem.value = valueAbove;
                activeElem.dispatchEvent(new Event('input', { bubbles: true }));
                activeElem.dispatchEvent(new Event('change', { bubbles: true }));
                if (!writtenToModel) {
                    console.log("[F3] (UI only) Value copied into input field:", valueAbove);
                } else {
                    console.log("[F3] UI update performed.");
                }
            }
        }

        console.log("[F3] Process completed!");
        // event.preventDefault() above always blocks browser behavior!
    }
});
