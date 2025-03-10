const BASEURL = "https://tags.feederbox.cc"
let vidTags = []
let imgTags = []
let bothTags = []
let allTags = []
let fuse

// flag for admin interface
const dontIgnore = document.URL.includes("admin")
const searchbox = document.getElementById("search")

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

// fullsize detail-header: 308px
// grid zoom-3: 392px

// colorScale from tagger-img-res
// rescaled to target img heights
const colorScale = (height) =>
  height >= 3040 ? ["#9b00c9", "#eee"] // 12MP
    : height >= 2160 ? ["#076dbe", "#eee"] // 4K/ 8.3MP
    : height >= 1080 ? ["#00b155 ", "#111"] // FHD / 2MP
    : height >= 720 ? ["#8fd259", "#111"] // HD / 0.9MP
    : height >= 420 ? ["#ff9c1f", "#111"] // 480p > grid-zoom-3 and detail-header
    : height >= 224 ? ["#cd0a06", "#eee"] // grid zoom-0
    : ["#810402", "#eee"]

const errColor = (tag) =>
  (!tag.img && !tag.vid)
    ? "#1976d2" // missing both
    : (!tag.img)
      ? "#c2185b" // missing img
      : (!tag.vid)
        ? "#9c27b0" // missing vid
        : (tag.imageDimension?.type !== "svg" && tag.imgDimensions?.height < 720) // has both, lowres check
            ? "#ff7043" // low resolution, not svg
            : "#4caf50" // has both, high res

function addToTable(tag) {
  if (tag.ignore && !dontIgnore) return
  var body = document.getElementById("tagbody");
  var row = document.createElement('tr')
  var nameCell = document.createElement('td')
  nameCell.textContent = tag.name
  nameCell.style.backgroundColor = errColor(tag)
  var altCell = document.createElement('td')
  if (tag.alt) {
    const a = document.createElement('a')
    a.href = `${BASEURL}/media/original/alt/`
    a.textContent = "📂"
    altCell.appendChild(a)
  } else altCell.textContent = "-"
  // dimensions
  var dimCell = document.createElement('td')
  // if svg, apply
  if (tag.img && tag.imgDimensions?.type == "svg") {
    dimCell.textContent = "SVG ∞"
    dimCell.style.backgroundColor = "#0ff"
    dimCell.style.color = "#111"
  } else if (tag.img && tag.imgDimensions?.height) {
    const height = tag.imgDimensions.height
    dimCell.textContent = `${height} px`
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
  // set cursor
  document.body.style.cursor = "wait"
  fetch("https://feederbox.cc/trigger/tags/update/await")
    .then(res => res.json())
    .then(data => {
      mapTags(data)
      fuse = new Fuse(allTags, fuseConfig)
      document.body.style.cursor = "auto"
      if (searchbox.value) search(searchbox.value)
    })
}

const mapTags = tags => {
  allTags = []
  vidTags = []
  imgTags = []
  bothTags = []
  missingTags = []
  allTags = Object.entries(tags)
    .map(([name, tags]) => ({ name, ...tags }))
  allTags.forEach(tag => {
    if (tag.img && tag.vid) bothTags.push(tag)
    else if (tag.img) imgTags.push(tag)
    else if (tag.vid) vidTags.push(tag)
    // missing tags queue
    if (!tag.img || !tag.vid ||
      (tag.imageDimension?.type !== "svg" && tag.imgDimensions.height < 720)) missingTags.push(tag)
  })
  showTable(allTags)
}

document.addEventListener("keydown", (e) => {
  if (e.key === "r" && e.ctrlKey) {
    e.preventDefault()
    reload()
  } else if (e.key === "f" && e.ctrlKey) {
    e.preventDefault()
    searchbox.focus()
  }
})

// fuse config
const fuseConfig = {
  keys: ["name", "aliases"],
  threshold: 0.4,
  shouldSort: true,
  includeScore: true, // debugging
  findAllMatches: true,
  minMatchCharLength: 2,
};

// fuse search
// https://stackoverflow.com/a/54265129
function debounce(f, interval) {
  let timer = null;
  return (...args) => {
    clearTimeout(timer);
    return new Promise((resolve) => {
      timer = setTimeout(() => resolve(f(...args)), interval);
    });
  };
}

async function search(searchValue) {
  if (searchValue.length < 2) return showTable(allTags);
  const results = fuse.search(searchValue);
  console.debug(searchValue, results);
  const filterTable = results.map((result) => result.item);
  showTable(filterTable, searchValue);
}
searchbox.addEventListener("input", debounce((e) => search(e.target.value), 300));

fetch(`${BASEURL}/tags-export.json`, {
  cache: "no-store"
})
  .then(res => res.json())
  .then(data => {
    mapTags(data)
    fuse = new Fuse(allTags, fuseConfig); // search
    document.getElementById("total").textContent = allTags.length
    document.getElementById("vid").textContent = vidTags.length
    document.getElementById("img").textContent = imgTags.length
    document.getElementById("both").textContent = bothTags.length
    document.getElementById("missing").textContent = missingTags.length
  })
