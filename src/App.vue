<template>
  <header>
    <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
        <img class="logo" alt="farmOS logo" src="./assets/farmOS-logo.png">
      </a>
      <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
        <router-link to="/" class="nav-link">Demo</router-link>
        <a href="https://docs.farmos.org" role="link" aria-label="#" class="nav-link">Documentation</a>
        <router-link to="/about" class="nav-link">About</router-link>
      </nav>
    </div>
  </header>

  <main class="flex-shrink-0">
    <router-view/>
  </main>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
.container {
  max-width: 1024px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

img.logo {
  height: 30px;
}
</style>
