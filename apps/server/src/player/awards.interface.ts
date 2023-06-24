export interface SeasonAwards {
  award: string;
  year: number;
  league: string;
  tie: boolean;
  notes?: string;
}

export interface Awards {
  career: Array<SeasonAwards>;
}
