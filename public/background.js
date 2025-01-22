// Initialize extension state
let isInjected = {};

// Simple background script with no storage dependencies
chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

// Clean up when tab is closed or updated
chrome.tabs.onRemoved.addListener((tabId) => {
    delete isInjected[tabId];
});

chrome.tabs.onUpdated.addListener((tabId) => {
    delete isInjected[tabId];
});

// Listen for clicks on the extension icon
chrome.action.onClicked.addListener(async (tab) => {
    if (!tab.id || tab.url?.startsWith('chrome://')) {
        console.log('Invalid tab for injection');
        return;
    }

    try {
        // Check if already injected
        if (isInjected[tab.id]) {
            console.log('Scripts already injected for tab:', tab.id);
            return;
        }

        console.log('Injecting scripts into tab:', tab.id);

        // Inject CSS first
        await chrome.scripting.insertCSS({
            target: { tabId: tab.id },
            files: ['floating.css']
        });
        console.log('CSS injected');

        // Then inject content script
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
        });
        console.log('Content script injected');

        isInjected[tab.id] = true;

    } catch (error) {
        console.error('Injection failed:', error);
        delete isInjected[tab.id];
        // Try to clean up any partial injections
        try {
            await chrome.scripting.removeCSS({
                target: { tabId: tab.id },
                files: ['floating.css']
            });
        } catch (e) {
            console.error('Cleanup failed:', e);
        }
    }
});

// Message handling
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received:', message);
    if (sender.tab) {
        console.log('From tab:', sender.tab.id);
    }
    sendResponse({ received: true });
    return true;
});

console.log('Background script loaded');