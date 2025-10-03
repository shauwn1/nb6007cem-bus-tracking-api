const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'NTC Bus Tracking API',
      version: '1.0.0',
      description: 'API for the Real-Time Bus Tracking System for the National Transport Commission of Sri Lanka (NTC).',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs
  apis: ['./src/routes/*.js'], // Gathers comments from all files in the routes folder
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;