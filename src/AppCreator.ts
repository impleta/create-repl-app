import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export class AppCreator {

  static start() {
    if (!AppCreator.checkArgs()) {
      return;
    }

    const projectName = process.argv[2];
    const currentPath = process.cwd();
    const projectPath = path.join(currentPath, projectName);
    const git_repo = 'https://github.com/impleta/create-repl-app';

    AppCreator.createAppFolder(projectPath, err => { return err; });

    console.log('Downloading files...');
    execSync(`git clone --depth 1 --filter=blob:none --sparse ${git_repo} ${projectPath}`);

    process.chdir(projectPath);
    execSync(`git sparse-checkout set app-template`)
    
    AppCreator.updatePackageJson(projectName, projectPath);

    AppCreator.removeUnnecessaryFiles();

    console.log('Installing dependencies...');
    execSync('npm install');

    console.log(`${projectName} is ready.`);
  }

  static removeUnnecessaryFiles() {
    console.log('Removing unnecessary files');

    execSync('npx rimraf ./.git ./src/delete-after-create');
  }

  static createAppFolder(projectPath: string, errorHandler: (err: NodeJS.ErrnoException) => void) {
    fs.mkdir(projectPath, err => {
      if (err) {
        console.log(`Error creating folder ${projectPath}: ${err}`);
        errorHandler(err);
      }
    });

  }
  static checkArgs() {
    // TODO: Ask for the application name if none is provided, instead of
    // TODO: exiting.
    if (process.argv.length < 3) {
      console.log('Please provide a name for your repl application.');
      console.log('Ex: npx create-repl-app my-repl');
      return false;
    }

    return true;
  }

  static async updatePackageJson(projectName: string, projectPath: string) {
    console.log('Updating package.json...');

    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

    packageJson.name = projectName;
    packageJson.private = true;

    const bin = packageJson.bin;
    delete bin['create-repl-app'];
    bin[projectName] = "build/src/index.js";

    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  }
}
