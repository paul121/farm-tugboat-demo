<template>
  <header>
    <nav class="navbar navbar-expand-md fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">
          <img class="logo" alt="farmOS logo" src="./assets/farmOS-logo.png">
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="d-flex justify-content-end collapse navbar-collapse" id="navbarCollapse">
          <div class=" navbar-nav">
            <router-link to="/" class="nav-link">Home</router-link>
            <a href="https://docs.farmos.org" role="link" aria-label="#" class="nav-link">Documentation</a>
            <router-link to="/about" class="nav-link">About</router-link>
          </div>
        </div>
      </div>
      <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
      </a>

      <div class="d-flex">
      </div>
    </nav>
  </header>

  <main class="flex-shrink-0">
    <div class="container">
      <router-view/>
    </div>
  </main>
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

main > .container {
  padding: 60px 15px 0;
}

img.logo {
  height: 30px;
}
</style>
