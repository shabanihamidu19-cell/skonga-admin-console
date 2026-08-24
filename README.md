# SKONGA Admin Console

**Design shell only** — mock data, no production APIs.

Web UI for future platform governance: users, usage, library health, learn signals, **feedback (likes/dislikes)**, **reports**, system status, and management settings.

## Open locally

```bash
git clone https://github.com/shabanihamidu19-cell/skonga-admin-console.git
cd skonga-admin-console
# open index.html in a browser, or:
python3 -m http.server 8080
# → http://localhost:8080
```

## GitHub Pages (optional)

Settings → Pages → Deploy from branch `main` / `/ (root)`.

## Scope

| Included now | Not included yet |
|--------------|------------------|
| Layout + navigation | Real auth |
| Mock KPIs & tables | Live backend |
| Feedback / Reports UI | Writes to production |
| Settings form (local only) | Service tokens |

## Stack

Static HTML + CSS + JS. No build step.

## License

MIT © SKONGA AI Team
