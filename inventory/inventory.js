const BASEURL = "https://tags.feederbox.cc"
let vidTags = []
let imgTags = []
let bothTags = []
let allTags = []

const showTable = (arr) => {
  document.getElementById("tagbody").innerHTML = ""
  arr.forEach(tag => addToTable(...tag))
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

function addToTable(name, img, vid, ignore, alt) {
  if (ignore) return
  var body = document.getElementById("tagbody");
  var row = document.createElement('tr')
  var nameCell = document.createElement('td')
  nameCell.textContent = name
  var altCell = document.createElement('td')
  if (alt) {
    const a = document.createElement('a')
    a.href = `${BASEURL}/media/original/alt/`
    a.textContent = "📂"
    altCell.appendChild(a)
  } else altCell.textContent = "-"
  row.appendChild(nameCell)
  row.appendChild(getElem(img))
  row.appendChild(getElem(vid))
  row.appendChild(altCell)
  body.appendChild(row)
}

fetch(`${BASEURL}/tags-export.json`)
  .then(res => res.json())
  .then(data => {
    allTags = Object.entries(data)
      .map(([name, data]) => ([name, data.img, data.vid, data.ignore, data.alt]))
    allTags.forEach(tag => {
      if (tag[1] && tag[2]) bothTags.push(tag)
      else if (tag[1]) imgTags.push(tag)
      else if (tag[2]) vidTags.push(tag)
      addToTable(...tag)
    })
    document.getElementById("total").textContent = allTags.length
    document.getElementById("vid").textContent = vidTags.length
    document.getElementById("img").textContent = imgTags.length
    document.getElementById("both").textContent = bothTags.length
  })