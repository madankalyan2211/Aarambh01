# Learning Management System UI Design

This is a code bundle for Learning Management System UI Design. The original project is available at https://www.figma.com/design/zkzPr2Es2INclQCyS2RrFL/Learning-Management-System-UI-Design.

## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.

## Deployment

### Netlify Deployment

To deploy this application to Netlify:

1. Build the application:
   ```bash
   npm run build
   ```

2. The build output will be in the `build` directory

3. For detailed Netlify deployment instructions, see [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)

### Environment Variables

For production deployment, you need to set the following environment variables:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
VITE_APP_ENV=production
VITE_APP_URL=https://your-app-name.netlify.app
```

Replace `https://your-backend-url.com/api` with the actual URL of your deployed backend API.