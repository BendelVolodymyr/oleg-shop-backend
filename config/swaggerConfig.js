import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'Документація для API магазину',
  },
  servers: [
    {
      url: 'http://localhost:3001', // Замінити на твій сервер
      description: 'Local server',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Шлях до файлів з ендпойнтами
};

const swaggerSpec = swaggerJSDoc(options);

const setupSwagger = app => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('📄 Swagger доступний на: http://localhost:3001/api-docs');
};

export default setupSwagger;
