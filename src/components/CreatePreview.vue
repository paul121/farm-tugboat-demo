<template>
  <div>
    <div id="preview-wrapper">
      <div class="alert alert-danger" role="alert" v-if="errorMessage">
          Error creating demo: {{ errorMessage }}
      </div>
      <div id="preview-form" v-if="!submitted">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title" v-if="selectedPreview.label">Configure your {{ selectedPreview.label }} demo:</h5>
            <form>
              <div class="mb-3">
                <label for="farmName" class="form-label">Farm name</label>
                <input v-model.trim="previewName" :placeholder="previewName" type="text" class="form-control" id="farmName" aria-describedby="farm name">
              </div>
              <div class="mb-3">
                <label for="timezone" class="form-label">Timezone</label>
                <select v-model="previewTimezone" id="timezone" class="form-select">
                  <option
                    v-for="(timezone, index) in timezoneOptions"
                    :key="index"
                    :value="timezone"
                  >
                    {{ timezone }}
                  </option>
                </select>
              </div>
              <div class="mb-3">
                <label for="langcode" class="form-label">Language</label>
                <select v-model="previewLangcode" id="langcode" class="form-select">
                  <option
                    v-for="(language, langcode) in langcodeOptions"
                    :key="langcode"
                    :value="langcode"
                  >
                    {{ language }}
                  </option>
                </select>
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
          <h5>This farmOS demo will persist for <b>12 hours</b>.</h5>
          <h5>Note that sending emails from the demo is not allowed, so <b>password recovery will not work</b>. If you change your user password, be sure to remember it.</h5>
        </div>
      </div> 
    </div>
  </div>
</template>

<script>
import Chance from "chance"
import basePreviews from "../basePreviews.js"
import timezones from "../timezones.js"
export default {
  name: 'CreatePreview',
  data() {
    return {
      basePreviewOptions: basePreviews, 
      timezoneOptions: timezones,
      langcodeOptions: {
        'en': 'English',
        'de': 'German',
        'es': 'Spanish',
        'it': 'Italian',
        'nl': 'Dutch',
      },
      selectedPreview: {},
      submitted: false,
      buildStart: null,
      previewName: '',
      previewTimezone: null,
      previewLangcode: 'en',
      previewId: '',
      previewInfo: {
        state: 'creating',
        url: '',
      },
      previewLoginLink: '',
      errorMessage: null,
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
            percent = seconds < 60 ? percent + seconds * 2 : 80;
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

      // Load preview by alias.
      if (this.$route.params.alias) {
        this.selectedPreview = this.basePreviewOptions.find(preview => preview.alias === this.$route.params.alias);
      }

      // Load preview by id.
      if (this.$route.params.id) {
        this.selectedPreview = this.basePreviewOptions.find(preview => preview.id === this.$route.params.id);
        // Default to using the preview id in case it is custom.
        // @todo: this could be validated with a quick GET to the tugboat API.
        this.selectedPreview = this.selectedPreview ?? {id: this.$route.params.id, label: 'Custom preview'};
      } 

      if (this.selectedPreview?.id) {
        this.previewName = this.generateName();
        this.previewTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      }
      else {
        this.$router.push('/');
      }
    })
  },
  methods: {
    createPreview(baseId, name = 'Demo farm') {
      this.submitted = true;
      const payload = {
        baseId,
        name,
        timezone: this.previewTimezone,
        langcode: this.previewLangcode,
      };
      fetch('/.netlify/functions/create-preview', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      })
      .then(function(response) {
        if (!response.ok) {
          return response.json().then(json => { throw json; });
        }
        return response;
      })
      .then(response => response.json())
      .then(data => {
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
      .catch(error => this.setError(error));
    },
    async updatePreviewUntilReady() {
      await this.updatePreviewInfo();

      // Set the build start time once the preview is in the building state.
      if (!this.buildStart && this.previewInfo.state == 'building') {
        this.buildStart = Date.now();
      }

      // Keep fetching updates until ready.
      if (!this.errorMessage && this.previewInfo.state != 'ready') {
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
      .then(function(response) {
        if (!response.ok) {
          return response.json().then(json => { throw json; });
        }
        return response;
      })
      .then(response => response.json())
      .catch(error => this.setError(error));
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
      .then(function(response) {
        if (!response.ok) {
          return response.json().then(json => { throw json; });
        }
        return response;
      })
      .then(response => response.json())
      .then(data => data.loginLink)
      .catch(error => this.setError(error));
    },
    generateName() {
      const chance = new Chance();
      const name = chance.first();
      let animal = chance.animal({type: 'farm'});
      while (['Dog', 'Cat'].includes(animal)) {
        animal = chance.animal({type: 'farm'});
      }
      return `${name}'s ${animal} Farm`; 
    },
    setError(message) {
      this.errorMessage = message;
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