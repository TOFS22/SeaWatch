// GitHub Pages Version - No Netlify needed!
const APP_ID = 'seawatch'; // From TTN Overview
const API_KEY = 'NNSXS.CXMVOLSRYKVVSZYF6JIYNIBXN6AVCPDJM72RGJA.QZQYP6O7NT7XWKVYAQ6L7HNTYLNC7M53DFPBWWW2WKLKZFU7R25A'; // Your full TTN API Key
const REGION = 'eu1'; // e.g., eu1, nam1, etc.

// --- 2. FETCH FUNCTION ---
async function fetchLiveDashboard() {
    console.log("SeaWatch: Syncing with The Things Network...");

    // We use a Proxy and a Timestamp to ensure the data is fresh and not blocked
    const ttnUrl = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`;
    const cacheBuster = Date.now();
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(ttnUrl + "?limit=1&after=" + cacheBuster)}`;

    try {
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'text/event-stream'
            }
        });

        if (!response.ok) {
            throw new Error(`TTN Connection Failed: ${response.status}`);
        }

        const text = await response.text();
        
        if (!text || text.trim() === "") {
            console.warn("SeaWatch: No new messages in storage yet.");
            return;
        }

        // TTN Storage sends data as multiple JSON strings separated by newlines
        const lines = text.trim().split('\n');
        const lastLine = JSON.parse(lines[lines.length - 1]);
        
        // DIGGING INTO DATA (Matches your 'value' formatter)
        const result = lastLine.result;
        const payload = result.uplink_message.decoded_payload;
        
        // This line grabs the 'value' you see in the TTN Console
        const count = (payload && payload.value !== undefined) ? payload.value : 0;
        const device = result.end_device_ids.device_id;
        const time = new Date(result.received_at).toLocaleTimeString();

        // --- 3. UPDATE THE HTML ---
        // Make sure these IDs exist in your index.html!
        document.getElementById('payload').innerText = count;
        document.getElementById('device-id').innerText = device;
        document.getElementById('timestamp').innerText = time;
        
        const statusLabel = document.getElementById('status');
        statusLabel.innerText = "Connected";
        statusLabel.style.color = "#2ecc71"; // Nice Green

        console.log(`SeaWatch SUCCESS: Device [${device}] reported Count: ${count}`);

    } catch (error) {
        console.error("SeaWatch ERROR:", error);
        const statusLabel = document.getElementById('status');
        if(statusLabel) {
            statusLabel.innerText = "Connection Blocked";
            statusLabel.style.color = "#e74c3c"; // Red
        }
    }
}

// --- 4. THE MOTOR (Intervals) ---

// Run once immediately when the page loads
fetchLiveDashboard();

// Then repeat every 10 seconds automatically
setInterval(fetchLiveDashboard, 10000);