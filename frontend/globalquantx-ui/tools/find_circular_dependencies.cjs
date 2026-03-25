#!/usr/bin/env node

const path = require("path");
const madge = require("madge");

const ROOT = path.join(__dirname, "../src");

madge(ROOT)
  .then((res) => {
    const circular = res.circular();

    if (circular.length === 0) {
      console.log("🎉 No circular dependencies found.");
    } else {
      console.log("⚠️ Circular dependencies detected:");
      circular.forEach((cycle) => console.log("  → " + cycle.join(" -> ")));
    }
  })
  .catch((err) => console.error(err));

