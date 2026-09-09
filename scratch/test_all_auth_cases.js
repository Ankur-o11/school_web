import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("server/server.env") });

async function runAllTests() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  console.log("=== AUTHENTICATION DIAGNOSTIC & VERIFICATION TEST SUITE ===");

  // TEST 1: Correct Credentials Login
  console.log("\n[TEST 1] Correct Admin Credentials Login:");
  const res1 = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, password })
  });
  const data1 = await res1.json();
  console.log("Status Code:", res1.status);
  console.log("Result:", res1.status === 200 && data1.success ? "PASS ✅" : "FAIL ❌");
  const token = data1.token;

  // TEST 2: Wrong Password
  console.log("\n[TEST 2] Wrong Password Test:");
  const res2 = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: email, password: "wrong_password_123" })
  });
  const data2 = await res2.json();
  console.log("Status Code:", res2.status);
  console.log("Message:", data2.message);
  console.log("Result:", res2.status === 401 && !data2.success ? "PASS ✅" : "FAIL ❌");

  // TEST 3: Non-existing Email
  console.log("\n[TEST 3] Non-existing Email Test:");
  const res3 = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier: "nonexistent.user@mpsa.com", password: "some_password" })
  });
  const data3 = await res3.json();
  console.log("Status Code:", res3.status);
  console.log("Message:", data3.message);
  console.log("Result:", res3.status === 401 && !data3.success ? "PASS ✅" : "FAIL ❌");

  // TEST 4 & 5: Authenticated Request to GET /api/auth/me
  console.log("\n[TEST 4 & 5] Authenticated /api/auth/me Request:");
  const res4 = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data4 = await res4.json();
  console.log("Status Code:", res4.status);
  console.log("User Profile Returned:", data4.user?.email === email ? "YES" : "NO");
  console.log("Result:", res4.status === 200 && data4.user?.role === "Admin" ? "PASS ✅" : "FAIL ❌");

  // TEST 6: Logout Request
  console.log("\n[TEST 6] Logout Request:");
  const res5 = await fetch("http:// https://school-web-hng4.onrender.com/api/auth/logout", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  const data5 = await res5.json();
  console.log("Status Code:", res5.status);
  console.log("Result:", res5.status === 200 && data5.success ? "PASS ✅" : "FAIL ❌");
}

runAllTests();
