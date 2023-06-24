<template>
  <div class="player">
    <div v-if="player.primarily === 'hitter'" class="player__stats">
      <div>
        <PlayerBattingStats :stats="player.battingStats" :awards="awards" />
      </div>
      <div v-if="player.pitchingStats !== null">
        <PlayerPitchingStats :stats="player.pitchingStats" />
      </div>
    </div>
    <div v-else class="player__stats">
      <PlayerPitchingStats :stats="player.pitchingStats" :awards="awards" />
      <div v-if="player.battingStats !== null">
        <PlayerBattingStats :stats="player.battingStats" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseballPlayer } from '~/types';

export default {
  props: {
    player: {
      type: Object as () => BaseballPlayer,
      required: true,
    },
  },
  computed: {
    awards() {
      const awards = {};

      // Process all-star appearances
      this.player.allstarAppearances?.forEach((year) => {
        const key = year.toString();
        awards[key] = awards[key] || [];
        awards[key].push('AS');
      });

      // Process career awards
      if (this.player.awards?.career?.length) {
        this.player.awards.career.forEach((award) => {
          const key = award.year.toString();
          awards[key] = awards[key] || [];
          awards[key].push(award.award);
        });
      }

      return awards;
    },
  },
};
</script>

<style lang="scss">
.player {
  &__stats {
    display: flex;
    flex-direction: column;
    gap: 5rem;
  }
}
</style>
