import { ServerService } from './server.service';
import { ServerController } from './server.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PlayerModule } from './player/player.module';
import { TeamModule } from './team/team.module';
import { Player } from './player/entities/player.entity';
import { Team } from './team/entities/team.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Player, Team],
      synchronize: true,
    }),
    PlayerModule,
    TeamModule,
  ],
  controllers: [ServerController],
  providers: [ServerService],
})
export class ServerModule {}
