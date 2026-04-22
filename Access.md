# Direct tag access
## lookup worker
`https://look.tags.feederbox.cc/{type}/{tag}`

type can be "any", "img", "vid" - "any" will go "vid" and fall back to "img"

tag can be fetched with
- name: [`https://look.tags.feederbox.cc/img/animal ears`](https://look.tags.feederbox.cc/img/animal%20ears)
- alias (bunny ear): [`https://look.tags.feederbox.cc/img/Bunny Ear`](https://look.tags.feederbox.cc/img/Bunny%20Ear)
- stashid: [`http://look.tags.feederbox.cc/img/2a8aa3cf-c28b-4d08-b111-7807ced2184e`](http://look.tags.feederbox.cc/img/2a8aa3cf-c28b-4d08-b111-7807ced2184e)

## Caddy
`https://tags.feederbox.cc/by-name/{type}/{filename}`

type can be "img" or "video", excluded type will fallback to "any"

filename has to match [File Naming](#file-naming) conention (case sensitive)

- Any: [`https://tags.feederbox.cc/by-name/Animal_Ears`](https://tags.feederbox.cc/by-name/Animal_Ears)
- Image only: [`https://tags.feederbox.cc/by-name/img/Animal_Ears`](https://tags.feederbox.cc/by-name/img/Animal_Ears)
- [Optimized](./Technical.md#quality) image: [`https://tags.feederbox.cc/media/optimized/Animal_Ears.webp`](https://tags.feederbox.cc/media/optimized/Animal_Ears.webp)
- [alt/lowres](./Technical.md#folder-format): [`https://tags.feederbox.cc/media/original/alt/`](https://tags.feederbox.cc/media/original/alt/), [`https://tags.feederbox.cc/media/original/lowres/`](https://tags.feederbox.cc/media/original/lowres/)

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
