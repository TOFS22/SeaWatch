console.log("Brain.js is loading correctly!");

async function start() {
    console.log("Attempting to fetch data...");
    const res = await fetch('/.netlify/functions/get-lora-data');
    const json = await res.json();
    console.log("Data received:", json);
}

if (result.messages && result.messages.length > 5) { // Check if we actually have text
    const lines = result.messages.trim().split('\n');
    const lastLine = JSON.parse(lines[lines.length - 1]);
    console.log("Found newest data:", lastLine);
} else {
    console.log("TTN has no saved messages yet. Send data from the Arduino!");
}

start();