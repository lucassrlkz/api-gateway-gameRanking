import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CreateCategoryDto } from './dtos/createCategory.dto';

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
  async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.clientAdminBackend.emit(
      'criar-categoria',
      createCategoryDto,
    );
  }

  @Get()
  getHello(): string {
    return 'Hello World API GATEWAY';
  }
}
