// win-1252 conversion from https://stackoverflow.com/a/73127563
const cleanFileName = (filename) =>
  filename
    .trim()
    .replace(/\./g, "")
    .replace(/\:/g, "-")
    .replace(/ |\/|\\/g, "_")

const handleClipboard = (evt) => {
  const text = window.getSelection().toString()
  navigator.clipboard.writeText(cleanFileName(text))
  evt.preventDefault()
}

document.addEventListener("copy", handleClipboard)