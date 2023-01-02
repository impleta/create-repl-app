#!/usr/bin/env node

import { execSync } from 'child_process';
import path = require('path');
import fs = require('fs');

if (process.argv.length < 3) {
  console.log('Please provide a name for your repl application.');
  console.log('Ex: npx create-repl-app my-repl');
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = 'https://github.com/impleta/Replicant';

fs.mkdir(projectPath, err => {
  if (err) {
    console.log(`Error creating folder ${projectPath}: ${err}`)
    process.exit(1);
  }
})

async function updatePackageJson() {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.name = projectName;
  packageJson.private = true;
  const bin = packageJson.bin;
  delete Object.assign(bin, {[projectName.toLowerCase()]: bin['replicant'] })['replicant'];
  fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
}

function main() {
  try {
    console.log('Downloading files...');
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    console.log('Updating package.json...');
    updatePackageJson();

    console.log('Installing dependencies...');
    execSync('npm install');

    console.log('Removing unnecessary files');
    execSync('npx rimraf ./.git');
    execSync('npx rimraf ./src/create-repl-app.ts')
    
    console.log(`${projectName} is ready.`);

  } catch (error) {
    console.log(error);
  }
}

main();