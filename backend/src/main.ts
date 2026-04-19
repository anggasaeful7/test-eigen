import 'reflect-metadata';
import { AppDataSource } from './config/database';
import { createApp } from './app';
import { seedDatabase } from './database/seed';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected');

    await seedDatabase(AppDataSource);

    const app = createApp(AppDataSource);

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
