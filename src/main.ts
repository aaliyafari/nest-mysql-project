import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { GlobalValidationPipe } from './common/pipes/validation.pipe';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(GlobalValidationPipe);

  const config = new DocumentBuilder()
    .setTitle('workspace smart booking')
    .setDescription('smart booking for workspace desk')
    .setVersion('1.0')
    .addTag('workspaceBooking')
    .addBearerAuth( 
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'access-token', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000
  console.log(`Listening on port: ${port}`);
  
  await app.listen(port);
}
bootstrap();
