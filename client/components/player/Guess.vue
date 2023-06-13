<template>
  <div class="player-guess">
    <el-autocomplete
      :loading="true"
      v-model="search"
      :disabled="loading"
      :fetch-suggestions="searchItems"
      placeholder="Who am I? Type here..."
      @select="handleSelection"
    />
    <el-button-group class="ml-4">
      <el-button v-if="!loading" type="danger" @click="$emit('handle-reveal', false)">I Give Up!</el-button>
      <el-button v-if="selected !== null" type="primary" @click="submitAnswer">It's {{ selected.name }}!</el-button>
      <el-button v-if="selected !== null" type="primary" @click="selected = null">
        <BaseIcon icon="fa-solid fa-xmark" />
      </el-button>
  </el-button-group>
  </div>
</template>

<script lang="ts">
import { BaseballPlayer, PlayerSelect } from '~/types';

export default {
  emits: ['handle-guess', 'handle-reveal'],
  props: {
    loading: Boolean
  },
  data() {
    return {
      searchThreshold: 3,
      search: '',
      selected: null
    };
  },
  methods: {
    submitAnswer() {
      if (!this.selected) {
        console.error('Answer submitted without a valid selection');
        return;
      }
      this.$emit('handle-guess', this.selected);
      this.selected = null;
    },
    handleSelection(item: PlayerSelect) {
      this.selected = item.player;
      this.search = '';
    },
    async searchItems(queryString: string, cb: (arg: any) => void) {
      if (this.search.length < this.searchThreshold) {
        cb([]);
        return;
      }
      const results: BaseballPlayer[] = await useApi(`player/search?q=${encodeURI(queryString)}`).get();
      const formatted = [];

      for(const player of results) {
        formatted.push({
          value: player.name + (player.sharesName ? ` (${new Date(player.debut).getFullYear()} - ${new Date(player.lastAppearance).getFullYear()})` : ''),
          player
        })
      }
      cb(formatted);
    }
  }
};
</script>

<style lang="scss">
:root {
  --guess-border-color: #000;
}

.player-guess {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  @include breakpoint(medium) {
    justify-self: flex-end;
    flex-direction: row;

    > div {
      display: flex;
    }
  }
}
</style>
