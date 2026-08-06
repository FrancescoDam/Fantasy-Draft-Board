# Fantasy Draft Board — iPhone app setup

This folder is a ready-to-host version of your fantasy draft dashboard, set up as a
PWA (Progressive Web App) so it can be added to an iPhone home screen like a real app —
its own icon, opens full-screen with no Safari address bar, and works offline once loaded.

Since this needs a real `https://` URL (Safari won't let you "Add to Home Screen" a file
sitting on your computer), the easiest free way to get one is GitHub Pages, using the
GitHub account you already have.

## 1. Create a new GitHub repo

1. Go to https://github.com/new
2. Repository name: anything you like, e.g. `fantasy-draft-board`
3. Set it to **Public** (GitHub Pages on a free account requires a public repo)
4. Don't check "Add a README" — leave it empty
5. Click **Create repository**

## 2. Upload these 6 files

On the new repo's page, click **"uploading an existing file"** (or Add file → Upload files),
then drag in all 6 files from this folder:

- `index.html`
- `manifest.json`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `icon-180.png`

Commit them to the `main` branch.

(If you'd rather use git on the command line instead of the web upload, that works too —
`git init`, `git remote add origin <your repo URL>`, add these 6 files, commit, and push.)

## 3. Turn on GitHub Pages

1. In your repo, go to **Settings → Pages** (left sidebar)
2. Under "Build and deployment" → Source, choose **Deploy from a branch**
3. Branch: `main`, folder: `/ (root)` → **Save**
4. GitHub will show a URL like `https://<your-username>.github.io/fantasy-draft-board/`
   — it can take 1-2 minutes to go live the first time.

## 4. Add it to your iPhone home screen

1. On your iPhone, open that URL in **Safari** (must be Safari, not Chrome — only Safari
   supports "Add to Home Screen" as a full app)
2. Tap the **Share** button (square with an arrow, bottom of the screen)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

You'll now have a "Draft Board" icon on your home screen that opens full-screen, no browser
bar, with your own icon. Favorites, personal notes, and any news items you add yourself now
save automatically on your phone (they didn't before, when this only lived as a Claude
artifact) — no more losing them on refresh. Use "Export my data" any time you want a backup
file or want to carry your notes to another device.

## Sharing with your league

Once the URL is live, anyone can open it in their own Safari and do step 4 above on their
own phone — no GitHub account needed on their end, just the link.

## Updating it later

Whenever your dashboard data changes (new players, updated news, etc.), just re-upload the
new `index.html` to the same repo (Add file → Upload files, same filename) and commit —
GitHub Pages will redeploy automatically, and everyone's home-screen app will pick up the
new version the next time they open it. Tell Claude and it can generate the updated
`index.html` for you to re-upload.
