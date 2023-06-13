import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';

export default class PlayerSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo = dataSource.getRepository(Player);

    // clear data
    repo.clear();

    const rawData = readFileSync(path.join(__dirname, './data/players.csv'));
    const csvData = rawData.toString();

    const parsed = await parse(csvData, {
      header: false,
      skipEmptyLines: true,
      complete: (results) => results.data,
    });

    if (Array.isArray(parsed.data)) {
      for (const player of parsed.data) {
        const debut = player[20];
        const last = player[21];
        const id = player[0];
        const name = player[13] + ' ' + player[14];
        let sharesName = false;

        if (!debut.length || !last.length) {
          continue;
        }

        const othersWithName = await repo.findBy({ name });

        if (othersWithName.length) {
          sharesName = true;

          for (const otherPlayer of othersWithName) {
            otherPlayer.sharesName = true;
            await repo.save(otherPlayer);
          }
        }

        const p = new Player();
        p.id = id;
        p.name = name;
        p.bats = player[18];
        p.throws = player[19];
        p.debut = new Date(player[20]);
        p.lastAppearance = new Date(player[21]);
        p.sharesName = sharesName;
        await repo.save(p);
      }
    }
  }
}
