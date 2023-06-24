<template>
  <div class="game">
    <div>
      <div class="game__interface">
        <div class="game__interface--top">
          <PlayerGuess
            v-if="!reveal.showing"
            :loading="loading"
            @handle-guess="handleGuess"
            @handle-reveal="handleReveal"
          />
          <template v-else>
            <div class="game__interface--reveal">
              Answer:
              <strong>
                <a :href="baseballReferenceUrl" target="_blank">{{
                  player.name
                }}</a>
              </strong>
            </div>
            <el-button type="primary" @click="loadPlayer">Restart</el-button>
          </template>
          <GameOptions @load-player="loadPlayer" />
        </div>
        <Player v-if="!loading && player" :player="player" />
        <div v-else class="game__interface--loading">
          <UILoader />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { BaseballPlayer } from '~/types';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      difficulty: 'normal',
      loading: true,
      reveal: {
        showing: false,
        won: false,
      },
      player: {} as BaseballPlayer,
      guesses: [] as BaseballPlayer[],
      options: useOptions(),
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
        const res = await useApi(`player?${this.options.urlParameters}`).get();
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
          offset: 32,
        });
      } else {
        ElMessage({
          message: `Nope, not ${guess.name}`,
          type: 'warning',
          offset: 32,
        });
      }
    },
  },
  computed: {
    baseballReferenceUrl() {
      if (Object.keys(this.player).length === 0) {
        return '';
      }
      return `https://www.baseball-reference.com/players/${this.player.id.substring(
        0,
        1,
      )}/${this.player.id}.shtml`;
    },
  },
};
</script>

<style lang="scss">
.game {
  &__interface {
    > div {
      margin: 2rem 0;
    }

    &--loading {
      display: flex;
      justify-content: center;
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

    &--reveal {
      font-size: 22px;
    }
  }
}
</style>
