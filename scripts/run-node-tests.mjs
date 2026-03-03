import { readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const rootArg = process.argv[2] ?? ".tmp-tests/tests";
const rootDir = resolve(process.cwd(), rootArg);

const collectTestFiles = (dir, acc = []) => {
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      collectTestFiles(fullPath, acc);
      continue;
    }
    if (entry.endsWith(".test.js")) {
      acc.push(fullPath);
    }
  }
  return acc;
};

let testFiles = [];
try {
  testFiles = collectTestFiles(rootDir);
} catch (error) {
  console.error("Unable to discover compiled tests", { rootDir, error });
  process.exit(1);
}

if (testFiles.length === 0) {
  console.error("No compiled test files found", { rootDir });
  process.exit(1);
}

testFiles.sort();

const result = spawnSync(process.execPath, ["--test", ...testFiles], {
  stdio: "inherit",
});

if (typeof result.status === "number") {
  process.exit(result.status);
}

process.exit(1);
