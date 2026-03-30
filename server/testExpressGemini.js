async function testExpressGemini() {
  try {
    console.log("Pinging Express /api/ai/chat with Gemini-2.5-flash...");
    const res = await fetch('http://localhost:5000/api/ai/chat', { 
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: 'I received an ATS match score of 45%. My matched keywords are: HTML. Provide concise strategic advice.' })
    });
    
    const data = await res.json();
    console.log('\n--- SUCCESS ---');
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('\n--- ERROR ---');
    console.error(error.message);
  }
}

testExpressGemini();
