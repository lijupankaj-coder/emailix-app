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
EMAILIX_MAX_SEND_RECIPIENTS=200
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey-or-user@example.com
SMTP_PASS=your-smtp-password
SMTP_FROM=campaigns@example.com
```

Users can build and preview emailers for free. ZIP download and bulk email sending require an active license key. Each sender can enter their own SMTP credentials in the Send dialog.

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

Bulk sending:

- The builder sends one email per recipient so addresses are not exposed to other recipients.
- SMTP can be entered by the paid user in the Send dialog. The `.env` SMTP values are only an optional platform fallback.
- SMTP must come from a real provider such as Brevo SMTP, Resend SMTP, SendGrid SMTP, Mailgun SMTP, Amazon SES SMTP, Gmail Workspace SMTP, or the user's own mail server.
- The sender email must be verified with that SMTP provider.
- `EMAILIX_MAX_SEND_RECIPIENTS` limits recipients per campaign. The default is `200`.
- Uploaded base64 images are not embedded into outgoing campaigns. Use public image URLs for production email sends.

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
