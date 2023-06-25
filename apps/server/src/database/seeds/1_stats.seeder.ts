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
        header: true,
        skipEmptyLines: true,
        complete: (results) => results.data,
      });

      if (Array.isArray(parsed.data)) {
        for (const stats of parsed.data) {
          const player = await repo.findOneBy({ id: stats.playerID });
          if (player && type === 'batting') {
            const atBats = Number.parseInt(stats['AB']);
            const hits = Number.parseInt(stats['H']);
            const doubles = Number.parseInt(stats['2B']);
            const triples = Number.parseInt(stats['3B']);
            const homeRuns = Number.parseInt(stats['HR']);
            const singles = hits - (triples + doubles + homeRuns);
            const walks = Number.parseInt(stats['BB']) ?? 0;
            const hitByPitch = Number.parseInt(stats['HBP']) ?? 0;
            const sacFlies = Number.parseInt(stats['SF']) ?? 0;

            const slugging =
              // eslint-disable-next-line prettier/prettier
              (singles + doubles * 2 + triples * 3 + homeRuns * 4) / atBats;

            const onBase =
              (hits + walks + hitByPitch) /
              (atBats + walks + hitByPitch + sacFlies);

            const battingStats: SeasonBattingStats = {
              year: Number.parseInt(stats['yearID']),
              stint: Number.parseInt(stats['stint']),
              team: stats['teamID'],
              league: stats['lgID'],
              games: stats['G'],
              battingAverage: hits / atBats,
              atBats,
              runs: stats['R'],
              hits,
              doubles,
              triples,
              homeRuns,
              runsBattedIn: stats['RBI'],
              stolenBases: stats['SB'],
              caughtStealing: stats['CS'],
              walks,
              strikeouts: stats['SO'],
              ibb: stats['IBB'],
              hitByPitch,
              sacHits: stats['SH'],
              sacFlies,
              gidp: stats['GIDP'],
              slugging,
              onBase,
            };
            if (player.battingStats === null) {
              player.battingStats = { career: [] };
            }
            player.battingStats.career.push(battingStats);
            await repo.save(player);
          } else if (player && type === 'pitching') {
            const pitchingStats: SeasonPitchingStats = {
              year: Number.parseInt(stats['yearID']),
              stint: Number.parseInt(stats['stint']),
              team: stats['teamID'],
              league: stats['lgID'],
              wins: stats['W'],
              losses: stats['L'],
              games: stats['G'],
              gamesStarted: stats['GS'],
              completeGames: stats['CG'],
              shutouts: stats['SHO'],
              saves: stats['SV'],
              inningsPitched: Number.parseFloat(stats['IPouts']) / 3,
              hits: stats['H'],
              earnedRuns: stats['ER'],
              homeRuns: stats['HR'],
              walks: stats['BB'],
              strikeouts: stats['SO'],
              opponentBattingAverage: stats['BAOpp'],
              era: stats['ERA'],
              ibb: stats['IBB'],
              wildPitches: stats['WP'],
              hitByPitch: stats['HBP'],
              balks: stats['BK'],
              gamesFinished: stats['GF'],
              runs: stats['R'],
              sacHits: stats['SH'],
              sacFlies: stats['SF'],
              gidp: stats['GIDP'],
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
