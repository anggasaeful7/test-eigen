import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { createContainer, mountRoutes } from './container';
import { DataSource } from 'typeorm';

export function createApp(dataSource: DataSource) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  const apiRouter = express.Router();
  const container = createContainer(dataSource);
  mountRoutes(apiRouter, container);
  app.use('/api', apiRouter);

  return app;
}
