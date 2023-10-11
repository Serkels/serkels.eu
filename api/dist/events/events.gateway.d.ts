import { WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server } from 'socket.io';
export declare class EventsGateway {
    server: Server;
    findAll(data: any): Observable<WsResponse<number>>;
    identity(data: number): Promise<number>;
}
