<template>
  <div>
    <div id="form-wrapper" v-if="!submitted">

      <form @submit.prevent="onSubmit">
        <h3>Demo farmOS!</h3>

        <h4>Select a demo:</h4>
        <div class="radio-wrapper">
          <template v-for="option in basePreviewOptions" :key="option.id">
            <input
              type="radio"
              :id="'base-' + option.id"
              :value="option.id"
              v-model="baseId"
              :disabled="!option.enabled"
            />
            <label :for="'base-' + option.id">
              <span class="label">{{ option.label }}</span>
              <span class="disabled" v-if="!option.enabled"> (coming soon)</span>
              <span class="description">: {{ option.description }}</span>
            </label>
            <br />
          </template>
        </div>

        <input class="button" type="submit" value="Submit" :disabled="submitted || !baseId">  
      </form>
    </div>

    <div id="preview-wrapper" v-if="submitted">
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

export default {
  name: 'CreatePreview',
  data() {
    return {
      submitted: false,
      basePreviewOptions: [
        {
          id: '618f7136908ae14527591948',
          enabled: true,
          label: '2.x',
          description: 'Fresh farmOS 2.0 install.',
        },
        {
          id: '0',
          enabled: false,
          label: 'Market farm',
          description: 'An example of the crop plan.',
        },
        {
          id: '1',
          enabled: false,
          label: 'Ranch',
          description: 'An example of the grazing plan.',
        },
      ],
      baseId: '',
      previewId: '',
      previewInfo: {
        state: '',
        url: '',
      },
      previewLoginLink: '',
    }
  },
  methods: {
    onSubmit() {
      this.submitted = true;

      const payload = {
        baseId: this.baseId,
      }

      fetch('/.netlify/functions/create-preview', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
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