const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Load but do not cache the build_steps.json file.
    const path = '../../.tugboat/build_steps.json';
    const config = require(path);
    delete require.cache[require.resolve(path)];

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

    // Set the default timezone.
    const timezone = body.timezone ?? 'America/Los_Angeles';
    const updateTimezone = `TIMEZONE="${timezone}"; drush config-set system.date timezone.default "$TIMEZONE" --yes`;
    config.services.php.commands.build.unshift(updateTimezone);

    // Set the defaault langcode.
    // Temporarily set the system.site default_langcode so users are created with correct language.
    // TODO: Find a different approach for this.
    const langcode = body.langcode ?? 'en';
    const updateLangcode = `LANGCODE=${langcode}; drush config:set language.negotiation selected_langcode "$LANGCODE" --yes; drush config:set system.site default_langcode "$LANGCODE" --yes;`;
    config.services.php.commands.build.unshift(updateLangcode);

    // Set expiration.
    let expires = new Date();
    expires.setHours(expires.getHours() + 12);

    // Development settings.
    if (process.env.CONTEXT === 'dev') {
        body.name += ' (dev)';
        expires = new Date();
        expires.setHours(expires.getHours() + 1);
    }

    // Build payload.
    const payload = {
        ref: 'main',
        repo: repoId,
        anchor: false,
        base: body.baseId,
        config,
        expires: expires.toJSON(),
        name: body.name ?? 'Demo Farm',
    }

    // Create the preview.
    return fetch('https://api.tugboatqa.com/v3/previews', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    })
    .then(response => response.json())
    .then(data => {
        if (data.code == 1022) {
            return {
                statusCode: 400,
                body: 'Demo limit has been reached. Please try again later.',
            };
        }
        if (!data.hasOwnProperty("preview")) {
            console.log(data);
            return {
                statusCode: 400,
                body: 'Demo not created. Please try again.',
            };
        }
        return {
            statusCode: 202,
            body: JSON.stringify(data),
        }
    }).catch(error => {
        return {
            statusCode: 400,
            body: error.message,
        };
    });
}
