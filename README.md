# TOVIK Technologies — Full-stack starter

A responsive company website with a React frontend and an Express backend.

## Included
- TOVIK logo already installed at `client/public/tovik-logo.jpeg`
- Home, services, work/portfolio, about and contact sections
- Contact/enquiry form connected to the backend
- Admin sign-in and protected leads dashboard
- Persistent local JSON storage (works without a paid database)
- Optional MongoDB integration can be added later

## Requirements
Install Node.js LTS (18 or newer) on your computer.

## Run the project
1. Extract this ZIP.
2. Open the extracted `tovik-technologies-fullstack` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run `npm install`.
5. Run `npm run dev`.
6. Open the frontend URL shown in the terminal (normally http://localhost:5173).

The API runs at http://localhost:5000.

## Admin access
Default local development login:
- Email: `admin@tovik.in`
- Password: `Tovik@12345`

Change these values in `server/.env` before deploying publicly. Copy `server/.env.example` to `server/.env` to customize them.

## Important before going live
This is a working development foundation, not a deployed production service. Before public launch:
- Set a strong unique `JWT_SECRET` and admin password.
- Use HTTPS through your hosting provider.
- Configure a production database and backups if required.
- Add your real company contact details and legal pages.
- Test authentication, validation, spam protection and backups.
- Deploy frontend and API with the correct environment variables.

The included JSON storage is suitable for local development and a small demonstration. It is not a substitute for a managed production database when multiple server instances or high traffic are expected.
