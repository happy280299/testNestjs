import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createServer } from 'http';
import { Server } from 'socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set up CORS for HTTP requests
  app.enableCors({
    origin: 'https://happy-camera.netlify.app', // Allow your Netlify URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Create the server instance for socket.io
  const server = createServer(app.getHttpAdapter().getInstance());
  
  // Configure socket.io with CORS
  const io = new Server(server, {
    cors: {
      origin: 'https://happy-camera.netlify.app', // Netlify URL
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Set up socket event listeners
  io.on('connection', (socket) => {
    console.log('New client connected');
    
    socket.on('offer', (data) => {
      console.log('Received offer:', data);
      socket.broadcast.emit('offer', data); // Broadcast offer to other clients
    });

    socket.on('answer', (data) => {
      console.log('Received answer:', data);
      socket.broadcast.emit('answer', data); // Broadcast answer
    });

    socket.on('ice-candidate', (data) => {
      console.log('Received ICE candidate:', data);
      socket.broadcast.emit('ice-candidate', data); // Broadcast ICE candidate
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  // Start listening on your specified port
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Run the bootstrap function
bootstrap();
