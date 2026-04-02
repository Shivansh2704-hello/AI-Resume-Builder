require('dotenv').config({ path: './server/.env' });
const fs = require('fs');

async function listModels() {
  const apiKey = process.env.OPENAI_API_KEY;
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + apiKey);
    const data = await res.json();
    if (data.models) {
      const names = data.models.map(m => m.name);
      console.log(JSON.stringify(names, null, 2));
    } else {
      console.log("NO MODELS:", data);
    }
  } catch (error) {
    console.log("ERROR:", error.message);
  }
}

listModels();
