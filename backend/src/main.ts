import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
// import cookieParser from 'cookie-parser'

async function bootstrap() {
  	const app = await NestFactory.create(AppModule);

	app.use(cookieParser());

	// app.use( function(req, res, next) {
	// 	res.header("Access-Control-Allow-Origin", "http://localhost:4200");
	// 	// res.header("Access-Control-Allow-Credentials", "true");
	// 	res.header("Access-Control-Allow-Headers", "Authorization,  Origin, Content-Type");
		
	// 	next();
	// });
	app.enableCors();
	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  	await app.listen(3000);
}

bootstrap();
