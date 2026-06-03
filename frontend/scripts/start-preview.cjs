const { spawn } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const port = process.env.PORT || "4173";
const viteCliPath = path.resolve(__dirname, "..", "node_modules", "vite", "bin", "vite.js");
const distPath = path.resolve(__dirname, "..", "dist");

const runVite = (args) =>
  new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [viteCliPath, ...args], { stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`vite ${args.join(" ")} exited with code ${code}`));
    });
  });

const start = async () => {
  try {
    if (!fs.existsSync(distPath)) {
      console.log("dist folder not found, running vite build first...");
      await runVite(["build"]);
    }

    await runVite(["preview", "--host", "0.0.0.0", "--port", port]);
  } catch (err) {
    console.error("Failed to start Vite preview:", err.message);
    process.exit(1);
  }
};

start();
