let isDebugOn = false;
let clickCount = 0;
const DOUBLE_CLICK_THRESHOLD = 300;

chrome.action.onClicked.addListener((tab) => {
  clickCount++;

  setTimeout(() => {
    if (clickCount === 1) {
      isDebugOn = !isDebugOn;

  const iconPath = isDebugOn ? '/icons/open_128.png' : '/icons/Close_128.png';
  chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath } });

  const currentUrl = new URL(tab.url);
  currentUrl.searchParams.set('debug', isDebugOn ? '1' : '0');
  chrome.tabs.update(tab.id, { url: currentUrl.toString() });
} else {
  const newIconPath = '/icons/assets_128.png';
  chrome.action.setIcon({ path: { 16: newIconPath, 48: newIconPath } });

  const currentUrl = new URL(tab.url);
  currentUrl.searchParams.set('debug', 'assets');
  chrome.tabs.update(tab.id, { url: currentUrl.toString() });
}
clickCount = 0;
  }, DOUBLE_CLICK_THRESHOLD);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const currentUrl = new URL(changeInfo.url);

    const debugParam = currentUrl.searchParams.get('debug');
    if (debugParam === '1' || debugParam === '0') {
      const iconPath = debugParam === '1' ? '/icons/open_128.png' : '/icons/Close_128.png';
      chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath }, tabId });
    } else if (debugParam === 'assets') {
      const iconPath = '/icons/assets_128.png';
      chrome.action.setIcon({ path: { 16: iconPath, 48: iconPath }, tabId });
    }
  }
});