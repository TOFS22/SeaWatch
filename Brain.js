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
            const count = lastLine.result.uplink_message.decoded_payload.value;
            
            document.getElementById('data').innerText = count;
            console.log("Success! New count:", count);
        }
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        // If you see a 'CORS' error here, see step 2 below.
    }
}

setInterval(fetchLoRaData, 10000);
fetchLoRaData();