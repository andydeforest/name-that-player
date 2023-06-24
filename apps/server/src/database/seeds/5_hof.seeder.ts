import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';
import { Repository } from 'typeorm';

export default class HofSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo: Repository<Player> = dataSource.getRepository(Player);

    const rawData = readFileSync(path.join(__dirname, './data/hof.csv'));
    const csvData = rawData.toString();

    const parsed = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => results.data,
    });

    if (Array.isArray(parsed.data)) {
      for (const hof of parsed.data) {
        const player = await repo.findOneBy({ id: hof.playerID });

        if (!player || hof.inducted.toUpperCase() !== 'Y') {
          continue;
        }

        player.inductedToHof = true;
        await repo.save(player);
      }
    }
  }
}
