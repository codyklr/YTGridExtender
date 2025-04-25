const enableToggle = document.getElementById('enableToggle');
const itemsInput = document.getElementById('itemsPerRow');
const applyBtn = document.getElementById('applyBtn');

applyBtn.addEventListener('click', async () => {
  const value = itemsInput.value;
  chrome.storage.sync.set({ itemsPerRow: value });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'UPDATE_ITEMS_PER_ROW', value });
  });
});

enableToggle.addEventListener('change', () => {
  const enabled = enableToggle.checked;
  chrome.storage.sync.set({ ytGridExtenderEnabled: enabled });
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'TOGGLE_EXTENSION', enabled });
  });
});

// Load saved values
chrome.storage.sync.get(['itemsPerRow', 'ytGridExtenderEnabled'], (result) => {
  if (result.itemsPerRow) {
    itemsInput.value = result.itemsPerRow;
  }
  enableToggle.checked = result.ytGridExtenderEnabled !== false; // default to enabled
});
