#!/usr/bin/env node
/**
 * generate-custom-data-from-json.js
 *
 * Reads `src/styles/tokens/default/build/json/tokens.json` (or a path you pass)
 * and writes `.vscode/tokens.custom-data.json` containing CSS custom property
 * definitions for use by the VS Code CSS language server (css.customData).
 *
 * Usage:
 *   node scripts/generate-custom-data-from-json.js
 *   node scripts/generate-custom-data-from-json.js <path/to/tokens.json>
 *   node scripts/generate-custom-data-from-json.js <path/to/tokens.json> <out/path/tokens.custom-data.json>
 *
 * The script is intentionally small and dependency-free so you can run it
 * in most Node environments.
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_TOKENS_PATH = path.join(
  __dirname,
  '..',
  'src',
  'styles',
  'tokens',
  'default',
  'build',
  'json',
  'tokens.json'
);
const DEFAULT_OUT_DIR = path.join(__dirname, '..', '.vscode');
const DEFAULT_OUT_PATH = path.join(DEFAULT_OUT_DIR, 'tokens.custom-data.json');

function usage() {
  console.log('Usage: node scripts/generate-custom-data-from-json.js [tokens.json path] [out path]');
  console.log('');
  console.log('If paths are omitted the script will use:');
  console.log(`  tokens: ${DEFAULT_TOKENS_PATH}`);
  console.log(`  out:    ${DEFAULT_OUT_PATH}`);
}

function readJsonSync(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    throw new Error(`Failed to read/parse JSON at ${filePath}: ${err.message}`);
  }
}

function ensureDirSync(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function buildCustomDataFromTokens(tokensObject, sourceFilename) {
  // tokensObject expected to be a flat object: { "token-key": "value", ... }
  const properties = Object.keys(tokensObject).map((key) => {
    // The CSS custom-data schema expects property names to be the full custom prop name.
    // We'll prefix with `--` so completions in VS Code look like var(--<name>).
    return {
      name: `--${key}`,
      description: `Token from ${path.basename(sourceFilename)}`,
      default: String(tokensObject[key]),
      values: []
    };
  });

  return {
    version: 1.1,
    properties
  };
}

function writeOut(pathToWrite, data) {
  try {
    fs.writeFileSync(pathToWrite, JSON.stringify(data, null, 2) + '\n', 'utf8');
  } catch (err) {
    throw new Error(`Failed to write file ${pathToWrite}: ${err.message}`);
  }
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.includes('-h') || argv.includes('--help')) {
    usage();
    process.exit(0);
  }

  const tokensPath = argv[0] ? path.resolve(process.cwd(), argv[0]) : DEFAULT_TOKENS_PATH;
  const outPath = argv[1] ? path.resolve(process.cwd(), argv[1]) : DEFAULT_OUT_PATH;
  const outDir = path.dirname(outPath);

  if (!fs.existsSync(tokensPath)) {
    console.error(`tokens.json not found at: ${tokensPath}`);
    console.error('If your tokens are in a different location, pass the path as the first argument.');
    usage();
    process.exit(2);
  }

  let tokens;
  try {
    tokens = readJsonSync(tokensPath);
  } catch (err) {
    console.error(err.message);
    process.exit(3);
  }

  if (typeof tokens !== 'object' || Array.isArray(tokens) || tokens === null) {
    console.error('Expected tokens.json to contain a top-level object of key/value pairs.');
    process.exit(4);
  }

  ensureDirSync(outDir);

  const customData = buildCustomDataFromTokens(tokens, tokensPath);

  try {
    writeOut(outPath, customData);
  } catch (err) {
    console.error(err.message);
    process.exit(5);
  }

  console.log(`Wrote CSS custom data for ${Object.keys(tokens).length} tokens to:`);
  console.log(`  ${outPath}`);
  console.log('');
  console.log('To enable in VS Code workspace settings add/update .vscode/settings.json with:');
  console.log('  {');
  console.log('    "css.customData": ["./.vscode/tokens.custom-data.json"],');
  console.log('    "scss.customData": ["./.vscode/tokens.custom-data.json"],');
  console.log('    "less.customData": ["./.vscode/tokens.custom-data.json"]');
  console.log('  }');
  console.log('');
  console.log('Reload the VS Code window (Developer: Reload Window) to pick up the new custom data.');
}

if (require.main === module) {
  main();
}
