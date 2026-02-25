const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async function(event, context) {
  // 1. CHANGE THESE TO YOUR OWN TTN INFO
  const TTN_REGION = "eu1"; // e.g., eu1, nam1
  const APP_ID = "your-application-id"; 
  const API_KEY = process.env.TTN_API_KEY; // This pulled from Netlify settings

  const url = `https://${TTN_REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message?limit=1&order=-received_at`;

  try {
    const response = await fetch(url, {
      headers: { 
        'Authorization': `Bearer ${API_KEY}`,
        'Accept': 'application/json'
      }
    });
    
    const data = await response.text();
    
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: data
    };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};