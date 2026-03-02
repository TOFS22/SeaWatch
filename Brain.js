async function fetchLoRaData() {
  try {
    const response = await fetch('/.netlify/functions/get-lora-data');
    const result = await response.json();

    if (result.messages && result.messages.length > 0) {
      // 1. TTN sends messages separated by newlines. We need the last one.
      const lines = result.messages.trim().split('\n');
      const lastLine = JSON.parse(lines[lines.length - 1]);

      // 2. Drill down into the TTN structure safely
      const uplink = lastLine.result.uplink_message;
      
      if (uplink && uplink.decoded_payload) {
        const countValue = uplink.decoded_payload.value; // Or whatever your variable name is
        
        // 3. Update the HTML
        document.getElementById('data').innerText = countValue;
        console.log("Success! Displaying count:", countValue);
      }
    }
  } catch (error) {
    console.error("Connection Error:", error);
  }
}

// Run every 10 seconds
setInterval(fetchLoRaData, 10000);
fetchLoRaData();