<template>
  <div class="player">
    <div v-if="player.primarily === 'hitter'" class="player__stats">
      <div>
        <PlayerBattingStats :stats="player.battingStats" />
      </div>
      <div v-if="player.pitchingStats !== null">
        <PlayerPitchingStats :stats="player.pitchingStats" />
      </div>
    </div>
    <div v-else class="player__stats">
      <PlayerPitchingStats :stats="player.pitchingStats" />
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
      required: true
    }
  }
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
