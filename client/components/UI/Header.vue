<template>
  <header class="ui-header">
    <div class="ui-header__title">
      Name <span>That</span> Player
    </div>
    <nav class="ui-header__nav">
      <ul>
        <li>
          <NuxtLink to="/">Home</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about">About</NuxtLink>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss">
.ui-header {
  background-color: var(--baseball-blue);
  height: var(--base-header-height);
  display: flex;
  gap: var(--base-gap);
  padding: 0 var(--base-container-margin);
  color: #fff;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 800;
  font-family: var(--heading-font-family);
  border-bottom: 2px solid var(--baseball-red);

  &__title {
    text-transform: uppercase;

    svg,
    > span {
      color: var(--baseball-red);
    }
  }

  &__nav {
    display: flex;
    flex-grow: 1;
    justify-content: flex-end;

    @include breakpoint(medium) {
      display: block;
      margin-left: var(--base-gap);
    }

    a {
      color: #fff;
    }

    > ul {
      display: flex;
      flex-direction: row;
      gap: var(--base-small-gap);
      padding-bottom: 0;

      > li {
        display: flex;

        &:not(:last-of-type)::after {
          color: #aaa;
          margin-left: var(--base-small-gap);
          content: "|";
        }
      }
    }
  }
}
</style>
