import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'http';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for HTTP requests
  app.enableCors({
    origin: 'https://happy-camera.netlify.app',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Create HTTP server instance for socket.io
  const server = createServer(app.getHttpAdapter().getInstance());
  
  // Configure socket.io with CORS and optional path
  const io = new Server(server, {
    cors: {
      origin: 'https://happy-camera.netlify.app',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    path: '/socket.io',
  });

  // Socket event listeners
  io.on('connection', (socket) => {
    console.log(`New client connected: ${socket.id}`);
    
    socket.on('offer', (data) => {
      console.log(`Received offer from ${socket.id}`, data);
      socket.broadcast.emit('offer', data);
    });

    socket.on('answer', (data) => {
      console.log(`Received answer from ${socket.id}`, data);
      socket.broadcast.emit('answer', data);
    });

    socket.on('ice-candidate', (data) => {
      console.log(`Received ICE candidate from ${socket.id}`, data);
      socket.broadcast.emit('ice-candidate', data);
    });

    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  // Start server on specified port
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
