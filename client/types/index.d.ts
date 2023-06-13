// renamed from Player as it was conflicting with the player/ directory auto-imports
export interface BaseballPlayer {
  id: string;
  name: string;
  sharesName: boolean;
  bats: string;
  throws: string;
  debut: Date;
  lastAppearance: Date;
  primarily: string;
  allstarAppearances: number[];
  battingStats: Object[];
  pitchingStats: Object[];
}

export interface SeasonBattingStats {
  year: number;
  stint: number;
  team: string;
  league: string;
  games: number;
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
  battingAverage: number;
  ibb: number;
  hitByPitch: number;
  sacHits: number;
  sacFlies: number;
  gidp: number;
}

export interface BattingStats {
  career: Array<SeasonBattingStats>;
}

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

export interface PlayerSelect {
  value: string;
  player: BaseballPlayer;
}

export interface Team {
  id: number;
  league: string;
  name: string;
}