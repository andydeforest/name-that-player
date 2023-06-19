import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { Player } from '../player/entities/player.entity';
import { Team } from '../team/entities/team.entity';

config();

const configService = new ConfigService();

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_DATABASE'),
  seeds: ['src/database/seeds/**/*{.ts,.js}'],
  entities: [Player, Team],
};

export const AppDataSource = new DataSource(options);
