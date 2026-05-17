// etl.js — Lab 1: Fetch & ETL with Node.js

const fs = require("fs");
const path = require("path");

const API_URL = "https://jsonplaceholder.typicode.com/users";
const POSTS_API_URL = "https://jsonplaceholder.typicode.com/posts";

// ── 1. EXTRACT ────────────────────────────────────
async function extract(url) {
  console.log("[EXTRACT] Fetching:", url);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("HTTP error: " + response.status);
  }

  const data = await response.json();
  console.log("[EXTRACT] Got", data.length, "records.");

  // Task 1: Inspect the first user object structure
  if (url === API_URL) {
    console.log("\n[TASK 1] First user object (raw):");
    console.log(data[0]);
    console.log('[TASK 1] Nested fields: "address" and "company"');
    console.log("[TASK 1] data[0].address.city =", data[0].address.city);
    console.log();
  }

  return data;
}

// ── 2. TRANSFORM ──────────────────────────────────
function transform(users, posts) {
  console.log("[TRANSFORM] Cleaning", users.length, "records...");

  // Challenge A: count posts per userId
  const postCounts = {};
  if (posts) {
    for (const post of posts) {
      postCounts[post.userId] = (postCounts[post.userId] || 0) + 1;
    }
  }

  const rows = users.map((user) => {
    const row = {
      id: user.id,
      name: user.name.trim(),
      username: user.username.toLowerCase(),
      email: user.email.toLowerCase(),
      phone: user.phone.split(" ")[0], // keep only the main number
      city: user.address.city,
      zipcode: user.address.zipcode,
      lat: parseFloat(user.address.geo.lat),
      lng: parseFloat(user.address.geo.lng),
      company: user.company.name,
    };

    // Challenge A: add postCount column if posts data is available
    if (posts) {
      row.postCount = postCounts[user.id] || 0;
    }

    return row;
  });

  // Filter out any records with invalid email
  const clean = rows.filter((r) => r.email.includes("@"));

  console.log("[TRANSFORM] Clean records:", clean.length);
  return clean;
}

// ── 3. LOAD ───────────────────────────────────────
function load(rows) {
  console.log("[LOAD] Writing", rows.length, "rows to CSV...");

  // Build the header row from the keys of the first object
  const headers = Object.keys(rows[0]);

  // Build each data row — wrap values in quotes to handle commas inside values
  const lines = rows.map((row) => {
    return headers.map((h) => `"${row[h]}"`).join(",");
  });

  // Join header + data rows with newlines
  const csv = [headers.join(","), ...lines].join("\n");

  // Write to file
  const filePath = path.join(__dirname, "output.csv");
  fs.writeFileSync(filePath, csv, "utf8");

  console.log("[LOAD] Saved to output.csv");
  console.log("[LOAD] File path:", filePath);
}

// ── MAIN ──────────────────────────────────────────
async function main() {
  // Exercise 1 + Challenge A: fetch both users and posts
  const raw = await extract(API_URL);
  const posts = await extract(POSTS_API_URL);

  // Exercise 2: transform with post counts
  const clean = transform(raw, posts);

  // Exercise 2: preview clean data in terminal
  console.log("\n[TRANSFORM] Preview of clean data:");
  console.table(clean);

  // Exercise 3: write CSV
  load(clean);
}

main().catch((err) => {
  // Challenge B: friendly error handling
  console.error("[ERROR] ETL pipeline failed:", err.message);
  process.exit(1);
});
