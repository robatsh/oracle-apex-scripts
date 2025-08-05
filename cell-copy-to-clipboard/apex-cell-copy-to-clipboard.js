/*
 * This script enables copying text content on Ctrl+Click within the main body of an Oracle APEX page.
 * It excludes navigation menus and SCRIPT tags.
 * When Ctrl is pressed and a click occurs on an input, textarea, label, or container,
 * it copies the related text/value to the clipboard.
 * A small "Copied!" confirmation popup appears near the mouse pointer.
 * It uses Clipboard API if available, otherwise falls back to execCommand('copy').
 */

(function() {
  const t_body = document.getElementsByClassName('t-Body')[0];
  if (!t_body) return;

  for (let i = 0; i < t_body.children.length; i++) {
    let entry = t_body.children[i];

    if (entry.tagName === 'SCRIPT') {
      continue;
    }
    // Do not allow copying in navigation menu
    if (entry.tagName === 'DIV' && entry.role === 'navigation') {
      continue;
    }

    entry.addEventListener("click", function(event) {
      // Only respond if CTRL is pressed without ALT, SHIFT or META
      if (!(event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey)) return;

      const target = event.target;
      let sourceElement = null;

      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        sourceElement = target;
      } else {
        if (target.tagName === "LABEL") {
          const inputId = target.getAttribute("for");
          if (inputId) {
            sourceElement = document.getElementById(inputId);
          }
        }
        if (!sourceElement) {
          sourceElement = target.querySelector("input, textarea");
        }
        if (!sourceElement) {
          const container = target.closest(".t-Form-inputContainer");
          if (container) {
            sourceElement = container.querySelector("input, textarea");
          }
        }
      }

      let textToCopy = "";
      if (sourceElement) {
        textToCopy = sourceElement.value || sourceElement.getAttribute("value") || "";
      } else {
        textToCopy = target.innerText || "";
      }

      function showConfirmation(evt) {
        const msg = document.createElement("div");
        msg.innerText = "Copied!";
        msg.style.position = "absolute";
        msg.style.background = "#000";
        msg.style.color = "#fff";
        msg.style.padding = "5px 10px";
        msg.style.borderRadius = "5px";
        msg.style.top = (evt.clientY + 10) + "px";
        msg.style.left = (evt.clientX + 10) + "px";
        msg.style.zIndex = "1000";
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 1000);
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy)
          .then(() => showConfirmation(event))
          .catch(err => console.error("Error copying (Clipboard API):", err));
      } else {
        const tempInput = document.createElement("input");
        tempInput.style.position = "absolute";
        tempInput.style.left = "-1000px";
        tempInput.value = textToCopy;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          document.execCommand("copy");
          showConfirmation(event);
        } catch (err) {
          console.error("Error copying (execCommand):", err);
        }
        document.body.removeChild(tempInput);
      }
    });

  }
})();
