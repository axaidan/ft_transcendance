"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viteNodeApp = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors();
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Ft_transendence')
        .setDescription('42 project API')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    await app.listen(3000);
}
bootstrap();
exports.viteNodeApp = core_1.NestFactory.create(app_module_1.AppModule);
//# sourceMappingURL=main.js.map