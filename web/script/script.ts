Array.from(document.querySelectorAll<HTMLImageElement>("img")).forEach((img) => {
    img.onerror = () => {
        const sourceURL = img.getAttribute("src")
        if (sourceURL === null || sourceURL.length === 0) { return }
        img.setAttribute("src", sourceURL.substring(0, sourceURL.lastIndexOf(".")) + ".png")
    }
})
