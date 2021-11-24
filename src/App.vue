<template>
  <div id="nav">
    <router-link to="/" class="ui-section-header--nav-link">Home</router-link> |
    <a href="https://docs.farmos.org" role="link" aria-label="#" class="ui-section-header--nav-link">Documentation</a> |
    <router-link to="/about" class="ui-section-header--nav-link">About</router-link>
  </div>
  <img class="logo" alt="farmOS logo" src="./assets/farmOS-logo.png">
  <router-view/>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

img.logo {
  margin: auto;
  height: 50px;
}
</style>
