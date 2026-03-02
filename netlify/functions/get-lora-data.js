exports.handler = async function(event, context) {
  // 1. YOUR SETTINGS - DOUBLE CHECK THESE!
  const APP_ID = 'sender'; // From TTN Overview
  const REGION = 'eu1';             // Usually eu1
  const API_KEY = process.env.TTN_API_KEY; // Your NNSXS... key

  console.log("Checking TTN for data...");

  try {
    const response = await fetch(
      `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`,
      {
        headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'text/event-stream' }
      }
    );

    if (!response.ok) {
      console.log(`Error: ${response.status} - Check your API Key or App ID`);
      return { statusCode: response.status, body: "Error connecting to TTN" };
    }

    const data = await response.text();
    console.log("Data received from TTN:", data); // This will now show in your Netlify logs

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ messages: data })
    };
  } catch (error) {
    console.log("Fetch Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};