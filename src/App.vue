<template>
  <img class="logo" alt="farmOS logo" src="./assets/farmOS-logo.png">
  <CreatePreview/>
</template>

<script>
import CreatePreview from './components/CreatePreview.vue'

export default {
  name: 'App',
  components: {
    CreatePreview,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

img.logo {
  margin: auto;
  width: 50%;
}
</style>
