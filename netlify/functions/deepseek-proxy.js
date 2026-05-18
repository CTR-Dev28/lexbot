// netlify/functions/deepseek-proxy.js
exports.handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Read the secret API key from Netlify environment variables
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'API key not configured on server' }),
      };
    }

    // Get the request payload from the frontend
    const payload = JSON.parse(event.body);

    // Make the actual DeepSeek API call
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: payload.messages,
        temperature: payload.temperature || 0.7,
        max_tokens: payload.max_tokens || 2048,
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.ok ? 200 : response.status,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
