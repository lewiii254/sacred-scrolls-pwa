#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

// Generate cache version based on current timestamp and package version
const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const version = packageJson.version || '0.0.0';
const timestamp = Date.now();
const cacheVersion = `${version}-${timestamp}`;

console.log(`Generating service worker with cache version: ${cacheVersion}`);

// Read the service worker template
const swTemplatePath = path.join(projectRoot, 'public', 'sw.js');
const swTemplate = fs.readFileSync(swTemplatePath, 'utf8');

// Replace static cache version with dynamic one
const updatedSW = swTemplate
  .replace(/const CACHE_NAME = 'sacred-scrolls-v1';/, `const CACHE_NAME = 'sacred-scrolls-v${cacheVersion}';`)
  .replace(/const STATIC_CACHE_NAME = 'sacred-scrolls-static-v1';/, `const STATIC_CACHE_NAME = 'sacred-scrolls-static-v${cacheVersion}';`)
  .replace(/const BIBLE_CACHE_NAME = 'sacred-scrolls-bible-v1';/, `const BIBLE_CACHE_NAME = 'sacred-scrolls-bible-v${cacheVersion}';`)
  .replace(/const APP_VERSION = '';/, `const APP_VERSION = '${cacheVersion}';`);

// Write the updated service worker
fs.writeFileSync(swTemplatePath, updatedSW);

// Also create a version file that the app can read
const versionInfo = {
  version: cacheVersion,
  buildTime: new Date().toISOString(),
  appVersion: version
};

fs.writeFileSync(
  path.join(projectRoot, 'public', 'version.json'), 
  JSON.stringify(versionInfo, null, 2)
);

console.log('Service worker updated with dynamic cache version');
console.log('Version info written to public/version.json');