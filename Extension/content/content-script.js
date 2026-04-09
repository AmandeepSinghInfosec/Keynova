// content/content-script.js
// NOTE: No import/export — content scripts cannot use ES modules in Chrome MV3

(function () {
  "use strict";

  function findLoginFields() {
    const pw = document.querySelector('input[type="password"]');
    if (!pw) return null;
    const form = pw.closest("form");
    const scope = form || document;
    const user =
      scope.querySelector('input[type="email"]') ||
      scope.querySelector('input[name*="user" i]') ||
      scope.querySelector('input[name*="email" i]') ||
      scope.querySelector('input[name*="login" i]') ||
      scope.querySelector('input[type="text"]');
    return { userField: user, pwField: pw };
  }

  function fillField(el, value) {
    if (!el) return;
    const descriptor = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, "value"
    );
    if (descriptor && descriptor.set) {
      descriptor.set.call(el, value);
    } else {
      el.value = value;
    }
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "KEYNOVA_AUTOFILL") {
      const fields = findLoginFields();
      if (fields) {
        fillField(fields.userField, msg.payload.username);
        fillField(fields.pwField, msg.payload.password);
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
    }
    if (msg.type === "KEYNOVA_DETECT_FIELDS") {
      const fields = findLoginFields();
      sendResponse({ hasLoginForm: !!fields, currentUrl: window.location.hostname });
    }
    return true;
  });
})();
