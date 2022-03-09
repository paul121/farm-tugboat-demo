<template>
  <header>
    <div class="d-flex flex-column flex-md-row align-items-center pb-3 mb-4 border-bottom">
      <a href="/" class="d-flex align-items-center text-dark text-decoration-none">
        <img class="logo" alt="farmOS logo" :src="require('@/assets/icon/ROLLING_HILLS-AnneDigges.svg')">
        &nbsp; farmOS/Demo
      </a>
      <nav class="d-inline-flex mt-2 mt-md-0 ms-md-auto">
        <a href="https://farmos.org" role="link" aria-label="farmOS.org" class="nav-link">farmOS.org</a>
      </nav>
    </div>
  </header>

  <main class="flex-shrink-0">
    <router-view/>
  </main>

  <footer class="pt-5 my-md-5 pt-md-5 border-top">
    <div class="row"> 
      <div class="col-12 col-md">
        <h6>Provided by <a href="https://rootedsolutions.io"><img class="rs-logo" alt="roooted solutions logo" :src="require('@/assets/rs_logo.png')"></a></h6>
        <h6>Powered by <a href="https://tugboat.qa"><img class="tugboat-logo" alt="Tugboat logo" :src="require('@/assets/tugboat_logo.svg')"></a></h6>
        <h6>Icons by <a href="https://www.thelexicon.org/foodicons/">The Foodicons Collection</a></h6>
      </div> 
      <div class="col-6 col-md">
        <a href="https://farmos.org"><img class="farmos-logo" alt="farmos-logo" :src="require('@/assets/farmOS-logo.png')"></a>
        <ul class="list-unstyled text-small">
          <li class="mb-1"><a href="https://farmos.org/guide/">User Guide</a></li>
          <li class="mb-1"><a href="https://farmos.org/donate/">Donate</a></li>
          <li class="mb-1"><a href="https://farmos.discourse.group/">Forum</a></li>
          <li class="mb-1"><a href="https://riot.im/app/#/room/#farmOS:matrix.org">Chat</a></li>
        </ul>
      </div>
      <div class="col-6 col-md">
        <h5>About</h5>
        <ul class="list-unstyled text-small">
          <li class="mb-1"><a class="link-secondary text-decoration-none" href="https://github.com/paul121/farm-tugboat-demo/issues/new">Report an issue</a></li>
          <li class="mb-1"><a class="link-secondary text-decoration-none" href="https://github.com/paul121/farm-tugboat-demo">Source code</a></li>
        </ul>
      </div>
    </div>
  </footer>
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

#app main {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

img.rs-logo {
  height: 3em;
}

img.tugboat-logo {
  height: 2em;
}

img.farmos-logo {
  height: 2em;
  margin-bottom: 1em;
}

footer h5 a{
  color: var(--bs-body-color);
}

footer h6 {
  margin-bottom: 1em;
  font-weight: normal;
}

footer a {
  text-decoration: none!important;
  color: #6c757d;
}
</style>
