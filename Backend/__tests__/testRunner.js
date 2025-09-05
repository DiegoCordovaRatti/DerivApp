#!/usr/bin/env node

/**
 * Test Runner Script for DerivApp Backend
 * 
 * This script provides various testing commands and utilities
 * for the backend testing suite.
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const commands = {
  // Run all tests
  'test': ['npx', 'jest'],
  
  // Run tests in watch mode
  'test:watch': ['npx', 'jest', '--watch'],
  
  // Run tests with coverage
  'test:coverage': ['npx', 'jest', '--coverage'],
  
  // Run only unit tests
  'test:unit': ['npx', 'jest', '--testPathPattern=__tests__/controllers'],
  
  // Run only integration tests
  'test:integration': ['npx', 'jest', '--testPathPattern=__tests__/integration'],
  
  // Run specific test file
  'test:file': (filename) => ['npx', 'jest', filename],
  
  // Run tests and generate reports
  'test:ci': ['npx', 'jest', '--coverage', '--ci', '--reporters=default', '--reporters=jest-junit']
};

function runCommand(command, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      cwd: projectRoot,
      shell: process.platform === 'win32'
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'test';
  
  if (!commands[command]) {
    console.error(`Unknown command: ${command}`);
    console.log('Available commands:');
    Object.keys(commands).forEach(cmd => {
      console.log(`  ${cmd}`);
    });
    process.exit(1);
  }

  try {
    console.log(`Running: ${command}`);
    
    if (command === 'test:file' && args[1]) {
      await runCommand(...commands[command](args[1]));
    } else {
      await runCommand(...commands[command]);
    }
    
    console.log(`✅ ${command} completed successfully`);
  } catch (error) {
    console.error(`❌ ${command} failed:`, error.message);
    process.exit(1);
  }
}

main();






