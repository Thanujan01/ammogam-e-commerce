const bcrypt = require("bcryptjs");

async function test() {
  try {
    const tempPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
    console.log("Temp password:", tempPassword);
    const hash = await bcrypt.hash(tempPassword, 10);
    console.log("Hash:", hash);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
