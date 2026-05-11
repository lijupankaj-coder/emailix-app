# Emailix

Emailix is a Nebulix email template builder for creating responsive HTML email templates with visual blocks, MJML preview/export, AI design import, and ZIP packaging.

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
ANTHROPIC_API_KEY=
```

Users can also provide an Anthropic API key in the Emailix settings panel. The key is stored in browser localStorage and sent only when AI import is used.

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

## Legal and SEO

The public build includes:

- `privacy.html`
- `terms.html`
- `robots.txt`
- `sitemap.xml`
- `ads.txt`
- `og-image.svg`
