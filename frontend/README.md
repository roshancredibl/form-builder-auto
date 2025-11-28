# ClickUp Dashboard Frontend

React TypeScript frontend application for the ClickUp Task Dashboard.

## Features

- Real-time task monitoring with auto-refresh every 10 seconds
- Clean, responsive table UI displaying task name, status, and last updated timestamp
- Configurable API endpoint via environment variable
- Error handling and loading states

## Prerequisites

- Node.js 14+ and npm
- Backend API server running (Flask application)

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the `frontend` directory to configure the API URL:

```
REACT_APP_API_URL=http://localhost:5000/api/tasks
```

For production, set this to your deployed Flask server URL:
```
REACT_APP_API_URL=https://your-api-server.com/api/tasks
```

**Note**: Environment variables in React must be prefixed with `REACT_APP_` to be accessible in the application.

## Development

Start the development server:
```bash
npm start
```

The application will open at `http://localhost:3000` and will automatically reload when you make changes.

## Building for Production

Build the production-ready static files:
```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to static hosting services.

## Deployment

### Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify, or
3. Connect your GitHub repository and set build command: `npm run build` and publish directory: `build`

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Or connect your GitHub repository in the Vercel dashboard

### GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts: `"deploy": "gh-pages -d build"`
3. Run `npm run build && npm run deploy`

## Environment Variables

- `REACT_APP_API_URL`: The base URL of your Flask API server (defaults to `http://localhost:5000/api/tasks`)

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── Dashboard.tsx      # Main dashboard component
│   ├── Dashboard.css      # Dashboard styles
│   ├── index.tsx          # Application entry point
│   └── index.css          # Global styles
├── package.json
├── tsconfig.json
└── README.md
```

