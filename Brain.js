console.log("Brain.js is loading correctly!");

async function start() {
    console.log("Attempting to fetch data...");
    const res = await fetch('/.netlify/functions/get-lora-data');
    const json = await res.json();
    console.log("Data received:", json);
}

start();