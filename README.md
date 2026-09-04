# TOWSTER site — upgrade notes

## 1. Multi-recipient email

`CONTACT_TO_DEFAULT` always gets a copy; the category list is added on top and
de-duplicated. `replyTo` is the sender, so hitting reply answers them and not
the whole distribution list. The form also has a hidden spam trap, a 5-per-10-min
per-IP throttle, length caps, and HTML escaping.

The throttle is in-memory, so on serverless each instance counts separately.
Move it to Upstash/KV if the form starts drawing traffic.

## 2. Media carousel

Add a video by appending one object to `mediaItems` in `src/lib/media.ts`. It
appears on `/media` automatically, and on the home page if `featured: true`.
Commented templates for a conference recording and a self-hosted MP4 are in the
file.

Videos load as click-to-play thumbnails, so the page doesn't pull a YouTube
player until someone asks for one, and embeds use `youtube-nocookie`.

## 3. Slide deck

Export 8 slides to `/public/deck/slide-01.jpg` … `slide-08.jpg`:

```bash
pdftoppm -jpeg -r 150 -f 1 -l 8 deck.pdf public/deck/slide
```

`src/lib/media.ts` lists which source slides to use and, more importantly,
**which not to publish**: the named sensor partner and university, the UGV
manufacturer, the pharmacokinetic simulation figures, the funding ask, and the
NDAA implications brief. Strip the CONFIDENTIAL footer from anything you post —
a marking that appears on public material stops meaning anything internally.

Optionally put a cleared one-pager at `/public/TOWSTER-overview.pdf`; otherwise
set `deckDownloadUrl` to `undefined` and the download link disappears.