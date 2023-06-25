<template>
  <div class="game-options">
    <el-button type="primary" @click="optionsDialogOpen = true"
      >Options</el-button
    >
    <client-only>
      <el-dialog
        v-model="optionsDialogOpen"
        title="Game Options"
        :width="dialogWidth"
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
              <h4>Player Type</h4>
            </div>
            <div>
              <el-radio-group v-model="options.difficulty">
                <el-radio-button label="easy"> Hall of Famers </el-radio-button>
                <el-radio-button label="normal"> All Stars </el-radio-button>
                <el-radio-button label="hard"> All </el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <template v-if="options.difficulty !== 'easy'">
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
          </template>
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
              <li v-if="options.difficulty !== 'easy'">
                Debuted between {{ options.dateRange[0] }} and
                {{ options.dateRange[1] }}
              </li>
              <li v-if="options.difficulty === 'easy'">
                Has been inducted into the Baseball Hall of Fame
              </li>
              <li v-else-if="options.difficulty === 'normal'">
                Played on at least 1 All Star team
              </li>
              <li>
                <i v-if="poolCheck.loading"
                  >Calculating estimaed player pool...</i
                >
                <span v-else>Estimated player pool: {{ poolCheck.value }}</span>
              </li>
            </ul>
            <div v-if="poolCheck.value && poolCheck.value <= 100">
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
      optionsCache: '' as string,
      teams: [] as TeamList[],
      loadingTeams: true as boolean,
      optionsDialogOpen: false as boolean,
      optionsToCheck: ['difficulty', 'mode', 'team', 'dateRange'],
      poolCheck: {
        value: null as null | number,
        loading: false as boolean,
        timer: null as null | NodeJS.Timeout,
      },
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
      this.countPlayerPool();
    } catch (error) {
    } finally {
      this.loadingTeams = false;
    }
  },
  methods: {
    stringifyOptions() {
      const options = {};
      this.optionsToCheck.forEach((opt) => {
        options[opt] = this.options[opt];
      });
      return JSON.stringify(options);
    },
    dialogOpened() {
      this.optionsCache = this.stringifyOptions();
    },
    dialogClosed() {
      if (this.stringifyOptions() !== this.optionsCache) {
        this.$emit('load-player');
      }
    },
    async countPlayerPool() {
      this.poolCheck.loading = true;
      clearTimeout(this.poolCheck.timer as NodeJS.Timeout);

      this.poolCheck.timer = setTimeout(async () => {
        const res = await useApi(
          `player?${this.options.urlParameters}&counting=true`,
        ).get();

        this.poolCheck.value = res as number;
        this.poolCheck.loading = false;
      }, 1000) as NodeJS.Timeout;
    },
  },
  computed: {
    dialogWidth() {
      if (this.$device.isMobile) {
        return '95%';
      } else if (this.$device.isTablet) {
        return '60%';
      }
      return '35%';
    },
  },
  watch: {
    options: {
      handler() {
        this.countPlayerPool();
      },
      deep: true,
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
