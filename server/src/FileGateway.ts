import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';


@WebSocketGateway({
    cors: {
        origin: 'http://localhost:3001',
        credentials: true,
    },
}) export class FileGateway {
    @WebSocketServer()
    server: Server;

    // Emit status updates
    async emitFileStatusUpdate(userId: number, fileId: number, status: string) {
        this.server.emit(`file-status-update-${userId}`, { fileId, status });
    }
}
