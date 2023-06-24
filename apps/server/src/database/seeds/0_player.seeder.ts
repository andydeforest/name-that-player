import { readFileSync } from 'fs';
import { Player } from '../../player/entities/player.entity';
import { DataSource } from 'typeorm/data-source';
import { Seeder } from 'typeorm-extension';
import { parse } from 'papaparse';
import * as path from 'path';
import { Repository } from 'typeorm';

export default class PlayerSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repo: Repository<Player> = dataSource.getRepository(Player);

    // clear data
    repo.clear();

    const rawData = readFileSync(path.join(__dirname, './data/players.csv'));
    const csvData = rawData.toString();

    const parsed = await parse(csvData, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => results.data,
    });

    if (Array.isArray(parsed.data)) {
      for (const player of parsed.data) {
        const debut = player.debut;
        const last = player.finalGame;
        const id = player.playerID;
        const name = player.nameFirst + ' ' + player.nameLast;
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
        p.bats = player.bats;
        p.throws = player.throws;
        p.debut = new Date(player.debut);
        p.lastAppearance = new Date(player.finalGame);
        p.sharesName = sharesName;
        await repo.save(p);
      }
    }
  }
}
