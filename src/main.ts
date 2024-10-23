import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Sử dụng PORT từ biến môi trường hoặc một giá trị mặc định
  const port = process.env.PORT || 3000;

  // Lắng nghe trên tất cả các địa chỉ IP (0.0.0.0) để có thể truy cập từ bên ngoài
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
