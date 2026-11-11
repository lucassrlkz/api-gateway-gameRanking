import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/createCategory.dto';
import { Observable } from 'rxjs';

@Controller()
export class AppController {
  private logger = new Logger(AppController.name);
  private clientAdminBackend: ClientProxy;

  constructor() {
    const user = process.env.RABBITMQ_USER;
    const password = process.env.RABBITMQ_PASSWORD;
    const host = process.env.RABBITMQ_HOST;
    const vhost = process.env.RABBITMQ_VIRTUAL_HOST;
    const rmqProtocol = process.env.RABBITMQ_PROTOCOL;

    const url = `${rmqProtocol}${user}:${password}@${host}${vhost}`;
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: 'admin-backend',
      },
    });
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    // por usar o emit do broker, não há necessidade de usar return na função
    this.clientAdminBackend.emit('criar-categoria', createCategoryDto);
  }

  @Get('categorias')
  findCategory(@Query('idCategory') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }
}
