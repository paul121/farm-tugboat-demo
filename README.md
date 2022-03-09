# farm-tugboat-demo

[![Netlify Status](https://api.netlify.com/api/v1/badges/665c922e-3b18-4b27-ac68-f3fb61fbf09b/deploy-status)](https://app.netlify.com/sites/laughing-mclean-bcdbff/deploys)

## About

A simple vue app that builds ephemeral demos of [farmOS](https://farmos.org) hosted on
[Tugboat](https://www.tugboat.qa/) using [Netlify Functions](https://www.netlify.com/products/functions/).

Right now demos will expire after *12 hours*. This is due to limitations of the
free Tugboat plan; sponsorship of this project would increase the storage
capacity and allow for longer demo times.

## Development

This project has 3 main components:

- Vue app at `/src`
- Netlify functions at `/netlify/functions`
- Tugboat configuration at `/.tugboat`

Development requires both a Netlify and Tugboat account in order to build demos
and run and configure the Netlify functions. The vue app can still be run 
without these accounts for making simple changes.

Netlify functions are used to make all requests to the [Tugboat API](https://api.tugboat.qa/v3)
so that the Tugboat API key is not exposed to the user's browser.
Three Netlify functions are used to make requests to three Tugboat API endpoints:
- [create-preview.js](netlify/functions/create-preview.js):
  Creates new Tugboat previews from the specified base preview `baseId`.
- [get-preview.js](netlify/functions/get-preview.js):
  Gets the status of the specified `previewId`. This is used to query the status
  of the demo preview while it is being created.
- [get-preview-login-link.js](netlify/functions/get-preview-login-link.js):
  One of the last steps in the Tugboat build is to generate a unique login link
  for the `manager` user. Once the preview is done building, this function can
  be used to return the unique login link.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
Use the [Netlify CLI](https://docs.netlify.com/cli/get-started/)
for local development. This will run compile the vue app and run the 
Netlify functions locally!
```
netlify dev
```