/* eslint-disable @typescript-eslint/no-explicit-any */
import { execSync } from "child_process";

const diff = execSync(`git diff --name-only origin/main HEAD`).toString();

const files = diff.trim().split("\n");

console.log("âšī¸ Changed files:");
console.log(
  files
    .filter(Boolean)
    .map((str) => `  - ${str}`)
    .join("\n")
);

try {
  console.log("âŗ Checking type errors..");
  execSync("yarn tsc --noEmit", {});

  console.log("đģ No errors!");
} catch (_err) {
  const err = _err as any;

  const output = err.stdout.toString() as string;

  const filesWithTypeErrors = files.filter((file) => output.includes(file));

  if (!filesWithTypeErrors.length) {
    console.log(`đ You haven't introduced any new type errors!`);
    process.exit(0);
  }
  console.log("â â â You seem to have touched files that have type errors â â â");
  console.log("đ Please inspect the following files:");
  console.log(filesWithTypeErrors.map((str) => `  - ${str}`).join("\n"));

  process.exit(1);
}
