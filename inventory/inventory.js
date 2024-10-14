const BASEURL = "https://tags.feederbox.cc"

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

function addToTable(name, img, vid, ignore) {
  if (ignore) return
  var body = document.getElementById("tagbody");
  var row = document.createElement('tr')
  var cell1 = document.createElement('td')
  cell1.textContent = name
  row.appendChild(cell1)
  row.appendChild(getElem(img))
  row.appendChild(getElem(vid))
  body.appendChild(row)
}
fetch(`${BASEURL}/tags-export.json`)
  .then(res => res.json())
  .then(data => {
    const allTags = Object.entries(data)
      .map(([name, data]) => ([name, data.img, data.vid, data.ignore]))
    allTags.forEach(tag => addToTable(...tag))
    const total = allTags.length
    document.getElementById("total").textContent = total
    const video = allTags.filter(([_, __, vid]) => vid).length
    document.getElementById("vid").textContent = video
    const img = allTags.filter(([_, img, __]) => img).length
    document.getElementById("img").textContent = img
    const both = allTags.filter(([_, img, vid]) => img && vid).length
    document.getElementById("both").textContent = both
  })