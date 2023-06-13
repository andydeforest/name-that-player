<template>
  <div class="game-options">
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
    <el-radio-group v-model="options.difficulty">
      <el-popover
        placement="top-start"
        title="Normal Mode"
        width="400"
        trigger="hover"
        content="Generates players who have appeared in at least 1 All Star Game in the last 25 years"
      >
        <template #reference>
          <el-radio-button label="normal"> Normal </el-radio-button>
        </template>
      </el-popover>
      <el-popover
        placement="top-start"
        title="Hard Mode"
        width="400"
        trigger="hover"
        content="Generates players who have appeared in at least 1 All Star Game ever (back to 1933)"
      >
        <template #reference>
          <el-radio-button label="hard"> Hard </el-radio-button>
        </template>
      </el-popover>
      <el-popover
        placement="top-start"
        title="Extreme Mode"
        width="400"
        trigger="hover"
        content="Generates any player who has appeared in at least 1 game ever. Good luck :)"
      >
        <template #reference>
          <el-radio-button label="extreme">
            Extreme
          </el-radio-button>
        </template>
      </el-popover>
    </el-radio-group>
  </div>
</template>

<script lang="ts">
import { Team } from "~/types";

export default {
  data() {
    return {
      options: useOptions(),
      teams: [],
      loadingTeams: true,
    };
  },
  async mounted() {
    this.loadingTeams = true;
    try {
      const res = (await useApi("team").get()) as Team[];
      res.forEach((team: Team) => {
        this.teams.push({
          value: team.name,
          label: team.name,
        });
      });
      this.teams.sort((a, b) => a.label.localeCompare(b.label));
    } catch (error) {
    } finally {
      this.loadingTeams = false;
    }
  },
};
</script>

<style lang="scss">
.el-popover.el-popper {
  word-break: keep-all;
}

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

  &__team {
    width: 100px;
    margin-left: 0.5rem;

    @include breakpoint(medium) {
    }
  }
}
</style>
