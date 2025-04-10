import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import dotenv from 'dotenv';
import { initializeApplication } from './startup';
import { brokerService } from './services/brokerService';

// Import routes
import accountRoutes from './routes/accountRoutes';
import serviceRoutes from './routes/serviceRoutes';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 4000;

// Apply basic middleware
app.use(cors());
app.use(express.json());

// API documentation route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  explorer: true,
  customSiteTitle: '0G Compute Network API Documentation',
}));

// API routes
const apiPrefix = '/api';

// Register routes
app.use(`${apiPrefix}/account`, accountRoutes);
app.use(`${apiPrefix}/services`, serviceRoutes);

// Root route with basic info
app.get('/', async (req, res) => {
  try {
    const services = await brokerService.listServices();
    const formattedServices = services.map(service => ({
      providerAddress: service[0],
      serviceType: service[1],
      endpoint: service[2],
      model: service[6],
      providerName: service[7]
    }));

    res.json({
      name: '0G Compute Network API',
      version: '1.0.0',
      documentation: '/docs',
      endpoints: {
        account: `${apiPrefix}/account`,
        services: `${apiPrefix}/services`,
      },
      availableServices: formattedServices
    });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({
      name: '0G Compute Network API',
      version: '1.0.0',
      documentation: '/docs',
      endpoints: {
        account: `${apiPrefix}/account`,
        services: `${apiPrefix}/services`,
      },
      error: 'Failed to fetch available services'
    });
  }
});

// Simple error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err.message);
  res.status(500).json({
    success: false,
    error: 'Server error',
    message: err.message
  });
});

// Initialize application and start server
const startServer = async () => {
  try {
    // Run initialization tasks
    await initializeApplication();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`
  🚀 0G Compute Network API Server running on http://localhost:${PORT}
  📚 API Documentation: http://localhost:${PORT}/docs
      `);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the application
startServer();

export default app; 