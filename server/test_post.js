const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "super_secure_random_secret_key_123!@#";

// Generate a fake valid token
const token = jwt.sign({ id: "60c72b2f9b1d8b001c8e4b3a" }, JWT_SECRET, { expiresIn: '1h' });

async function test() {
  try {
    const res = await fetch("http://localhost:5000/api/resume/save", {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: "Test Resume",
        template: "template1",
        resumeData: {
          personal: { name: "Test User" },
          education: [],
          experience: [],
          skills: ""
        }
      })
    });
    const data = await res.json();
    if (res.ok) {
      console.log("SUCCESS:", res.status, data);
    } else {
      console.log("FAIL HTTP CODE:", res.status);
      console.log("FAIL BODY:", data);
    }
  } catch (error) {
    console.log("FAIL NETWORK:", error.message);
  }
}

test();
