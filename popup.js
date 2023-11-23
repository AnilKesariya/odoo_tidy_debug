let isDebugOn = new Map();
let clickCountMap = new Map();
const DOUBLE_CLICK_THRESHOLD = 300;

function setDefaultIcon(tabId) {
  const defaultIconPath = '/icons/close_128.png';
  chrome.action.setIcon({ path: { 16: defaultIconPath, 48: defaultIconPath }, tabId });
}

chrome.action.onClicked.addListener((tab) => {
  let clickCount = clickCountMap.get(tab.id) || 0;
  clickCount++;
  clickCountMap.set(tab.id, clickCount);

  setTimeout(() => {
    if (clickCount === 1) {
      isDebugOn.set(tab.id, !isDebugOn.get(tab.id));

      const iconPath = isDebugOn.get(tab.id) ? '/icons/open_128.png' : '/icons/Close_128.png';
      chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath } });

      const currentUrl = new URL(tab.url);
      currentUrl.searchParams.set('debug', isDebugOn.get(tab.id) ? '1' : '0');
      chrome.tabs.update(tab.id, { url: currentUrl.toString() });
    } else {
      const newIconPath = '/icons/assets_128.png';
      chrome.action.setIcon({ path: { 16: newIconPath, 48: newIconPath } });

      const currentUrl = new URL(tab.url);
      currentUrl.searchParams.set('debug', 'assets');
      chrome.tabs.update(tab.id, { url: currentUrl.toString() });
    }
    clickCountMap.set(tab.id, 0);
  }, DOUBLE_CLICK_THRESHOLD);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const currentUrl = new URL(changeInfo.url);
    const debugParam = currentUrl.searchParams.get('debug');

    if (debugParam === '1') {
      const iconPath = '/icons/open_128.png';
      chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath }, tabId });
    } else if (debugParam === '0') {
      const iconPath = '/icons/close_128.png';
      chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath }, tabId });
    } else if (debugParam === 'assets') {
      const iconPath = '/icons/assets_128.png';
      chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath }, tabId });
    } else {
      setDefaultIcon(tabId);
    }
  }
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  chrome.tabs.get(tabId, (tab) => {
    if (tab.url) {
      const currentUrl = new URL(tab.url);
      const debugParam = currentUrl.searchParams.get('debug');

      if (!debugParam) {
        setDefaultIcon(tabId);
      }
    }
  });
});
