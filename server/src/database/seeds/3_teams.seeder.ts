import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { Team } from '../../team/entities/team.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';
import { Repository } from 'typeorm';

export default class TeamSeader implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const playerRepo: Repository<Player> = dataSource.getRepository(Player);
    const teamRepo: Repository<Team> = dataSource.getRepository(Team);

    const rawData = readFileSync(path.join(__dirname, `./data/teams.csv`));
    const csvData = rawData.toString();

    // load teams into memory
    const parseTeams = await parse(csvData, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => results.data,
    });
    const teamsByYear = {};

    if (Array.isArray(parseTeams.data)) {
      for (const seasonTeam of parseTeams.data) {
        // store them in the db
        const team = await teamRepo.findBy({
          league: seasonTeam[1],
          name: seasonTeam[3],
        });

        if (!team.length) {
          // team does not exist, create it
          const t = new Team();
          t.league = seasonTeam[1];
          t.name = seasonTeam[3];
          await teamRepo.save(t);
        }

        const yearStr = seasonTeam[0];
        if (!teamsByYear[yearStr]) {
          teamsByYear[yearStr] = {};
        }
        const teamStr = seasonTeam[2];
        if (!teamsByYear[yearStr][teamStr]) {
          teamsByYear[yearStr][teamStr] = seasonTeam[3];
        }
      }
    }

    // itterate through all players, update their teams
    const all = await playerRepo.find();

    for (const player of all) {
      if (player.battingStats !== null) {
        for (const batting of player.battingStats.career) {
          if (teamsByYear[batting.year.toString()][batting.team]) {
            batting.team = teamsByYear[batting.year.toString()][batting.team];
          }
        }
      }
      if (player.pitchingStats !== null) {
        for (const pitching of player.pitchingStats.career) {
          if (teamsByYear[pitching.year.toString()][pitching.team]) {
            pitching.team =
              teamsByYear[pitching.year.toString()][pitching.team];
          }
        }
      }
      await playerRepo.save(player);
    }
  }
}
