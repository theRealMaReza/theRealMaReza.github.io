# Gez Website (`theRealMaReza.github.io`)

Official public website for **Gez** — grand strategy starting 30 May 1453.

Live address (once GitHub Pages is enabled): **https://therealmareza.github.io**

---

## 1. First-Time Setup on GitHub

1. Push this folder to `https://github.com/theRealMaReza/theRealMaReza.github.io.git` on the `main` branch.
2. On GitHub, open **Settings → Pages**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)` → click **Save**
3. Your site will be live at `https://therealmareza.github.io` in about a minute.

---

## 2. Publishing Game Downloads (Without Linking the Game Repo)

The website links to Releases on **this** repository (`Gez-Mac.zip`, `Gez-Windows.zip`, `Gez-Linux.tar.gz`), so it never exposes your game repository when you make it private.

1. In this website repo, go to **Settings → Secrets and variables → Actions → New repository secret**:
   - Name: `GAME_TOKEN`
   - Value: a fine-grained GitHub token with **Actions: Read** permission on `theRealMaReza/gez` only.
2. Whenever you want to publish a new build:
   - Go to **Actions → Release → Run workflow**
   - Enter a version tag (for example `v0.2-kayser`) and click **Run workflow**.
3. The download buttons on the website update automatically to the newest release.

---

## 3. Adding Your Trailer Later

Open [`config.js`](config.js) and paste your YouTube link (or MP4 file path):

```js
trailer: {
  youtubeUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
  mp4Url: "",
}
```

Push the change and the **"Trailer Coming Soon"** box automatically turns into a playable video player.

---

## 4. Trailer Audio Credits

- **Continuous instrument-free human choir:** [Touchstone (vocals only)](https://freesound.org/people/SondreDrakensson/sounds/811110/) by SondreDrakensson (CC BY 4.0).
- **Sound effects:** CC0 / MIT non-musical SFX from Gez (parchment, wood strike, hoofbeats, cannon fire, siege thud, sword clash, and coin clink).
