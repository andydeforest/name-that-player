export interface SeasonPitchingStats {
  year: number;
  stint: number;
  team: string;
  league: string;
  wins: number;
  losses: number;
  games: number;
  gamesStarted: number;
  completeGames: number;
  shutouts: number;
  saves: number;
  inningsPitched: number;
  hits: number;
  earnedRuns: number;
  homeRuns: number;
  walks: number;
  strikeouts: number;
  opponentBattingAverage: number;
  era: number;
  ibb: number;
  wildPitches: number;
  hitByPitch: number;
  balks: number;
  gamesFinished: number;
  runs: number;
  sacHits: number;
  sacFlies: number;
  gidp: number;
}

export interface PitchingStats {
  career: Array<SeasonPitchingStats>;
}
