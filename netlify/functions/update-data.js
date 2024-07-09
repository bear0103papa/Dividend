const axios = require('axios');

exports.handler = async function(event, context) {
  const { REPO_ACCESS_TOKEN } = process.env;
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  if (!REPO_ACCESS_TOKEN) {
    console.error('REPO_ACCESS_TOKEN is not set');
    return { statusCode: 500, body: 'Server configuration error' };
  }

  try {
    const response = await axios.post(
      'https://api.github.com/repos/bear0103papa/Dividend/dispatches',
      { event_type: 'update-data' },
      {
        headers: {
          'Authorization': `Bearer ${REPO_ACCESS_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('GitHub API response:', response.status, response.statusText);

    if (response.status === 204) {
      return { statusCode: 200, body: 'Update process started' };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error details:', error.response ? error.response.data : error.message);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: 'Internal Server Error', message: error.message }) 
    };
  }
};
