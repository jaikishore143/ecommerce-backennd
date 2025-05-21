import app from './app';
import config from './config';
import prisma from './lib/prisma';

// Start the server
const startServer = async () => {
  try {
    // Connect to the database
    await prisma.$connect();
    console.log('Connected to the database');

    // Start the server
    const server = app.listen(config.port, () => {
      console.log(`Server running in ${config.nodeEnv} mode on port ${config.port}`);
      console.log(`API available at http://localhost:${config.port}/api`);
      console.log(`Health check available at http://localhost:${config.port}/health`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err: Error) => {
      console.error('Unhandled Promise Rejection:', err);
      // Close server & exit process
      server.close(() => process.exit(1));
    });

    // Handle SIGTERM signal
    process.on('SIGTERM', async () => {
      console.log('SIGTERM received. Shutting down gracefully');
      await prisma.$disconnect();
      server.close(() => {
        console.log('Process terminated');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
