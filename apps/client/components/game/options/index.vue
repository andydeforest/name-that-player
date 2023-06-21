<template>
  <div class="game-options">
    <el-button type="primary" @click="optionsDialogOpen = true"
      >Options</el-button
    >
    <client-only>
      <el-dialog
        v-model="optionsDialogOpen"
        title="Game Options"
        width="30%"
        @open="dialogOpened"
        @close="dialogClosed"
      >
        <div class="game-options__dialog">
          <div>
            <div>
              <h4>Game Mode</h4>
            </div>
            <div>
              <el-radio-group v-model="options.mode">
                <el-radio-button label="random"> Random </el-radio-button>

                <el-radio-button label="team"> Specific Team </el-radio-button>

                <el-select
                  v-if="options.mode === 'team'"
                  class="game-options__team"
                  v-model="options.team"
                  filterable
                  placeholder="Select a Team"
                  :loading="loadingTeams"
                >
                  <el-option
                    v-for="(team, x) in teams"
                    :key="x"
                    :label="team.label"
                    :value="team.value"
                  />
                </el-select>
              </el-radio-group>
            </div>
          </div>
          <div>
            <div>
              <h4>Difficulty</h4>
            </div>
            <div>
              <el-radio-group v-model="options.difficulty">
                <el-radio-button label="normal"> Normal </el-radio-button>
                <el-radio-button label="hard"> Hard </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <div>
            <h4>Played Between</h4>
          </div>
          <div>
            <el-slider
              v-model="options.dateRange"
              range
              show-input
              :min="1883"
              :max="2022"
            />
            <div class="center">
              {{ options.dateRange[0] }} - {{ options.dateRange[1] }}
            </div>
          </div>
          <div>
            The current rules are selected to generate players that:
            <ul class="game-options__dialog--rules">
              <li>
                Played on
                {{
                  options.mode === 'random'
                    ? 'any team'
                    : options.team
                    ? options.team
                    : 'a specific team'
                }}
              </li>
              <li>
                Debuted between {{ options.dateRange[0] }} and
                {{ options.dateRange[1] }}
              </li>
              <li v-if="options.difficulty === 'normal'">
                Played on at least 1 All Star team
              </li>
            </ul>
            <div
              v-if="
                options.dateRange[1] - options.dateRange[0] <= 5 &&
                options.difficulty === 'normal'
              "
            >
              <el-alert
                title="Making options too restrictive can make the potential player pool too small"
                type="warning"
              />
            </div>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="optionsDialogOpen = false">Done</el-button>
          </span>
        </template>
      </el-dialog>
    </client-only>
  </div>
</template>

<script lang="ts">
import { Team, TeamList } from '~/types';

export default {
  emits: ['load-player'],
  data() {
    return {
      options: useOptions(),
      optionsCache: '',
      teams: [] as TeamList[],
      loadingTeams: true,
      optionsDialogOpen: false,
    };
  },
  async mounted() {
    this.loadingTeams = true;
    try {
      const res = (await useApi('team').get()) as Team[];
      res.forEach((team: Team) => {
        this.teams.push({
          value: team.name,
          label: team.name,
        } as TeamList);
      });
      this.teams.sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
    } finally {
      this.loadingTeams = false;
    }
  },
  methods: {
    dialogOpened() {
      this.optionsCache = JSON.stringify(this.options);
    },
    dialogClosed() {
      if (JSON.stringify(this.options) !== this.optionsCache) {
        this.$emit('load-player');
      }
    },
  },
};
</script>

<style lang="scss">
.game-options {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  gap: var(--base-gap);

  @include breakpoint(medium) {
    flex-grow: 1;
    align-items: flex-end;
    flex-direction: row;

    > span {
      align-self: flex-start;
    }
  }

  .center {
    text-align: center;
  }

  &__team {
    width: 100px;
    margin-left: 0.5rem;
  }

  &__dialog,
  &__dialog > div {
    display: flex;
    flex-direction: column;
  }

  &__dialog {
    gap: var(--base-small-gap);

    &--rules {
      list-style-type: disc;
      margin-top: 1rem;

      > li {
        margin-left: 2rem;
        margin-bottom: 0.5rem;
      }
    }
  }
}
</style>
