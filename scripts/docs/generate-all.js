/**
 * Freedomly — generate-all.js
 * Regenerates all documents in parallel.
 *
 * Usage:
 *   npm run update-docs
 *   node scripts/docs/generate-all.js
 */

const { execFile } = require("child_process");
const path = require("path");

const SCRIPTS = [
  "deck.js",
  "prd.js",
  "user-guide.js",
  "sales-guide.js",
  "roadmap.js",
  "business-model.js",
];

const dir = __dirname;

Promise.all(
  SCRIPTS.map(
    (script) =>
      new Promise((resolve, reject) => {
        execFile(
          process.execPath,
          [path.join(dir, script)],
          { cwd: path.join(dir, "../..") },
          (err, stdout, stderr) => {
            if (err) {
              console.error(`✗ ${script}:\n${stderr || err.message}`);
              reject(err);
            } else {
              process.stdout.write(stdout);
              resolve();
            }
          }
        );
      })
  )
)
  .then(() => console.log("\nAll documents regenerated successfully."))
  .catch(() => process.exit(1));
