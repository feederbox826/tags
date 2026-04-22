# Direct tag access
### Example
For tag `Animal Ears`, Filename is `Animal_Ears`  
Lookup URL:
- Image: [`https://look.tags.feederbox.cc/img/Animal Ears`](https://look.tags.feederbox.cc/img/Animal%20Ears)
- Video: [`https://look.tags.feederbox.cc/vid/Animal Ears`](https://look.tags.feederbox.cc/vid/Animal%20Ears)

Caddy:
- Any: [`https://tags.feederbox.cc/by-name/Animal_Ears`](https://tags.feederbox.cc/by-name/Animal_Ears)
- Image only: [`https://tags.feederbox.cc/by-name/img/Animal_Ears`](https://tags.feederbox.cc/by-name/img/Animal_Ears)
- [Optimized](./Technical.md#quality) image: [`https://tags.feederbox.cc/media/optimized/Animal_Ears.webp`](https://tags.feederbox.cc/media/optimized/Animal_Ears.webp)
- [alt/lowres](./Technical.md#folder-format): [`https://tags.feederbox.cc/media/original/alt/`](https://tags.feederbox.cc/media/original/alt/), [`https://tags.feederbox.cc/media/original/lowres/`](https://tags.feederbox.cc/media/original/lowres/)

### lookup
B2 + CF Worker proxy [github](https://github.com/feederbox826/tags-lookup-worker)

Lookup supports the most ways of accessing
- by stashid: [`http://look.tags.feederbox.cc/img/2a8aa3cf-c28b-4d08-b111-7807ced2184e`](http://look.tags.feederbox.cc/img/2a8aa3cf-c28b-4d08-b111-7807ced2184e)
- by alias: [`https://look.tags.feederbox.cc/img/Bunny Ears`](https://look.tags.feederbox.cc/img/Bunny%20Ear)
- by name: [`https://look.tags.feederbox.cc/img/animal ears`](https://look.tags.feederbox.cc/img/animal%20ears)

### Caddy (filename conversion required)
Caddy `/by-name`
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

### optimized
Since thumbnails in optimized are also webp, they have the extension `.webm.webp` (.webp suffix without removing webm)
