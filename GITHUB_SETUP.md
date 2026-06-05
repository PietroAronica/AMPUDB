# Deploying AMPUDB to GitHub Pages

Your site URL will be: **https://PietroAronica.github.io/AMPUDB/**

---

## Step 1 — Install Git (if not already installed)

Download from https://git-scm.com/downloads and install with default settings.
Verify: open a terminal and run `git --version`.

---

## Step 2 — Create the GitHub repository

1. Go to https://github.com/new
2. Set **Repository name** to `AMPUDB` (exactly, case-sensitive)
3. Set visibility to **Public** (required for free GitHub Pages)
4. Do **not** initialise with a README (you already have one)
5. Click **Create repository**

---

## Step 3 — Push the site files

Open a terminal, navigate to the `site` folder inside your AMPUDB folder, then run:

```bash
cd "C:\Users\pietroa\Documents\AMPUDB\site"

git init
git add .
git commit -m "Initial AMPUDB site"
git branch -M main
git remote add origin https://github.com/PietroAronica/AMPUDB.git
git push -u origin main
```

You will be prompted to log in to GitHub. Use your GitHub username and a
**Personal Access Token** (not your password) — see Step 3b if you don't have one.

### Step 3b — Create a Personal Access Token (if needed)

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click **Generate new token (classic)**
3. Set expiry to 90 days, tick **repo** scope
4. Copy the token and use it as your password when Git prompts you

---

## Step 4 — Enable GitHub Pages

1. Go to https://github.com/PietroAronica/AMPUDB/settings/pages
2. Under **Source**, select **Deploy from a branch**
3. Branch: **main**, folder: **/ (root)**
4. Click **Save**

GitHub will build and publish the site. This takes 1–3 minutes.
Your site will be live at: **https://PietroAronica.github.io/AMPUDB/**

---

## Step 5 — Verify

Open https://PietroAronica.github.io/AMPUDB/ in your browser.
You should see the Browse page with all 349 entries loaded and searchable.

---

## Updating the site later

Whenever you update the data or pages:

```bash
cd "C:\Users\pietroa\Documents\AMPUDB\site"
git add .
git commit -m "Update data"
git push
```

The site rebuilds automatically within a minute or two.

---

## Updating the data (after edits to the CSV)

Run this script from the AMPUDB folder to regenerate the JSON files:

```bash
python3 export_data.py
```

Then push as above.

---

## Local preview (before pushing)

Because the site fetches JSON files, you must serve it via a local web server:

```bash
cd "C:\Users\pietroa\Documents\AMPUDB\site"
python3 -m http.server 8000
```

Then open http://localhost:8000 in your browser.
