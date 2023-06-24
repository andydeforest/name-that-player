import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('player')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @Get('search')
  search(@Query('q') q: string) {
    return this.playerService.search(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.playerService.findOne(id);
  }

  @Get('')
  async findRandom(
    @Query('difficulty') difficulty: 'easy' | 'normal' | 'hard',
    @Query('team') team: string,
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('counting') counting: string,
  ) {
    difficulty = ['easy', 'normal', 'hard'].includes(difficulty)
      ? difficulty
      : 'normal';

    if (!start) {
      start = '2002';
    }

    if (!end) {
      end = '2022';
    }

    let pool = await this.playerService.getPool(difficulty, start, end, team);

    if (counting && counting.toLowerCase() === 'true') {
      return pool.length;
    }

    if (!pool.length) {
      pool = await this.playerService.getPool('normal', '2002', '2022');
    }

    return pool[0];
  }
}
