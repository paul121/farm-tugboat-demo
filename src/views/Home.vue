<template>
  <div class="p-3 pb-md-4 mx-auto text-center">
    <h1 class="display-4 fw-normal">Demo farmOS</h1>
    <p class="fs-5 mb-0 text-muted">Create a free, private demo of farmOS in 30 seconds.</p>
    <p class="fs-5 text-muted">Start from scratch or preview farmOS with a curated dataset.</p>
  </div>
  <div class="row row-cols-1 row-cols-md-3 mb-3">
    <template v-for="option in basePreviewOptions" :key="option.id">
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">{{ option.label }}</h4>
          </div>
          <div class="card-body">
            <p class="card-text">{{ option.description }}</p>
            <div class="features">
              <ul>
                <li
                  v-for="(feature, index) in option.features"
                  :key="index"
                >
                  {{ feature }}
                </li>
              </ul>
            </div> 
            <button
              @click="$router.push({ name: 'demo-alias', params: { alias: option.alias}})"
              :disabled="!option.enabled"
              class="btn btn-lg btn-primary"
            >
              <span v-if="option.enabled">Demo</span>
              <span v-if="!option.enabled">Coming soon</span>
            </button>
          </div>
        </div>
      </div>
    </template> 
  </div>
</template>

<script>
import basePreviews from "../basePreviews.js"

export default {
  name: 'Home',
  data() {
    return {
      basePreviewOptions: basePreviews, 
    }
  },
}
</script>
<style>
.features {
  display: flex;
  justify-content: center;
  min-height: 6em;
}
.features ul {
  list-style: disc;
  text-align: left;
}
</style>
