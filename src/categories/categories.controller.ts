import {
    Body,
    Controller,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';

import { CreateCategoryDto } from './dtos/createCategory.dto';
import { UpdateCategoryDto } from './dtos/updateCategory.dto';
import { Observable } from 'rxjs';
import { ClientProxyGameRanking } from '../proxyrmq/client-proxy';

@Controller('categorias')
export class CategoriesController {
    private logger = new Logger(CategoriesController.name);
    private clientAdminBackend;

    constructor(private clientProxyGameRanking: ClientProxyGameRanking) {
        this.clientAdminBackend =
            this.clientProxyGameRanking.getClientProxyAdminBackendInstance();
    }

    @Get('')
    getRoot() {
        return JSON.stringify('Hello World! API GATEWAT WORKING');
    }

    @Post('categorias')
    @UsePipes(ValidationPipe)
    createCategory(@Body() createCategoryDto: CreateCategoryDto) {
        // por usar o emit do broker, não há necessidade de usar return na função
        this.clientAdminBackend.emit('criar-categoria', createCategoryDto);
    }

    @Get('categorias')
    findCategory(@Query('idCategory') _id: string): Observable<any> {
        return this.clientAdminBackend.send(
            'consultar-categorias',
            _id ? _id : '',
        );
    }
    @Put('categorias/:_id')
    @UsePipes(ValidationPipe)
    async updateCategory(
        @Param('_id') _id: string,
        @Body() updateCategoryDto: UpdateCategoryDto,
    ) {
        this.clientAdminBackend.emit('atualizar-categoria', {
            id: _id,
            updateCategory: updateCategoryDto,
        });
    }
}
