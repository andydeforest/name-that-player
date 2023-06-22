import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from './entities/player.entity';
import { Repository, Brackets } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async findOne(id: string): Promise<Player | null> {
    return this.playerRepository.findOneByOrFail({ id });
  }

  async search(query: string): Promise<Player[]> {
    return await this.playerRepository
      .createQueryBuilder()
      .where('name ILIKE :query', { query: `%${query}%` })
      .getMany();
  }

  async getRandom(
    difficulty: 'normal' | 'hard',
    start?: string,
    end?: string,
    team?: string,
  ): Promise<Player | null> {
    const queryBuilder = this.playerRepository.createQueryBuilder().select();

    const after = new Date(Number.parseInt(start), 0, 1);
    const before = new Date(Number.parseInt(end), 0, 1);

    queryBuilder
      .andWhere('"debut" >= :after', { after })
      .andWhere('"debut" <= :before', { before });

    // the player has an allstar appearahce
    if (difficulty === 'normal') {
      queryBuilder.andWhere('"allstarAppearances" IS NOT NULL');
    }

    if (team && team.length === 3) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where(`("battingStats"->'career') @> :battingTeam`, {
            battingTeam: JSON.stringify([{ team }]),
          }).orWhere(`("pitchingStats"->'career') @> :pitchingTeam`, {
            pitchingTeam: JSON.stringify([{ team }]),
          });
        }),
      );
    }

    const players = await queryBuilder.getMany();

    if (!players.length) {
      // if the given criteria was unable to locate a player,
      // strip all criteria and try again
      return this.getRandom('normal', start, end);
    }

    // shuffle the results
    return players
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value)[0];
  }
}
