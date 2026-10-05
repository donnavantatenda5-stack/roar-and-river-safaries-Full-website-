# Hero background video

The hero plays `hero.mp4` from this folder as a full-screen, silent, looping
background.

## Current file

`hero.mp4` — 38 seconds, 1280x720, H.264, no audio, ~3.7 MB.
Cut from the source clip between 30s and 68s.

Kept small on purpose. A 38 MB hero video delays paint on mobile data, which is
why the desktop-sized file is not shipped.

## Encoding settings used

```
ffmpeg -ss 30 -t 38 -i source.mp4 \
  -an \
  -vf "scale=1280:720:flags=lanczos,fps=30" \
  -c:v libx264 -profile:v main -level 3.1 -preset slow -crf 30 \
  -pix_fmt yuv420p -movflags +faststart hero.mp4
```

- `-an` strips audio. It is silent anyway, and it removes an unused track.
- `fps=30` caps the frame rate so playback stays smooth on modest hardware.
- `yuv420p` is required for Safari and iOS.
- `+faststart` moves the moov atom to the front so playback can begin before the
  file finishes downloading. Without it, visitors wait for the whole download.

## Replacing the footage

1. Trim your source to 30-40 seconds of the section you want looping.
2. Encode it with the command above, changing `scale` if you need 1920x1080.
3. Name it `hero.mp4` and replace the file here.

Keep clips silent. Browsers block unmuted autoplay, so any audio track would be
muted on load regardless.

## Poster image

The hero falls back to `/public/images/hero.jpg` while the video loads, and shows
it permanently if the clip can't play. Update that image to match new footage.