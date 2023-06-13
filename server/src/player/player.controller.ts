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
  findRandom(
    @Query('difficulty') difficulty: 'normal' | 'hard' | 'extreme',
    @Query('team') team: string,
  ) {
    difficulty = ['normal', 'hard', 'extreme'].includes(difficulty)
      ? difficulty
      : 'normal';

    return this.playerService.getRandom(difficulty, team);
  }
}
