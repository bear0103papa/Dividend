const axios = require('axios');

exports.handler = async function(event, context) {
  const { REPO_ACCESS_TOKEN } = process.env;
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
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

    if (response.status === 204) {
      return { statusCode: 200, body: 'Update process started' };
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, body: 'Internal Server Error' };
  }
};
