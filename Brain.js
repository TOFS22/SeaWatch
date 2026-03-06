// GitHub Pages Version - No Netlify needed!
const APP_ID = 'seawatch'; // From TTN Overview
const API_KEY = 'NNSXS.CXMVOLSRYKVVSZYF6JIYNIBXN6AVCPDJM72RGJA.QZQYP6O7NT7XWKVYAQ6L7HNTYLNC7M53DFPBWWW2WKLKZFU7R25A'; // Your full TTN API Key
const REGION = 'eu1'; // e.g., eu1, nam1, etc.

// We use the full URL for GitHub Pages
const URL = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`;

console.log("SeaWatch: Dashboard starting...");

async function fetchLiveDashboard() {
    try {
        console.log("SeaWatch: Fetching data from TTN...");
        
        const response = await fetch(URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Accept': 'text/event-stream'
            }
        });

        if (!response.ok) {
            console.error("SeaWatch: Connection failed. Status:", response.status);
            return;
        }

        const text = await response.text();
        if (!text || text.trim() === "") {
            console.warn("SeaWatch: No data found in TTN Storage.");
            document.getElementById('payload').innerText = "No Data";
            return;
        }

        // Get the very last line (most recent data)
        const lines = text.trim().split('\n');
        const lastLine = JSON.parse(lines[lines.length - 1]);
        
        // Extract the info
        const result = lastLine.result;
        const payload = result.uplink_message.decoded_payload;
        
        // Match the variable name from your TTN Payload Formatter (value or count)
        const count = payload.value !== undefined ? payload.value : (payload.count || 0);
        const device = result.end_device_ids.device_id;
        const time = new Date(result.received_at).toLocaleTimeString();

        // Update the HTML IDs exactly as they appear in your
        document.getElementById('payload').innerText = count;
        document.getElementById('device-id').innerText = device;
        document.getElementById('timestamp').innerText = time;
        
        // Update Status Indicator
        const statusLabel = document.getElementById('status');
        statusLabel.innerText = "Connected";
        statusLabel.style.color = "green";

        console.log("SeaWatch: Update Successful. Count:", count);

    } catch (error) {
        console.error("SeaWatch: Error during update:", error);
        document.getElementById('status').innerText = "Disconnected";
        document.getElementById('status').style.color = "red";
    }
}

// --- INITIALIZE ---
fetchLiveDashboard(); // Run immediately on load

// Refresh every 10 seconds (10,000ms)
setInterval(fetchLiveDashboard, 10000);