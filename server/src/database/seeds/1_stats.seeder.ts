import { SeasonPitchingStats } from './../../player/pitchingStats.interface';
import { SeasonBattingStats } from './../../player/battingStats.interface';
import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';
import { Repository } from 'typeorm';

export default class StatsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo: Repository<Player> = dataSource.getRepository(Player);

    for (const type of ['batting', 'pitching']) {
      const rawData = readFileSync(path.join(__dirname, `./data/${type}.csv`));
      const csvData = rawData.toString();

      const parsed = await parse(csvData, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => results.data,
      });

      if (Array.isArray(parsed.data)) {
        for (const stats of parsed.data) {
          const player = await repo.findOneBy({ id: stats[0] });
          if (player && type === 'batting') {
            let index = 1;
            const battingStats: SeasonBattingStats = {
              year: Number.parseInt(stats[index++]),
              stint: Number.parseInt(stats[index++]),
              team: stats[index++],
              league: stats[index++],
              games: stats[index++],
              battingAverage:
                Number.parseInt(stats[8]) / Number.parseInt(stats[6]),
              atBats: stats[index++],
              runs: stats[index++],
              hits: stats[index++],
              doubles: stats[index++],
              triples: stats[index++],
              homeRuns: stats[index++],
              runsBattedIn: stats[index++],
              stolenBases: stats[index++],
              caughtStealing: stats[index++],
              walks: stats[index++],
              strikeouts: stats[index++],
              ibb: stats[index++],
              hitByPitch: stats[index++],
              sacHits: stats[index++],
              sacFlies: stats[index++],
              gidp: stats[index++],
            };
            if (player.battingStats === null) {
              player.battingStats = { career: [] };
            }
            player.battingStats.career.push(battingStats);
            await repo.save(player);
          } else if (player && type === 'pitching') {
            let index = 1;
            const pitchingStats: SeasonPitchingStats = {
              year: Number.parseInt(stats[index++]),
              stint: Number.parseInt(stats[index++]),
              team: stats[index++],
              league: stats[index++],
              wins: stats[index++],
              losses: stats[index++],
              games: stats[index++],
              gamesStarted: stats[index++],
              completeGames: stats[index++],
              shutouts: stats[index++],
              saves: stats[index++],
              inningsPitched: Number.parseFloat(stats[index++]) / 3,
              hits: stats[index++],
              earnedRuns: stats[index++],
              homeRuns: stats[index++],
              walks: stats[index++],
              strikeouts: stats[index++],
              opponentBattingAverage: stats[index++],
              era: stats[index++],
              ibb: stats[index++],
              wildPitches: stats[index++],
              hitByPitch: stats[index++],
              balks: stats[index++],
              gamesFinished: stats[25],
              runs: stats[26],
              sacHits: stats[27],
              sacFlies: stats[28],
              gidp: stats[29],
            };
            if (player.pitchingStats === null) {
              player.pitchingStats = { career: [] };
            }
            player.pitchingStats.career.push(pitchingStats);
            await repo.save(player);
          }
        }
      }
    }

    // delete players who have no batting or pitching stats. these are usually rookies, or players who have only appeared in the postseason (im looking at you, mark kiger)
    await repo
      .createQueryBuilder()
      .delete()
      .where('"battingStats" IS NULL')
      .andWhere('"pitchingStats" IS NULL')
      .execute();

    // itterate through all players, set their primary position as pitcher or hitter
    const all = await repo.find();

    for (const player of all) {
      // we sum games as a pitcher, and games as a hitter to make the distinction
      let inningsPitched = 0;
      let atBats = 0;

      if (player.battingStats !== null) {
        for (const batting of player.battingStats.career) {
          atBats += Number.parseInt(String(batting.atBats));
        }
      }
      if (player.pitchingStats !== null) {
        for (const pitching of player.pitchingStats.career) {
          inningsPitched += Number.parseInt(String(pitching.inningsPitched));
        }
      }
      // games are equal? take a guess
      if (atBats === inningsPitched) {
        player.primarily = Math.random() > 0.5 ? 'hitter' : 'pitcher';
      } else {
        player.primarily = atBats > inningsPitched ? 'hitter' : 'pitcher';
      }
      await repo.save(player);
    }
  }
}
