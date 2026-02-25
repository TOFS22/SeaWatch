async function fetchLoRaData() {
    try {
        // This calls your Netlify function
        const response = await fetch('/.netlify/functions/get-lora-data');
        const data = await response.json(); 

        // Update the UI
        // Note: 'payload' depends on how you named it in your TTN Formatter
        document.getElementById('data').innerText = data.result.uplink_message.decoded_payload.value;
        document.getElementById('time').innerText = "Last update: " + new Date().toLocaleTimeString();
        
    } catch (err) {
        console.error("Connection Error:", err);
        document.getElementById('time').innerText = "Data pending...";
    }
}

// Refresh every 20 seconds (to stay within TTN fair use)
setInterval(fetchLoRaData, 20000);
fetchLoRaData();