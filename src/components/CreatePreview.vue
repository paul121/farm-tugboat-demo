<template>
  <div>
    <div id="preview-wrapper">
      <template v-if="previewLoginLink">
        <h3>Your demo of farmOS is ready!</h3>
        <h4>View the dashboard <a :href="previewLoginLink" target="_blank">here</a> - happy record keeping!</h4>
      </template>
      
      <h4>
        Status: 
        <span v-if="!previewInfo.state">Creating preview...</span>
        <span v-if="!!previewInfo.state">{{ this.previewInfo.state }}</span>
      </h4> 

      <h4 v-if="!!previewId">
        Preview ID: {{ this.previewId }}
      </h4>
 
      <h4 v-if="!!previewInfo.url">
        Preview URL: <a :href="this.previewInfo.url" target="_blank">{{ this.previewInfo.url}}</a>
      </h4>

    </div>
  </div>
</template>

<script>
import basePreviews from "../basePreviews.js"

export default {
  name: 'CreatePreview',
  data() {
    return {
      basePreviewOptions: basePreviews, 
      selectedPreview: null,
      previewId: '',
      previewInfo: {
        state: '',
        url: '',
      },
      previewLoginLink: '',
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.selectedPreview = this.basePreviewOptions.find(preview => preview.id === this.$route.params.id)
      if (this.selectedPreview?.id) {
        this.createPreview(this.selectedPreview.id);
      }
      else {
        this.$router.push('/');
      }
    })
  },
  methods: {
    createPreview(baseId) {
      fetch('/.netlify/functions/create-preview', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({baseId}),
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.previewId = data.preview;
        this.updatePreviewUntilReady()
        .then(() => {
          this.updatePreviewLoginLink();
        })
      })
      .catch(error => alert(error));
    },
    async updatePreviewUntilReady() {
      await this.updatePreviewInfo();
      if (this.previewInfo.state != 'ready') {
        await new Promise(resolve => setTimeout(resolve, 4000));
        await this.updatePreviewUntilReady();
      }
    },
    async updatePreviewInfo() {
      this.previewInfo = await this.fetchPreviewInfo(this.previewId);
    },
    fetchPreviewInfo(previewId) {
      console.log('fetching preview info');
      const payload = {previewId};
      return fetch ('.netlify/functions/get-preview', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(payload),
      })
      .then(response => response.json())
      .catch(error => alert(error));
    },
    async updatePreviewLoginLink() {
      this.previewLoginLink = await this.fetchPreviewLoginLink(this.previewId);
    },
    fetchPreviewLoginLink(previewId) {
      console.log('fetching preview login link');
      const payload = {previewId};
      return fetch ('.netlify/functions/get-preview-login-link', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body: JSON.stringify(payload),
      })
      .then(response => response.json())
      .then(data => data.loginLink)
      .catch(error => alert(error));
    }
  }
}
</script>

<style>

h4 {
  margin-bottom: .5em;
}

form {
  margin: auto;
  max-width: 35%;
}

form .radio-wrapper {
  text-align: left;
}


input {
    margin: .4rem;
}
</style>