import { forwardRef, Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { UserModule } from "src/users/users.module";
import { SocketController } from "./socket.controller";
import { SocketGateway } from "./socket.gateway";

@Module({
	imports: [forwardRef(()=> AuthModule),
				forwardRef(()=> UserModule),
	],
	controllers:[SocketController],
	providers:[SocketGateway],
	exports:[SocketGateway],
})
export class SocketModule{}