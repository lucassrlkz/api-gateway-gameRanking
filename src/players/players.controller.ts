import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Logger,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ClientProxyGameRanking } from '../proxyrmq/client-proxy';
import { Observable } from 'rxjs';
import { CreatePlayerDto } from './dtos/createPlayer.dto';
import { UpdatePlayerDto } from './dtos/updatePlayer.dto';
import { ValidationParamsPipe } from '../common/pipes/validation-params.pipe';

@Controller('jogadores')
export class PlayersController {
    private logger = new Logger(PlayersController.name);
    private clientAdminBackend;

    constructor(private clientProxyGameRanking: ClientProxyGameRanking) {
        this.clientAdminBackend =
            this.clientProxyGameRanking.getClientProxyAdminBackendInstance();
    }

    @Post()
    @UsePipes(ValidationPipe)
    async criarJogador(@Body() createPlayerDto: CreatePlayerDto) {
        this.logger.log(`criarJogadorDto: ${JSON.stringify(createPlayerDto)}`);

        const category = await this.clientAdminBackend.send(
            'consultar-categorias',
            createPlayerDto.category,
        );

        if (category) {
            await this.clientAdminBackend.emit(
                'criar-jogador',
                createPlayerDto,
            );
        } else {
            throw new BadRequestException(`Categoria não cadastrada!`);
        }
    }

    @Get()
    findPlayers(@Query('idJogador') _id: string): Observable<any> {
        return this.clientAdminBackend.send(
            'consultar-jogadores',
            _id ? _id : '',
        );
    }

    @Put('/:_id')
    @UsePipes(ValidationPipe)
    async updatePlayer(
        @Body() updatePlayerDto: UpdatePlayerDto,
        @Param('_id', ValidationParamsPipe) _id: string,
    ) {
        const categoria = await this.clientAdminBackend.send(
            'consultar-categorias',
            updatePlayerDto.category,
        );

        if (categoria) {
            await this.clientAdminBackend.emit('atualizar-jogador', {
                id: _id,
                updatePlayer: updatePlayerDto,
            });
        } else {
            throw new BadRequestException(`Categoria não cadastrada!`);
        }
    }

    @Delete('/:_id')
    async deletePlayer(@Param('_id', ValidationParamsPipe) _id: string) {
        await this.clientAdminBackend.emit('deletar-jogador', { _id });
    }
}
