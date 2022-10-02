import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	const cors = require('cors');
	app.use(cors({
		origin: 'http://localhost:4200'
	}))
	await app.listen(3000);
}
bootstrap();
