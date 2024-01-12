<template>
  <router-view/>
</template>

<style lang="scss">
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

* {
  box-sizing: border-box;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
}

.hidden-disable {
  pointer-events: none;
  user-select: none;
}
</style>