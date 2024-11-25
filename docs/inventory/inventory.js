const BASEURL = "https://tags.feederbox.cc"
let vidTags = []
let imgTags = []
let bothTags = []
let allTags = []

const showTable = (arr) => {
  document.getElementById("tagbody").innerHTML = ""
  arr.forEach(tag => addToTable(tag))
}

const getElem = (name) => {
  const cell = document.createElement('td')
  if (name) {
    const a = document.createElement('a')
    a.href = `${BASEURL}/media/original/${name}`
    a.textContent = "✅"
    cell.appendChild(a)
  } else cell.textContent = "❌"
  return cell
}

// colorScale from tagger-img-res
const colorScale = (height) =>
  // amazing
  height == "SVG" ? ["#f2a8b0", "#111"]
    : height > 8640 ? ["#cd0065", "#eee"]
    : height == 8640 ? ["#9b00c9", "#eee"]
    : height >= 4320 ? ["#9c18fb", "#eee"]
    // great
    : height >= 2160 ? ["#076dbe", "#eee"]
    // good
    : height >= 1800 ? ["#008115", "#eee"]
    : height >= 1440 ? ["#00b155", "#111"]
    // above avg
    : height >= 900 ? ["#8fd259", "#111"]
    // average
    : height >= 720 ? ["#dde12e", "#111"]
    // bad
    : height >= 540 ? ["#ff9c1f", "#111"]
    : height >= 480 ? ["#cd0a06", "#eee"]
    : ["#810402", "#eee"]

function addToTable(tag) {
  if (tag.ignore) return
  var body = document.getElementById("tagbody");
  var row = document.createElement('tr')
  var nameCell = document.createElement('td')
  nameCell.textContent = tag.name
  var altCell = document.createElement('td')
  if (tag.alt) {
    const a = document.createElement('a')
    a.href = `${BASEURL}/media/original/alt/`
    a.textContent = "📂"
    altCell.appendChild(a)
  } else altCell.textContent = "-"
  // dimensions
  var dimCell = document.createElement('td')
  if (tag.img && tag.imgDimensions) {
    const height = tag.imgDimensions.type == "svg" ? "SVG" : tag.imgDimensions.height
    dimCell.textContent = height == "SVG" ? height : `${height}px`
    // add bg if needed
    const [bg, fg] = colorScale(height)
    dimCell.style.backgroundColor = bg
    dimCell.style.color = fg
  }
  row.appendChild(nameCell)
  row.appendChild(getElem(tag.img))
  row.appendChild(getElem(tag.vid))
  row.appendChild(altCell)
  row.appendChild(dimCell)
  body.appendChild(row)
}

const reload = () => {
  fetch("https://feederbox.cc/trigger/tags/update/await")
    .then(res => res.json())
    .then(data => mapTags(data))
}

const mapTags = tags => {
  allTags = []
  vidTags = []
  imgTags = []
  bothTags = []
  allTags = Object.entries(tags)
    .map(([name, tags]) => ({ name, ...tags }))
  allTags.forEach(tag => {
    if (tag.img && tag.vid) bothTags.push(tag)
    else if (tag.img) imgTags.push(tag)
    else if (tag.vid) vidTags.push(tag)
  })
  showTable(allTags)
}

fetch(`${BASEURL}/tags-export.json`, {
  cache: "no-store"
})
  .then(res => res.json())
  .then(data => {
    mapTags(data)
    document.getElementById("total").textContent = allTags.length
    document.getElementById("vid").textContent = vidTags.length
    document.getElementById("img").textContent = imgTags.length
    document.getElementById("both").textContent = bothTags.length
  })
