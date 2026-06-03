const { spawn } = require("node:child_process");
const path = require("node:path");

const port = process.env.PORT || "4173";
const viteCliPath = path.resolve(__dirname, "..", "node_modules", "vite", "bin", "vite.js");

const child = spawn(process.execPath, [viteCliPath, "preview", "--host", "0.0.0.0", "--port", port], {
  stdio: "inherit",
});

child.on("exit", (code) => process.exit(code ?? 0));
child.on("error", (err) => {
  console.error("Failed to start Vite preview:", err.message);
  process.exit(1);
});
