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
    statusLabel.style.color = "#12d10c";

    console.log("Dashboard Updated! Count is:", count);
}
    } catch (error) {
        console.error("Direct Fetch Error:", error);
        // If you see a 'CORS' error here, see step 2 below.
    }
}

async function searchLogs() {
    const searchDate = document.getElementById('search-date').value; // Format: YYYY-MM-DD
    if (!searchDate) {
        alert("Please select a date first!");
        return;
    }

    console.log("Searching logs for:", searchDate);
    const tableBody = document.getElementById('log-table-body');
    const resultsDiv = document.getElementById('log-results');
    tableBody.innerHTML = "<tr><td colspan='3'>Searching...</td></tr>";
    resultsDiv.style.display = "block";

    try {
        const url = `https://${REGION}.cloud.thethings.network/api/v3/as/applications/${APP_ID}/packages/storage/uplink_message`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${API_KEY}`, 'Accept': 'text/event-stream' }
        });

        const text = await response.text();
        const lines = text.trim().split('\n');
        
        let foundAny = false;
        tableBody.innerHTML = ""; // Clear "Searching..." message

        lines.forEach(line => {
            const entry = JSON.parse(line);
            const entryTime = new Date(entry.result.received_at);
            const entryDate = entryTime.toISOString().split('T')[0]; // Get YYYY-MM-DD

            if (entryDate === searchDate) {
                foundAny = true;
                const timeString = entryTime.toLocaleTimeString();
                const count = entry.result.uplink_message.decoded_payload.value || 0;
                const device = entry.result.end_device_ids.device_id;

                // Add a row to the table
                const row = `<tr>
                    <td>${timeString}</td>
                    <td>${device}</td>
                    <td>${count}</td>
                </tr>`;
                tableBody.innerHTML += row;
            }
        });

        if (!foundAny) {
            tableBody.innerHTML = "<tr><td colspan='3'>No data found for this date.</td></tr>";
        }
        document.getElementById('selected-date-display').innerText = searchDate;

    } catch (error) {
        console.error("Search Error:", error);
        tableBody.innerHTML = "<tr><td colspan='3'>Error loading logs. Check Console.</td></tr>";
    }
}

setInterval(fetchLoRaData, 10000);
fetchLoRaData();

setInterval(function() {
    console.log("10 seconds passed. Refreshing data...");
    fetchLoRaData();
}, 10000);