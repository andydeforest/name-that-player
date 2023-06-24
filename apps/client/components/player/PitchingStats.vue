<template>
  <div class="player-stats">
    <h2>Pitching Stats</h2>
    <div class="stats-table">
      <table>
        <thead>
          <tr>
            <th>Yr</th>
            <th>Org</th>
            <th>LG</th>
            <th>W</th>
            <th>L</th>
            <th>G</th>
            <th>GS</th>
            <th>CG</th>
            <th>SHO</th>
            <th>SV</th>
            <th>IP</th>
            <th>H</th>
            <th>ER</th>
            <th>HR</th>
            <th>BB</th>
            <th>SO</th>
            <th>Opp BA</th>
            <th>ERA</th>
            <th>IBB</th>
            <th>WP</th>
            <th>HBP</th>
            <th>BK</th>
            <th>GF</th>
            <th>R</th>
            <th>SH</th>
            <th>SF</th>
            <th>GIDP</th>
            <th v-if="Object.keys(awards).length">Awards</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(year, x) in stats.career" :key="x">
            <td>{{ year.year }}</td>
            <td>{{ year.team }}</td>
            <td>{{ year.league }}</td>
            <td>{{ year.wins }}</td>
            <td>{{ year.losses }}</td>
            <td>{{ year.games }}</td>
            <td>{{ year.gamesStarted }}</td>
            <td>{{ year.completeGames }}</td>
            <td>{{ year.shutouts }}</td>
            <td>{{ year.saves }}</td>
            <td>{{ formatIp(year.inningsPitched) }}</td>
            <td>{{ year.hits }}</td>
            <td>{{ year.earnedRuns }}</td>
            <td>{{ year.homeRuns }}</td>
            <td>{{ year.walks }}</td>
            <td>{{ year.strikeouts }}</td>
            <td>
              .{{
                (year.opponentBattingAverage * 1000).toFixed(0).padStart(3, '0')
              }}
            </td>
            <td>{{ year.era }}</td>
            <td>{{ year.ibb }}</td>
            <td>{{ year.wildPitches }}</td>
            <td>{{ year.hitByPitch }}</td>
            <td>{{ year.balks }}</td>
            <td>{{ year.gamesFinished }}</td>
            <td>{{ year.runs }}</td>
            <td>{{ year.sacHits }}</td>
            <td>{{ year.sacFlies }}</td>
            <td>{{ year.gidp }}</td>
            <td v-if="Object.keys(awards).length">
              <strong
                v-if="
                  Object.hasOwn(awards, year.year.toString()) &&
                  year.stint === 1
                "
              >
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
import { PitchingStats } from '~/types';

export default {
  props: {
    stats: {
      type: Object as () => PitchingStats,
      required: true,
    },
    awards: {
      type: Object,
      default: {},
    },
  },
  methods: {
    formatIp(inningsPitched: number): string {
      let ip = Math.floor(inningsPitched);
      const remainder = parseFloat((inningsPitched - ip).toFixed(1));
      if (remainder === 0.3) {
        ip += 0.1;
      } else if (remainder === 0.7) {
        ip += 0.2;
      }
      return ip.toFixed(1);
    },
  },
};
</script>
