# VitalTrack

VitalTrack is an offline-first health journal built with React + Vite.

## Google login troubleshooting

If Google login is not completing, the issue is usually configuration rather than UI code.

1. **Netlify Identity must be enabled** for the site.
2. **Google provider must be enabled** in Netlify Identity settings.
3. **Authorized redirect URI must match the deployed site URL** in your Google OAuth app settings.
4. For local development, use the **Netlify dev environment** so Identity callbacks are handled correctly.

The app opens the Netlify Identity widget in Google login mode (`provider: "google"`) and surfaces auth errors on-screen.
