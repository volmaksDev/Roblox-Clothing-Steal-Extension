async function getTextureId(clothingId) {

    const response = await fetch(
        `https://assetdelivery.roblox.com/v1/asset/?id=${clothingId}`
    );

    if (!response.ok)
        throw new Error("Failed to fetch asset");

    const text = await response.text();

    const patterns = [
        /asset\/\?id=(\d+)/i,
        /rbxassetid:\/\/(\d+)/i,
        /<url>.*?(\d+).*?<\/url>/i
    ];

    for (const pattern of patterns) {

        const match = text.match(pattern);

        if (match)
            return match[1];
    }

    throw new Error("Texture ID not found");
}

async function downloadClothing(clothingId) {

    const textureId =
        await getTextureId(clothingId);

    const pngUrl =
        `https://assetdelivery.roblox.com/v1/asset/?id=${textureId}`;

    await chrome.downloads.download({

        url: pngUrl,

        filename:
            `RobloxTextures/${textureId}.png`

    });

    console.log(
        `Downloaded texture ${textureId}`
    );
}

chrome.runtime.onMessage.addListener((msg) => {

    if (msg.action !== "downloadCurrentItem")
        return;

    (async () => {

        try {

            const match =
                msg.url.match(/\/catalog\/(\d+)/);

            if (!match)
                throw new Error(
                    "Not a catalog page"
                );

            const clothingId = match[1];

            console.log(
                "Clothing ID:",
                clothingId
            );

            await downloadClothing(clothingId);

        } catch (err) {

            console.error(err);

        }

    })();

});