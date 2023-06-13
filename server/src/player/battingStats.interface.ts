export interface SeasonBattingStats {
  year: number;
  stint: number;
  team: string;
  league: string;
  games: number;
  battingAverage: number;
  atBats: number;
  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  runsBattedIn: number;
  stolenBases: number;
  caughtStealing: number;
  walks: number;
  strikeouts: number;
  ibb: number;
  hitByPitch: number;
  sacHits: number;
  sacFlies: number;
  gidp: number;
  positions?: string[];
}

export interface BattingStats {
  career: Array<SeasonBattingStats>;
}
