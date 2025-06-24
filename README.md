# Rural Eats Frontend

## Deployment (Netlify)

1. **Connect your repository to Netlify.**
2. **Set the following environment variables in Netlify dashboard:**
   - `NEXT_PUBLIC_API_URL` (e.g., https://rural-eats-backend.onrender.com)
   - `NEXT_PUBLIC_STRIPE_KEY` (your Stripe publishable key)
3. **Build command:**
   - `npm run build` or `next build`
4. **Publish directory:**
   - `out` (for static export) or `.next` (for SSR)
5. **Deploy!**

## Environment Variables

- `NEXT_PUBLIC_API_URL` — The base URL for your backend API (Render)
- `NEXT_PUBLIC_STRIPE_KEY` — Your Stripe publishable key

## Local Development

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Run `npm install`.
3. Run `npm run dev`.

## Notes
- Do not commit secrets or API keys to the repo.
- All API calls should use the environment variable for the backend URL.
- For custom domains, update CORS settings in the backend. 