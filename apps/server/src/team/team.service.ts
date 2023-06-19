import { Team } from './entities/team.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
  ) {}

  findAll() {
    return this.teamRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} team`;
  }
}
