# Changes

## Hero scroll animation (was broken)
- Cause: hero-cinematic.js measured the 100vh sticky stage instead of the 350vh #hero wrapper, so scroll distance was 0 and progress stayed at 0% for the entire hero.
- Rewrote the engine: scroll progress -> frame index (direct mapping, forward/back, holds when idle), rAF-throttled, pre-decoded frames, coarse-to-fine loading, cover-fit with aspect ratio preserved, resize/DPR handling, reduced-motion = static first frame, phones/tablets use every 2nd frame.
- Frames converted PNG -> WebP (225 files, 219 MB -> 7.3 MB). Originals remain in your uploaded RAR.
- Preloader now shows real frame-loading progress (previously a 3.5 s timer forced completion).

## Fixes
- Added the Bootstrap-style utility classes the markup uses (Bootstrap CSS was never loaded): fixes mobile navbar overflow and icon colours.
- Fixed horizontal overflow at 360px (grid minimums, navbar).
- Hero text scrim for readability; dvh for mobile browser bars.
- Default theme is dark (toggle and saved preference still work).

## Not changed
- Content, project links, CV, contact form (mailto/WhatsApp dispatch), api/contact.php (needs a PHP host; unused on GitHub Pages).
- Removed duplicate folder WhatsApp_Video_..._frames (verified byte-identical to assets/frames).

## Update 2: 60 fps sequence + new portrait
- Hero now uses the 596-frame 60 fps sequence (assets/frames/frame_0001..0596.webp), interpolated from the 24 fps video.
- Engine: 4-digit frame names; preloader waits only for a coarse subset (first, last, every 8th frame) and the rest stream in; phones/tablets load every 3rd frame (200 frames).
- Scroll length increased (450vh desktop / 320vh mobile) so 596 frames scrub smoothly.
- About-section portrait replaced with a face-centred crop of your new photo (assets/images/tayyab-about.png); full photo saved as assets/images/tayyab-profile.png (not currently shown on the page). Old versions kept outside the project.
