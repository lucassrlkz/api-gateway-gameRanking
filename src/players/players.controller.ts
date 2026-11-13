import { Controller, Logger } from '@nestjs/common';
import { ClientProxyGameRanking } from '../proxyrmq/client-proxy';

@Controller('jogadores')
export class PlayersController {
    private logger = new Logger(PlayersController.name);
    private clientAdminBackend;

    constructor(private clientProxyGameRanking: ClientProxyGameRanking) {
        this.clientAdminBackend =
            this.clientProxyGameRanking.getClientProxyAdminBackendInstance();
    }
}
