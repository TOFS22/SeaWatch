async function updateDashboard() {
    try {
        // Replace with your actual API endpoint
        const response = await fetch('https://your-api-endpoint.com/lora-data');
        const data = await response.json();

        document.getElementById('device-id').innerText = data.device_id;
        document.getElementById('payload').innerText = data.decoded_payload;
        document.getElementById('timestamp').innerText = new Date().toLocaleTimeString();
        document.getElementById('status').innerText = "Connected";
    } catch (error) {
        document.getElementById('status').innerText = "Disconnected";
    }
}

// Refresh every 10 seconds
setInterval(updateDashboard, 10000); 
updateDashboard();