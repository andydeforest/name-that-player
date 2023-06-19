import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';

export default class AllstarSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(Player);

    const rawData = readFileSync(path.join(__dirname, `./data/allstars.csv`));
    const csvData = rawData.toString();

    const parsed = await parse(csvData, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => results.data,
    });

    if (Array.isArray(parsed.data)) {
      for (const allstar of parsed.data) {
        const player = await repo.findOneBy({ id: allstar[0] });

        if (!player) {
          continue;
        }

        if (player.allstarAppearances === null) {
          player.allstarAppearances = [];
        }
        player.allstarAppearances.push(Number.parseInt(allstar[1]));
        await repo.save(player);
      }
    }
  }
}
