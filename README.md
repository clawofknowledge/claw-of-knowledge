# The Claw of Knowledge — how to add and change content

This file shows on your repository's GitHub page. It is not part of the website.

**Where a file goes decides what kind of page it becomes.** Copy a starter file from `_templates/`, fill it in, and save it in the right folder. GitHub rebuilds the site about a minute after each commit.

| To add… | Put a `.md` file in… | Name it… | It appears at… |
|---|---|---|---|
| A comic | `_comics/` | the comic's number: `361.md` | `/comic/361/` and on the homepage if it's newest |
| An article | `_articles/` | lowercase words with hyphens: `uscgc-northland.md` | `/article/uscgc-northland/` |
| A book | `_books/` | anything: `my-new-book.md` | a card on the Store page |
| A sticker or product | `_merch/` | anything: `buoy-sticker.md` | a card on the Store page |

To **remove** anything, delete its file. To **hide** something without deleting it, add the line `published: false` inside its top section.

## Weekly comic, step by step

1. Upload the image to the `comics/` folder, named `comic-361.png` (the comic's number).
2. Open `_comics/`, choose **Add file → Create new file**, and name it `361.md`.
3. Paste in `_templates/comic.md` and fill it in:

```markdown
---
title: "Your Comic Title"
date: 2026-10-01 12:00
image: /comics/comic-361.png
tags: ["navy"]
---
Your Author Note goes here.
```

4. Commit. The Archive, tag dropdown, search, RSS feed, sitemap, and Google tags all update themselves.

### Optional comic fields (these help Google)

```yaml
alt: "One sentence describing what the comic shows"
description: "One-line summary for Google results and share previews"
transcript: |
  Panel 1: Chief: "Good news, we set a record!"
  Panel 2: Seaman: "..."
```

The transcript appears under a "Read the transcript" link. It's the single biggest search boost for a webcomic, because Google can't read words inside images.

## Rules that prevent errors

- The top section starts and ends with a line of three dashes `---`.
- Keep quotation marks around titles, especially ones with a colon, like `"Guest Comic: Landing Strip"`.
- Dates are `year-month-day`, with an optional `hour:minute` for comics. The date sets the comic order.
- Filenames are lowercase with no spaces. The web address comes from the filename, so renaming a *title* is always safe, but renaming a *file* changes its address.
- If a change doesn't appear, GitHub couldn't build it. It emails you, and the Actions tab in your repository shows which file has the problem. The live site stays as it was until the error is fixed.

## Site-wide settings

Everything that appears on every page lives in **`_config.yml`**: your domain, social links, Venmo and Patreon, email, the newsletter signup link, and your GoatCounter code. Change it there once and every page updates.

## Pages

`about.md` is the About page and is written in Markdown. `index.html`, `archive.html`, `articles.html`, and `store.html` build themselves from the folders above, so you shouldn't need to edit them.
