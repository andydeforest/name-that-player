import { PitchingStats } from './../pitchingStats.interface';
import { BattingStats } from './../battingStats.interface';
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
}
