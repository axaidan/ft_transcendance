import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { dirname, join } from 'path';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());
	app.enableCors();

	const config = new DocumentBuilder()
		.setTitle('Ft_transendence')
		.setDescription('42 project API')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	// // CHAT TESTS - BEGIN
	// const app = await NestFactory.create<NestExpressApplication>(AppModule);
	// app.useStaticAssets(join(__dirname, '..', 'static_chat_front_test' ))
	// // CHAT TESTS - END

	await app.listen(3000);
}

bootstrap();
