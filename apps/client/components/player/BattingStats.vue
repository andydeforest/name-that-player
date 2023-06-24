<template>
  <div class="player-stats">
    <h2>Batting Stats</h2>
    <div class="stats-table">
      <table>
        <thead>
          <tr>
            <th>Yr</th>
            <th>Org</th>
            <th>LG</th>
            <th>G</th>
            <th>AB</th>
            <th>BA</th>
            <th>R</th>
            <th>H</th>
            <th>2B</th>
            <th>3B</th>
            <th>HR</th>
            <th>RBI</th>
            <th>SB</th>
            <th>CS</th>
            <th>BB</th>
            <th>SO</th>
            <th>IBB</th>
            <th>HBP</th>
            <th>SH</th>
            <th>SF</th>
            <th>GIDP</th>
            <th>OBP</th>
            <th>SLG</th>
            <th>OPS</th>
            <th v-if="Object.keys(awards).length">Awards</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(year, x) in stats.career" :key="x">
            <td>{{ year.year }}</td>
            <td>{{ year.team }}</td>
            <td>{{ year.league }}</td>
            <td>{{ year.games }}</td>
            <td>{{ year.atBats }}</td>
            <td>{{ formatAverage(year.battingAverage) }}</td>
            <td>{{ year.runs }}</td>
            <td>{{ year.hits }}</td>
            <td>{{ year.doubles }}</td>
            <td>{{ year.triples }}</td>
            <td>{{ year.homeRuns }}</td>
            <td>{{ year.runsBattedIn }}</td>
            <td>{{ year.stolenBases }}</td>
            <td>{{ year.caughtStealing }}</td>
            <td>{{ year.walks }}</td>
            <td>{{ year.strikeouts }}</td>
            <td>{{ year.ibb }}</td>
            <td>{{ year.hitByPitch }}</td>
            <td>{{ year.sacHits }}</td>
            <td>{{ year.sacFlies }}</td>
            <td>{{ year.gidp }}</td>
            <td>{{ formatAverage(year.onBase) }}</td>
            <td>{{ formatAverage(year.slugging) }}</td>
            <td>{{ formatOps(year.onBase + year.slugging) }}</td>
            <td v-if="Object.keys(awards).length">
              <strong v-if="Object.hasOwn(awards, year.year.toString())">
                {{ awards[year.year.toString()].join(', ') }}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { BattingStats, Awards } from '~/types';

export default {
  props: {
    stats: {
      type: Object as () => BattingStats,
      required: true,
    },
    awards: {
      type: Object,
      default: {},
    },
  },
  methods: {
    formatAverage(average: number): string {
      return `.${(average * 1000).toFixed(0).padStart(3, '0')}`;
    },
    formatOps(ops: number): string {
      if (ops < 1) {
        return this.formatAverage(ops);
      }
      return `${ops.toFixed(3)}`;
    },
  },
};
</script>
