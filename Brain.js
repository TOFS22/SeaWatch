// GitHub Pages Version - No Netlify needed!
const APP_ID = 'seawatch'; // From TTN Overview
const API_KEY = 'NNSXS.CXMVOLSRYKVVSZYF6JIYNIBXN6AVCPDJM72RGJA.QZQYP6O7NT7XWKVYAQ6L7HNTYLNC7M53DFPBWWW2WKLKZFU7R25A'; // Your full TTN API Key
const REGION = 'eu1'; // e.g., eu1, nam1, etc.

async function fetchLoRaData() {
    console.log("Fetching directly from TTN...");
    
    const url = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'text/event-stream'
            }
        });

        if (!response.ok) throw new Error(`TTN Error: ${response.status}`);

        const text = await response.text();
        
        if (text) {
    const lines = text.trim().split('\n');
    const lastLine = JSON.parse(lines[lines.length - 1]);
    
    // 1. Get the data from TTN
    const result = lastLine.result;
    const payload = result.uplink_message.decoded_payload;
    const count = payload.value || payload.count || "0";
    const device = result.end_device_ids.device_id;
    const time = new Date(result.received_at).toLocaleTimeString();

    // 2. Update the HTML using YOUR specific IDs
    document.getElementById('payload').innerText = count;      // Matches <b id="payload">
    document.getElementById('device-id').innerText = device;  // Matches <span id="device-id">
    document.getElementById('timestamp').innerText = time;    // Matches <span id="timestamp">
    
    // 3. Update the status indicator
    const statusLabel = document.getElementById('status');
    statusLabel.innerText = "Connected";
    statusLabel.style.color = "green";

    console.log("Dashboard Updated! Count is:", count);
}
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        // If you see a 'CORS' error here, see step 2 below.
    }
}

setInterval(fetchLoRaData, 10000);
fetchLoRaData();