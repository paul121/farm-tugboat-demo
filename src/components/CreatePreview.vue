<template>
  <div>
    <div id="preview-wrapper">
      <template v-if="previewLoginLink">
        <h3>Your demo of farmOS is ready!</h3>
        <h4>View the dashboard <a :href="previewLoginLink" target="_blank">here</a> - happy record keeping!</h4>
      </template>
      
      <h4> 
        <span v-if="previewInfo.state != 'ready'">Status: {{ this.previewInfo.state }}...</span>
        <span v-if="previewInfo.state == 'ready' && !previewLoginLink">Generating a login link...</span> 
      </h4> 
      <div class="progress">
        <div
          class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="percentComplete"
          :style="{width: percentComplete + '%'}"
        />
      </div>
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
      buildStart: null,
      previewId: '',
      previewInfo: {
        state: 'creating',
        url: '',
      },
      previewLoginLink: '',
    }
  },
  computed: {
    percentComplete: function ()  {
      let percent = 0;
      switch(this.previewInfo?.state) {
        case 'ready':
          percent = this.previewLoginLink ? 100 : 90;
          break;
        case 'building':
          percent = 10;
          if (this.buildStart) {
            let seconds = Math.round((Date.now() - this.buildStart)/1000);
            percent = seconds < 40 ? percent + seconds * 2 : 80;
          }
          break;
        case 'pending':
          percent = 5;
          break;
        case 'creating':
        default:
          percent = 0;  
      }
      return percent;
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
        this.buildStart = Date.now();
        this.previewId = data.preview;
        this.updatePreviewUntilReady()
        .then(() => {
          return new Promise((resolve) => {
            setTimeout(() => {
              this.updatePreviewLoginLink();
              resolve();
            }, 2000);
          })
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