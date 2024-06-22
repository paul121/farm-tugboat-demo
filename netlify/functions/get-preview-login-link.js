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
    async function getLogs(retry) {
        return fetch(`https://api.tugboatqa.com/v3/previews/${body.previewId}/log?limit=100`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
            },
        })
        .then(response => response.json())
        .then(data => {
            data.reverse();
            let drushIndex = data.findIndex(log => log.message && log.message.includes('drush uli'));

            // If no drush uli is found, retry, then bail if no logs are found.
            if (drushIndex < 0) {
                if (retry) {
                    console.log('retry')
                    return new Promise(resolve => setTimeout(resolve, 2000))
                        .then(getLogs(false));
                }
                return {
                    statusCode: 400,
                    body: 'Error retrieving demo link from the Tugboat API. Please try again.',
                }
            } 

            // Return the login link.
            const body = {loginLink: data[drushIndex -1].message.trim()};
            return {
                statusCode: 202,
                body: JSON.stringify(body),
            }
        }).catch(error => {
            return {
                statusCode: 400,
                body: error.message,
            };
        });
    }

    return getLogs(true);
}
