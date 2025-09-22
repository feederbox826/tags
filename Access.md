# Direct tag access
### Example
For tag `Animal Ears`, Filename is `Animal_Ears`  
B2 URL:
- Image: [`https://b2.tags.feederbox.cc/Animal_Ears.webp`](https://b2.tags.feederbox.cc/Animal_Ears.webp)
- Video: [`https://b2.tags.feederbox.cc/Animal_Ears.webm`](https://b2.tags.feederbox.cc/Animal_Ears.webm)

Caddy:
- Any: [`https://tags.feederbox.cc/by-name/Animal_Ears`](https://tags.feederbox.cc/by-name/Animal_Ears)
- Image only: [`https://tags.feederbox.cc/by-name/img/Animal_Ears`](https://tags.feederbox.cc/by-name/img/Animal_Ears)
- [Optimized](./Technical.md#quality) image: [`https://tags.feederbox.cc/media/optimized/Animal_Ears.webp`](https://tags.feederbox.cc/media/optimized/Animal_Ears.webp)
- [alt/lowres](./Technical.md#folder-format): [`https://tags.feederbox.cc/media/original/alt/`](https://tags.feederbox.cc/media/original/alt/), [`https://tags.feederbox.cc/media/original/lowres/`](https://tags.feederbox.cc/media/original/lowres/)

### B2
B2 + CF Worker proxy (Free bandwith, filename required)  
`https://b2-tags.feederbox826.workers.dev/{filename}`  
`https://b2.tags.feederbox.cc/{filename}`  
Tags are backed up to B2 hourly with a proxied cf worker serving assets with free bandwidth

### Caddy
Caddy `/by-name` (10T bandwidth, filename not required)  
image only (falls back to stil screenshot):  
`https://tags.feederbox.cc/by-name/img/{tagname}`  
any (video or image):  
`https://tags.feederbox.cc/by-name/{tagname}`

## File Naming
File names ideally follow StashDB naming, but transformed to prevent URL clashes

- replace "." with ""
- replace ":" with "-"
- replace " ", "/" and "\\" with "_"

```js
const cleanFileName = (filename) =>
  filename
    .trim()
    .replace(/\./g, "")
    .replace(/\:/g, "-")
    .replace(/ |\/|\\/g, "_")
    .replace(/%u(....)/g, (m,p)=>String.fromCharCode("0x"+p))
    .replace(/%(..)/g, (m,p)=>String.fromCharCode("0x"+p))
```

Can also be copied from the [inventory](https://feederbox826.github.io/tags/inventory/) page by selecting and copying text

## File extensions
All videos are `.webm`, most images `.webp`, `.svg` for some meta tags

