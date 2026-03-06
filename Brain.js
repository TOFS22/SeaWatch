// GitHub Pages Version - No Netlify needed!
const APP_ID = 'seawatch'; // From TTN Overview
const API_KEY = 'NNSXS.CXMVOLSRYKVVSZYF6JIYNIBXN6AVCPDJM72RGJA.QZQYP6O7NT7XWKVYAQ6L7HNTYLNC7M53DFPBWWW2WKLKZFU7R25A'; // Your full TTN API Key
const REGION = 'eu1'; // e.g., eu1, nam1, etc.
const URL = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`;

// --- FUNCTION 1: THE LIVE DASHBOARD (Runs every 10s) ---
async function fetchLiveDashboard() {
    console.log("Updating Live Dashboard...");
    try {
        const response = await fetch(URL, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'text/event-stream' }
        });
        const text = await response.text();
        if (!text) return;

        const lines = text.trim().split('\n');
        const lastLine = JSON.parse(lines[lines.length - 1]);
        
        // Extract data
        const result = lastLine.result;
        const payload = result.uplink_message.decoded_payload;
        const count = payload.value || payload.count || 0;
        const device = result.end_device_ids.device_id;
        const time = new Date(result.received_at).toLocaleTimeString();

        // Update HTML (Make sure these IDs match your HTML exactly!)
        document.getElementById('payload').innerText = count;
        document.getElementById('device-id').innerText = device;
        document.getElementById('timestamp').innerText = time;
        
        const statusLabel = document.getElementById('status');
        statusLabel.innerText = "Connected";
        statusLabel.style.color = "green";

    } catch (error) {
        console.error("Dashboard Update Error:", error);
        document.getElementById('status').innerText = "Connection Error";
        document.getElementById('status').style.color = "red";
    }
}

// --- FUNCTION 2: THE LOG SEARCH (Runs only when button clicked) ---
async function searchLogs() {
    const searchDate = document.getElementById('search-date').value;
    if (!searchDate) { alert("Please select a date!"); return; }

    const tableBody = document.getElementById('log-table-body');
    tableBody.innerHTML = "<tr><td colspan='3'>Searching...</td></tr>";
    document.getElementById('log-results').style.display = "block";

    try {
        const response = await fetch(URL, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'text/event-stream' }
        });
        const text = await response.text();
        const lines = text.trim().split('\n');
        
        tableBody.innerHTML = ""; 
        let found = false;

        lines.forEach(line => {
            const entry = JSON.parse(line);
            const entryDate = new Date(entry.result.received_at).toISOString().split('T')[0];

            if (entryDate === searchDate) {
                found = true;
                const time = new Date(entry.result.received_at).toLocaleTimeString();
                const count = entry.result.uplink_message.decoded_payload.value || 0;
                const row = `<tr><td>${time}</td><td>${entry.result.end_device_ids.device_id}</td><td>${count}</td></tr>`;
                tableBody.innerHTML += row;
            }
        });

        if (!found) tableBody.innerHTML = "<tr><td colspan='3'>No data for this date.</td></tr>";
    } catch (e) { console.error(e); }
}

// --- INITIALIZE ---
fetchLiveDashboard(); // Run once at start
setInterval(fetchLiveDashboard, 10000); // Repeat every 10 seconds