import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("server/server.env") });

async function testUsernameLogin() {
  const password = process.env.ADMIN_PASSWORD;

  console.log("Testing POST /api/auth/login with username 'admin'...");

  try {
    const res = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: "admin", password })
    });

    console.log("HTTP Status Code:", res.status);
    const data = await res.json();
    console.log("Response Success:", data.success);
    console.log("User Profile Role:", data.user?.role);
  } catch (err) {
    console.error("Test fetch error:", err.message);
  }
}

testUsernameLogin();
