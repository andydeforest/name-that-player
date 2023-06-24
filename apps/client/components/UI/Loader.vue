<template>
  <div class="ui-loader">
    <img src="/baseball.png" />
    <div>Loading...</div>
  </div>
</template>

<style lang="scss">
.ui-loader {
  display: flex;
  flex-direction: column;
  margin-top: 10rem;
  text-align: center;

  img {
    height: 64px;
    width: 64px;
    animation: rotate 1.5s infinite linear;
    margin-bottom: 2rem;
  }

  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
