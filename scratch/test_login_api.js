import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("server/server.env") });

async function testLogin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  console.log("Testing POST /api/auth/login with env ADMIN_EMAIL...");

  try {
    const res = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: email, password })
    });

    console.log("HTTP Status Code:", res.status);
    const data = await res.json();
    console.log("Response Success:", data.success);
    console.log("Response Message:", data.message);
    console.log("Token Received:", data.token ? "YES (Valid Token)" : "NO");
    console.log("User Profile Name:", data.user?.name);
    console.log("User Profile Role:", data.user?.role);
  } catch (err) {
    console.error("Test fetch error:", err.message);
  }
}

testLogin();
