<template>
  <div>
    <div id="preview-wrapper">
      <div id="preview-form" v-if="!submitted">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title">Configure demo</h4>
            <form>
              <div class="mb-3">
                <label for="farmName" class="form-label">Farm name</label>
                <input v-model.trim="previewName" :placeholder="previewName" type="text" class="form-control" id="farmName" aria-describedby="farm name">
              </div>
            </form>
              <button
                @click="createPreview(this.selectedPreview.id, this.previewName)"
                :disabled="!previewName.length || submitted"
                class="btn btn-lg btn-primary"
              >
                Create
              </button>
          </div>
        </div>
      </div>
      <div id="preview-building-wrapper" v-if="submitted && !previewLoginLink">
        <h3>{{ this.previewName }}</h3>
        <h4> 
          <span v-if="previewInfo.state != 'ready'">Status: {{ this.previewInfo.state }}...</span>
          <span v-if="previewInfo.state == 'ready'">Generating a login link...</span> 
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
      <div id="preview-login-wrapper" v-if="previewLoginLink">
        <h3>{{ this.previewName }}</h3>
        <div>
          <h4>Your demo of farmOS is ready!</h4>
          <a :href="previewLoginLink" target="_blank" class="btn btn-outline-primary btn-lg">View the dashboard</a>
        </div>

        <div>
          <h5>The button above will log you in to the demo as the "manager" user.</h5>
          <h5>You may also use the following credentials:</h5>
          <ul>
            <li><b>URL:</b> <a :href="previewInfo.url" target="_blank">{{ previewInfo.url }}</a></li>
            <li><b>Username:</b> manager</li>
            <li><b>Password:</b> manager</li>
          </ul>
        </div>

        <div>
          <h5>This farmOS demo will persist for <b>1 day</b>.</h5>
          <h5>Note that sending emails from the demo is not allowed, so <b>password recovery will not work</b>. If you change your user password, be sure to remember it.</h5>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import Chance from "chance"
import basePreviews from "../basePreviews.js"

export default {
  name: 'CreatePreview',
  data() {
    return {
      basePreviewOptions: basePreviews, 
      selectedPreview: null,
      submitted: false,
      buildStart: null,
      previewName: '',
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
        this.previewName = this.generateName();
      }
      else {
        this.$router.push('/');
      }
    })
  },
  methods: {
    createPreview(baseId, name = 'Demo farm') {
      this.submitted = true;
      fetch('/.netlify/functions/create-preview', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({baseId, name}),
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
      return fetch ('/.netlify/functions/get-preview', {
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
      return fetch ('/.netlify/functions/get-preview-login-link', {
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
    },
    generateName() {
      const chance = new Chance();
      const name = chance.first();
      let animal = chance.animal({type: 'farm'});
      while (['Dog', 'Cat'].includes(animal)) {
        animal = chance.animal({type: 'farm'});
      }
      return `${name}'s ${animal} Farm`; 
    }
  }
}
</script>

<style>

#preview-wrapper {
  margin: auto;
  margin-top: 2em;
  max-width: 750px;
}

#preview-form {
  margin: auto;
  max-width: 750px;
}

#preview-login-wrapper div {
  margin-bottom: 2em;
}

h4 {
  margin-bottom: .5em;
}

form {
  margin: 2em auto;
  max-width: 300px;
  text-align: left;
}
form input {
  margin: 0;
}

form .radio-wrapper {
  text-align: left;
}


input {
    margin: .4rem;
}

ul {
  list-style: none;
}
</style>