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
  if (typeof chrome === 'undefined' || !chrome.runtime) return;
  try {
    chrome.storage.sync.get(['itemsPerRow', 'ytGridExtenderEnabled'], (result) => {
      if (chrome.runtime && chrome.runtime.lastError) return;
      if (result.ytGridExtenderEnabled !== false && result.itemsPerRow) {
        setItemsPerRow(result.itemsPerRow);
      } else {
        removeItemsPerRow();
      }
    });
  } catch (e) {
    // Extension context invalidated, do nothing
  }
}

if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    try {
      if (msg.type === 'UPDATE_ITEMS_PER_ROW') {
        chrome.storage.sync.get(['ytGridExtenderEnabled'], (result) => {
          if (chrome.runtime && chrome.runtime.lastError) return;
          if (result.ytGridExtenderEnabled !== false) {
            setItemsPerRow(msg.value);
          }
        });
      } else if (msg.type === 'TOGGLE_EXTENSION') {
        applySetting();
      }
    } catch (e) {
      // Extension context invalidated, do nothing
    }
  });
}

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
