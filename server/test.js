const fs = require('fs');

async function test() {
  const fileBuffer = fs.readFileSync('d:/Ai Resume Builder/server/node_modules/pdf-parse/test/data/01-valid.pdf');
  const fileBlob = new Blob([fileBuffer], { type: 'application/pdf' });
  
  const form = new FormData();
  form.append('jobDescription', 'test software engineer');
  form.append('resume', fileBlob, '01-valid.pdf');

  try {
    console.log("Sending request...");
    const res = await fetch("http://localhost:5000/api/ai/generate-resume", {
      method: "POST",
      body: form
    });
    const data = await res.json();
    console.log("EXACT ERROR MESSAGE:", data.details);
  } catch (err) {
    console.error("ERROR:", err);
  }
}
test();
