const APP_ID = 'seawatch'; 
const API_KEY = 'NNSXS.CXMVOLSRYKVVSZYF6JIYNIBXN6AVCPDJM72RGJA.QZQYP6O7NT7XWKVYAQ6L7HNTYLNC7M53DFPBWWW2WKLKZFU7R25A'; 
const REGION = 'eu1'; 

async function fetchLoRaData() {
    console.log("Fetching directly from TTN (No Proxy)...");
    
    // The '?nocache=' part forces the browser to bypass old saved data
    // This tells TTN: "Give me only 1 message, and make it the newest one (descending)"
const url = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message?limit=1&order=-received_at&nocache=${Date.now()}`;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'application/json' // Changed from event-stream to json
            }
        });

        if (!response.ok) {
            if(response.status === 401) throw new Error("API Key is invalid.");
            throw new Error(`TTN Error: ${response.status}`);
        }

        // ... inside your fetchLoRaData try block ...
const text = await response.text();
const lines = text.trim().split('\n');

// Grab the very last line of the response
const lastLine = JSON.parse(lines[lines.length - 1]);

// Look deep inside the result
if (lastLine.result && lastLine.result.uplink_message) {
    const payload = lastLine.result.uplink_message.decoded_payload;
    
    // LOG IT so we can see it in F12
    console.log("Full Payload from TTN:", payload);

    // Grab the value. If it's missing, show '??'
    const count = (payload && payload.hasOwnProperty('value')) ? payload.value : "??";
    
    document.getElementById('payload').innerText = count;
    document.getElementById('timestamp').innerText = new Date(lastLine.result.received_at).toLocaleTimeString();
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById('status').innerText = "Offline/Blocked";
        document.getElementById('status').style.color = "Red";
    }
}

// Start the loop
fetchLoRaData();
setInterval(fetchLoRaData, 10000);