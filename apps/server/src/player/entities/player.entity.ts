import { PitchingStats } from './../pitchingStats.interface';
import { BattingStats } from './../battingStats.interface';
import { Awards } from './../awards.interface';
import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Player {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  bats: string;

  @Column()
  throws: string;

  @Column()
  debut: Date;

  @Column()
  lastAppearance: Date;

  @Column({ nullable: true })
  primarily: 'hitter' | 'pitcher';

  @Column({ nullable: true, type: 'simple-array' })
  allstarAppearances: number[];

  @Column({ default: false })
  sharesName: boolean;

  @Column({ default: false })
  hasWonMvp: boolean;

  @Column({ default: false })
  hasWonCya: boolean;

  @Column({ default: false })
  inductedToHof: boolean;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  battingStats: BattingStats;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  pitchingStats: PitchingStats;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  awards: Awards;
}
