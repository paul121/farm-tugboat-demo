const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.TUGBOAT_API_KEY;
    const repoId = process.env.TUGBOAT_REPO_ID;
    if (!apiKey || !repoId) {
        return {
            statusCode: 400,
            body: 'Missing TUGBOAT_API_KEY or TUGBOAT_REPO_ID.'
        }
    }

    // Make sure a base preview was specified.
    const body = JSON.parse(event.body);
    if (!body.baseId) {
        return {
            statusCode: 400,
            body: 'No base preview ID provided.',
        }
    }

    // Build payload.
    const expires = new Date();
    expires.setDate(expires.getDate() + 1);
    const payload = {
        ref: 'main',
        repo: repoId,
        anchor: false,
        base: body.baseId,
        expires: expires.toJSON(),
        name: body.name ?? 'Demo Farm',
    }

    // Create the preview.
    return fetch('https://api.tugboat.qa/v3/previews', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        return {
            statusCode: 202,
            body: JSON.stringify(data),
        }
    }).catch(error => {
        return {
            statusCode: 400,
            body: error,
        };
    });
}
