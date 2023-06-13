<template>
  <div class="game">
    <div>
      <div class="game__interface">
        <div v-if="!reveal.showing" class="game__interface--top">
          <PlayerGuess :loading="loading" @handle-guess="handleGuess" @handle-reveal="handleReveal" />
          <GameOptions />
        </div>
        <div v-else class="game__interface--top">
          <span>Answer: <strong><a :href="baseballReferenceUrl" target="_blank">{{ player.name }}</a></strong></span>
          <el-button type="primary" @click="loadPlayer">Restart</el-button>
        </div>
        <Player v-if="!loading && player" :player="player" />
        <div v-else>
          Loading...
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseballPlayer } from '~/types';
import { ElMessage } from 'element-plus'

export default {
  data() {
    return {
      difficulty: 'normal',
      loading: true,
      reveal: {
        showing: false,
        won: false
      },
      player: {} as BaseballPlayer,
      guesses: [] as BaseballPlayer[],
      options: useOptions()
    };
  },
  async mounted() {
    this.loadPlayer();
  },
  methods: {
    async loadPlayer() {
      this.loading = true;
      this.reveal.showing = false;
      this.guesses = [];
      try {
        let urlStr = `player?difficulty=${this.options.difficulty}`

        if (this.options.mode === 'team') {
          urlStr += `&team=${this.options.team}`;
        }

        const res = await useApi(urlStr).get();
        this.player = res as BaseballPlayer;
      } catch (error) {
        // Handle the error appropriately
      } finally {
        this.loading = false;
      }
    },
    handleReveal(success: boolean) {
      this.reveal.showing = true;
      this.reveal.won = success;
    },
    handleGuess(guess: BaseballPlayer) {
      this.guesses.push(guess);
      if (guess.id.toLowerCase() === this.player.id.toLowerCase()) {
        this.reveal.showing = true;
        this.reveal.won = true;
        ElMessage({
          message: `Winner! It's ${guess.name}`,
          type: 'success',
          offset: 32
        });
      } else {
        ElMessage({
          message: `Nope, not ${guess.name}`,
          type: 'warning',
          offset: 32
        });
      }
    }
  },
  computed: {
    baseballReferenceUrl() {
      if (Object.keys(this.player).length === 0) {
        return '';
      }
      return `https://www.baseball-reference.com/players/${this.player.id.substring(0, 1)}/${this.player.id}.shtml`;
    }
  },
  watch: {
    'options.difficulty': {
      handler() {
        this.loadPlayer();
      }
    },
    'options.team': {
      handler() {
        this.loadPlayer();
      }
    }
  }
};
</script>

<style lang="scss">
.game {
  &__interface {
    > div {
      margin: 2rem 0;
    }

    &--top {
      display: flex;
      flex-direction: column-reverse;
      gap: var(--base-gap);
      font-size: 2rem;
      align-items: center;

      .el-button-group {
        align-self: center;
      }

      @include breakpoint(medium) {
        flex-direction: row;
        align-content: center;
      }
    }
  }
}
</style>
