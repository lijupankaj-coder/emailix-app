# Emailix

Emailix is a Nebulix email template builder for creating responsive HTML email templates with visual blocks, MJML preview, paid ZIP downloads, privacy pages, SEO metadata, and an admin license page.

## Local Development

```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
npm run dev
```

Frontend: `http://localhost:5173`

API: `http://localhost:4000`

## Environment

Create `.env` in the project root for local backend settings:

```env
PORT=4000
CLIENT_URL=http://localhost:5173,http://localhost:3000
ADMIN_USER=liju
ADMIN_PASSWORD=Nblx@Admin2026
LICENSE_STORE_PATH=
EMAILIX_LICENSE_KEYS=
```

Users can build and preview emailers for free. ZIP download requires an active license key.

Download plans:

- Monthly: `$29`
- Yearly: `$199`
- Internal Super Admin: non-expiring access, created from the admin page when needed

Admin page:

```text
/nblx-cffe300c-ctrl.html
```

The admin page is protected by HTTP Basic Auth. Default username is `liju` and default password is `Nblx@Admin2026`. You can override either with `ADMIN_USER` and `ADMIN_PASSWORD`.

License storage defaults to `server/data/licenses.json`. Set `LICENSE_STORE_PATH` for persistent Coolify storage, or provide comma-separated keys in `EMAILIX_LICENSE_KEYS` for simple environment-based licenses.

Screenshot protection:

Emailix blocks browser right-click, copy, print, drag, and common screenshot keyboard shortcuts where browser events are available. A web app cannot fully prevent operating system or browser-level screenshots.

## Production

For Coolify, deploy this repository with the included `Dockerfile`.

The container:

- builds the Vite client
- installs the Express server production dependencies
- serves the built client and API from port `4000`

Health endpoint:

```text
/api/health
```

Admin page:

```text
/nblx-cffe300c-ctrl.html
```

## Legal and SEO

The public build includes:

- `privacy.html`
- `terms.html`
- `robots.txt`
- `sitemap.xml`
- `ads.txt`
- `og-image.svg`
