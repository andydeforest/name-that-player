export const useOptions = defineStore('options', {
  state: () => ({
    difficulty: 'normal',
    mode: 'random',
    team: null,
    dateRange: [2002, 2022],
  }),
  getters: {
    urlParameters(): string {
      return `difficulty=${this.difficulty}&start=${this.dateRange[0]}&end=${
        this.dateRange[1]
      }${this.mode === 'team' && this.team ? `&team=${this.team}` : ''}`;
    },
  },
});
