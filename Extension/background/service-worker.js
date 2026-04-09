// background/service-worker.js
// Plain script — no ES module imports allowed unless manifest declares type: module

const LOCK_ALARM = "keynova_lock";
const LOCK_AFTER_MINUTES = 15;

chrome.runtime.onInstalled.addListener(() => {
  scheduleLock();
});

chrome.runtime.onStartup.addListener(() => {
  scheduleLock();
});

function scheduleLock() {
  chrome.alarms.create(LOCK_ALARM, { delayInMinutes: LOCK_AFTER_MINUTES });
}

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === LOCK_ALARM) {
    chrome.storage.local.remove("keynova_session_key");
  }
});

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "KEYNOVA_ACTIVITY") {
    chrome.alarms.clear(LOCK_ALARM, () => scheduleLock());
  }
});
