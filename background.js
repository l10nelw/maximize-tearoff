const lastDetach = {
    set(tabId, oldWindowId) {
        this.tabId = tabId;
        this.oldWindowId = oldWindowId;
    }
};

lastDetach.set();

browser.windows.onCreated.addListener(async ({ id }) => {
    if (!lastDetach.tabId) return;
    const tab = await browser.tabs.get(lastDetach.tabId).catch(() => null);
    if (tab?.windowId === id) { // If detached tab is now in this window
        const { state } = await browser.windows.get(lastDetach.oldWindowId);
        if (state === 'maximized') browser.windows.update(id, { state });
    }
    lastDetach.set();
});

browser.tabs.onDetached.addListener((tabId, info) => lastDetach.set(tabId, info.oldWindowId));
