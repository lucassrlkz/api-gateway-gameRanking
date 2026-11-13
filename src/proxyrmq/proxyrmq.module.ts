import { Module } from '@nestjs/common';
import { ClientProxyGameRanking } from './client-proxy';

@Module({
    providers: [ClientProxyGameRanking],
    exports: [ClientProxyGameRanking],
})
export class ProxyRMQModule {}
