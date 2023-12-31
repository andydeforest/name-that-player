<template>
  <BaseSection class="about-section">
    <div class="about-section__intro">
      <div>
        <h2>Welcome!</h2>
        <p>
          <i>Name That Player</i> is a baseball player guessing game based on
          historical season statistics. A user is presented with hitting and/or
          pitching statistics of a former or current MLB player, and must deduce
          who it is based on the provided data. Players are allowed unlimited
          tries at guessing thhe correct player.
        </p>
      </div>
      <div>
        <h2>Game Modes</h2>
        <p>
          There are a couple different ways to play. First, you can specify the
          player pool you'd like to generate from. This can either be
          <i>Random</i>, which generates players from throughout the league, or
          <i>Specific Team</i>, which, as the name implies, generates players
          from a specified team. Next is the difficulty setting:
        </p>
        <ul>
          <li>
            <strong>Hall of Famers:</strong> Generates players who have been
            inducted into the Baseball Hall of Fame. Because the HoF database we
            use has about 270 players right now, no additional filtering options
            are available for this mode, as it would make the player pool too
            small.
          </li>
          <li>
            <strong>All Stars:</strong> Generates players who have appeared in
            at least one All Star game, going back to when the ASG was
            inaugurated in 1933. These players should be challenging but
            solvable for hardcore baseball fans.
          </li>
          <li>
            <strong>All:</strong> Generates any player who has ever appeared in
            a Major League Baseball game, whether it was 1 at-bat or a 20-year
            career, dating back to 1871. The database sits around 20,300 right
            now. Good luck!
          </li>
        </ul>
        <p>
          Additionally, a <strong>Played Between</strong> slider is available,
          which lets you control the era players are generated from. For
          example, if the slider is set from 1985 to 2000, it will generate any
          players who debuted between those years, and not necessarily players
          whose careers began in or after 1985, and ended before or in 2000.
        </p>
      </div>
      <div>
        <h2>FAQ</h2>
        <div>
          <h4>Why are some of the Org acronyms outdated?</h4>
          <p>
            Some teams (ANA, FLA, TBD) have acronyms which are not necessarily
            up to date with the current acronyms of their respective
            organizations. The dataset used by this site relies on historical
            franchise data, which as far as I can tell, favors the original
            acronym of some franchises. I hope to have this rectified soon.
          </p>
          <h4>
            Why are there no statistics for {{ new Date().getFullYear() }}?
          </h4>
          <p>
            The dataset used only features complete season stats, so if a season
            is still underway, the statistics will not be available until it has
            concluded. Furthermore, some awards for the previous season might
            not be available in the dataset yet.
          </p>
          <h4>Where do you get your data from? Are you sure it's accurate?</h4>
          <p>
            Data is kindly provided for free by
            <a
              href="https://github.com/chadwickbureau/baseballdatabank/"
              target="_blank"
              >Baseball Databank</a
            >
            under the Creative Commons Attribution-ShareAlike 3.0 Unported
            License. While the overall integrity of the data is high, there
            still may be some errors.
          </p>
        </div>
      </div>
    </div>
  </BaseSection>
</template>

<style lang="scss">
.about-section {
  &__intro {
    display: flex;
    flex-direction: column;
    gap: var(--base-gap);

    > div {
      display: flex;
      flex-direction: column;
      gap: var(--base-small-gap);

      > ul {
        margin-left: 2rem;
        list-style: outside;
        font-size: var(--paragraph-font-size);

        > li {
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
