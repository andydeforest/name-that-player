import { SeasonAwards } from '../../player/awards.interface';
import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';
import { Repository } from 'typeorm';

export default class AwardSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo: Repository<Player> = dataSource.getRepository(Player);

    const rawData = readFileSync(path.join(__dirname, './data/awards.csv'));
    const csvData = rawData.toString();

    const parsed = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => results.data,
    });

    if (Array.isArray(parsed.data)) {
      for (const award of parsed.data) {
        const awardName = award['awardID'];

        const awardsWeCareAbout = [
          { label: 'World Series MVP', abbreviation: 'WS MVP' },
          { label: 'Cy Young Award', abbreviation: 'CYA' },
          { label: 'Gold Glove', abbreviation: 'GG' },
          { label: 'Most Valuable Player', abbreviation: 'MVP' },
          { label: 'Silver Slugger', abbreviation: 'SS' },
          { label: 'NLCS MVP', abbreviation: 'NLCS MVP' },
          { label: 'ALCS MVP', abbreviation: 'ALCS MVP' },
          { label: 'Rookie of the Year', abbreviation: 'ROTY' },
          { label: 'Pitching Triple Crown', abbreviation: '3C - P' },
          { label: 'Triple Crown', abbreviation: '3C' },
        ];

        const validAward = awardsWeCareAbout.some(
          (award) => award.label === awardName,
        );

        const matchingAward = awardsWeCareAbout.find(
          (award) => award.label === awardName,
        );

        if (!validAward || !matchingAward) {
          continue;
        }

        const player = await repo.findOneBy({ id: award.playerID });

        if (!player) {
          continue;
        }

        const awardObj: SeasonAwards = {
          award: matchingAward.abbreviation,
          year: Number.parseInt(award['yearID']),
          league: award['lgID'],
          tie: award['tie'].length && award['tie'].toUpperCase() === 'Y',
          notes:
            award['notes'] && award['notes'].length ? award['notes'] : null,
        };

        if (player.awards === null) {
          player.awards = { career: [] };
        }

        if (awardName === 'Most Valuable Player') {
          player.hasWonMvp = true;
        }

        if (awardName === 'Cy Young Award') {
          player.hasWonCya = true;
        }

        player.awards.career.push(awardObj);
        await repo.save(player);
      }
    }
  }
}
