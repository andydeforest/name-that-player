export const useOptions = defineStore('options', {
  state: () => ({
    difficulty: 'normal',
    mode: 'random',
    team: null,
    dateRange: [2002, 2022],
  }),
});
