document
.getElementById("downloadBtn")
.onclick = async () => {

    const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab?.url)
        return;

    chrome.runtime.sendMessage({
        action: "downloadCurrentItem",
        url: tab.url
    });

};