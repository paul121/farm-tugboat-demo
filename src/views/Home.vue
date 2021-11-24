<template>
  <div class="p-3 pb-md-4 mx-auto text-center">
    <h1 class="display-4 fw-normal">Demo farmOS</h1>
    <p class="fs-5 mb-0 text-muted">Create a free, private demo of farmOS in 30 seconds.</p>
    <p class="fs-5 text-muted">Start from scratch or preview farmOS with a curated dataset.</p>
  </div>
  <div class="row row-cols-1 row-cols-md-3 mb-3 text-center">
    <template v-for="option in basePreviewOptions" :key="option.id">
      <div class="col">
        <div class="card mb-4 rounded-3 shadow-sm">
          <div class="card-header py-3">
            <h4 class="my-0 fw-normal">{{ option.label }}</h4>
          </div>
          <div class="card-body">
            <ul class="preview-description list-unstyled mt-3 mb-4">
              <li>{{ option.description }}</li>
            </ul>
            <button
              @click="$router.push({ name: 'Demo', params: { id: option.id}})"
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
.preview-description {
  min-height: 3.5em;
}
</style>
