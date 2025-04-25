function setItemsPerRow(value) {
  const grid = document.querySelector('ytd-rich-grid-renderer');
  if (grid) {
    grid.style.setProperty('--ytd-rich-grid-items-per-row', value);
  } else {
    document.documentElement.style.setProperty('--ytd-rich-grid-items-per-row', value);
  }
}
function removeItemsPerRow() {
  const grid = document.querySelector('ytd-rich-grid-renderer');
  if (grid) {
    grid.style.removeProperty('--ytd-rich-grid-items-per-row');
  } else {
    document.documentElement.style.removeProperty('--ytd-rich-grid-items-per-row');
  }
}

function applySetting() {
  chrome.storage.sync.get(['itemsPerRow', 'ytGridExtenderEnabled'], (result) => {
    if (result.ytGridExtenderEnabled !== false && result.itemsPerRow) {
      setItemsPerRow(result.itemsPerRow);
    } else {
      removeItemsPerRow();
    }
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'UPDATE_ITEMS_PER_ROW') {
    chrome.storage.sync.get(['ytGridExtenderEnabled'], (result) => {
      if (result.ytGridExtenderEnabled !== false) {
        setItemsPerRow(msg.value);
      }
    });
  } else if (msg.type === 'TOGGLE_EXTENSION') {
    applySetting();
  }
});

// Helper to track last URL
let lastUrl = location.href;

function observeUrlAndGrid() {
  // Observe URL changes (for SPA navigation)
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      applySetting();
    }
  }, 500);

  // Observe DOM for grid renderer
  const observer = new MutationObserver(() => {
    if (document.querySelector('ytd-rich-grid-renderer')) {
      applySetting();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

observeUrlAndGrid();
