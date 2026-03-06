// GitHub Pages Version - No Netlify needed!
const APP_ID = 'seawatch'; // From TTN Overview
const API_KEY = 'NNSXS.CXMVOLSRYKVVSZYF6JIYNIBXN6AVCPDJM72RGJA.QZQYP6O7NT7XWKVYAQ6L7HNTYLNC7M53DFPBWWW2WKLKZFU7R25A'; // Your full TTN API Key
const REGION = 'eu1'; // e.g., eu1, nam1, etc.
const URL = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`;


console.log("Brain.js: Script started. Targeting URL:", URL);

// --- 2. LIVE UPDATE FUNCTION ---
async function fetchLiveDashboard() {
    console.log("Brain.js: Attempting 10-second update...");
    try {
        const response = await fetch(URL, {
            headers: { 
                'Authorization': `Bearer ${API_KEY}`, 
                'Accept': 'text/event-stream' 
            }
        });

        if (!response.ok) {
            console.error("Brain.js: TTN rejected the request. Status:", response.status);
            return;
        }

        const text = await response.text();
        if (!text) {
            console.warn("Brain.js: TTN returned an empty box {}. Is your Arduino sending data?");
            return;
        }

        const lines = text.trim().split('\n');
        const lastLine = JSON.parse(lines[lines.length - 1]);
        
        // DIGGING INTO DATA
        const payload = lastLine.result.uplink_message.decoded_payload;
        const count = payload.value || payload.count || 0;
        const device = lastLine.result.end_device_ids.device_id;
        const time = new Date(lastLine.result.received_at).toLocaleTimeString();

        // UPDATING THE SCREEN
        // We use console.log to confirm the IDs exist in your HTML
        if(document.getElementById('payload')) {
            document.getElementById('payload').innerText = count;
            document.getElementById('device-id').innerText = device;
            document.getElementById('timestamp').innerText = time;
            document.getElementById('status').innerText = "Connected";
            document.getElementById('status').style.color = "green";
            console.log("Brain.js: Dashboard Updated! Count is:", count);
        } else {
            console.error("Brain.js: ERROR! Could not find 'payload' ID in your HTML.");
        }

    } catch (error) {
        console.error("Brain.js: CRITICAL ERROR:", error);
    }
}

// --- 3. LOG SEARCH FUNCTION ---
async function searchLogs() {
    const searchDate = document.getElementById('search-date').value;
    if (!searchDate) { alert("Please select a date!"); return; }

    console.log("Brain.js: Searching for date:", searchDate);
    // ... (rest of search logic from previous message)
}

// --- 4. START THE MOTOR ---
fetchLiveDashboard(); 
setInterval(fetchLiveDashboard, 10000);