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

    // Fetch preview info.
    return fetch(`https://api.tugboat.qa/v3/previews/${body.previewId}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
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
            body: JSON.stringify({message: error}),
        };
    });
}
