function createButton(assetId) {

    if (document.querySelector(`[data-png-btn="${assetId}"]`))
        return;

    const button = document.createElement("button");

    button.innerText = "PNG";

    button.setAttribute("data-png-btn", assetId);

    button.style.position = "absolute";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "9999";

    button.style.background = "#111";
    button.style.color = "white";
    button.style.border = "none";
    button.style.padding = "6px 10px";
    button.style.borderRadius = "8px";
    button.style.cursor = "pointer";

    button.onclick = (e) => {

        e.preventDefault();
        e.stopPropagation();

        chrome.runtime.sendMessage({
            action: "download",
            clothingId: assetId
        });

    };

    return button;
}

function injectButtons() {

    const links = document.querySelectorAll(
        'a[href*="/catalog/"]'
    );

    for (const link of links) {

        const match = link.href.match(/\/catalog\/(\d+)/);

        if (!match)
            continue;

        const assetId = match[1];

        const card =
            link.closest("li") ||
            link.parentElement;

        if (!card)
            continue;

        if (getComputedStyle(card).position === "static")
            card.style.position = "relative";

        const btn = createButton(assetId);

        if (btn)
            card.appendChild(btn);
    }
}

injectButtons();

const observer = new MutationObserver(() => {
    injectButtons();
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});