import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxyRMQModule } from './proxyrmq/proxyrmq.module';
import { ClientProxyGameRanking } from './proxyrmq/client-proxy';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        ProxyRMQModule,
        CategoriesModule,
        PlayersModule,
    ],
    controllers: [],
    providers: [ClientProxyGameRanking],
})
export class AppModule {}
