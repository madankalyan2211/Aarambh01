# Aarambh LMS

A comprehensive Learning Management System built with React, Vite, and Node.js.

## Features

- User authentication with OTP
- Course management
- Assignment submission
- Grade tracking
- Discussion forums
- Real-time messaging
- PDF viewing and export
- Admin panel

## Deployment

### Frontend Deployment

#### AWS Amplify Deployment

This application can be deployed to AWS Amplify. See [AWS_DEPLOYMENT_GUIDE.md](AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.

### Backend Deployment

#### AWS Elastic Beanstalk Deployment

The backend can be deployed to AWS Elastic Beanstalk. See [AWS_BACKEND_DEPLOYMENT.md](AWS_BACKEND_DEPLOYMENT.md) for detailed instructions.

#### Current Deployment

The backend is currently deployed to Render at `https://aarambh01-m6cx.onrender.com`.

### Environment Variables

For deployment, you may need to set the following environment variables:

```
VITE_API_BASE_URL=https://your-backend-url.com
VITE_WS_BASE_URL=wss://your-backend-url.com
```

## Development

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Gmail account for email services

### Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (copy `.env.example` to `.env` and fill in values)
4. Start the development server: `npm run dev`

### Backend

The backend server can be started with:

```
cd server
npm install
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License