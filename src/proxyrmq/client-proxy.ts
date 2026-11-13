import { Injectable } from '@nestjs/common';
import {
    ClientProxy,
    ClientProxyFactory,
    Transport,
} from '@nestjs/microservices';

@Injectable()
export class ClientProxyGameRanking {
    private user = process.env.RABBITMQ_USER;
    private password = process.env.RABBITMQ_PASSWORD;
    private host = process.env.RABBITMQ_HOST;
    private vhost = process.env.RABBITMQ_VIRTUAL_HOST;
    private rmqProtocol = process.env.RABBITMQ_PROTOCOL;
    private rmqQueue = process.env.RABBITMQ_QUEUE;

    private url = `${this.rmqProtocol}${this.user}:${this.password}@${this.host}${this.vhost}`;

    getClientProxyAdminBackendInstance(): ClientProxy {
        return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [this.url],
                queue: this.rmqQueue,
            },
        });
    }
}
