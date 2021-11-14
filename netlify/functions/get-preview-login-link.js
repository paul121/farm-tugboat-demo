const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const apiKey = process.env.TUGBOAT_API_KEY ?? 'none';

    // Make sure a preview id is provided.
    const body = JSON.parse(event.body);
    if (!body.previewId) {
        return {
            statusCode: 404,
            error: 'No preview ID provided.',
        }
    }

    // Fetch the preview logs.
    return fetch(`https://api.tugboat.qa/v3/previews/${body.previewId}/log?limit=10`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        data.reverse();
        console.log(data);
        let drushIndex = data.findIndex(log => log.message && log.message.includes('drush uli'));

        // Bail if no drush uli is found.
        if (drushIndex < 0) {
            return {
                statusCode: 400,
                body: 'No login link found. Check the preview status.',
            }
        } 

        // Return the login link.
        const body = {
            loginLink: data[drushIndex -1].message.trim(),
        };
        return {
            statusCode: 202,
            body: JSON.stringify(body),
        }
    }).catch(error => {
        return {
            statusCode: 400,
            body: error,
        };
    });
}
