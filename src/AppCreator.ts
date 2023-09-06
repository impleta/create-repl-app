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
    const git_repo = 'https://github.com/impleta/repl-app-template';

    if (!AppCreator.createAppFolder(projectPath)) {
      return;
    }

    console.log('Downloading files...');
    execSync(`git clone --depth 1 ${git_repo} ${projectPath}`);

    process.chdir(projectPath);

    AppCreator.updateFiles(projectName, projectPath);

    AppCreator.removeUnnecessaryFiles();

    console.log('Installing dependencies...');
    execSync('npm install');

    console.log(`${projectName} is ready.`);
  }
  
  static updateFiles(projectName: string, projectPath: string) {
    AppCreator.updateReadme(projectName, projectPath);
    AppCreator.updatePackageJson(projectName, projectPath);
  }

  static updateReadme(projectName: string, projectPath: string) {
    const readmePath = path.join(projectPath, 'readme.md');
    fs.writeFileSync(readmePath, `${projectName} REPL application.`);
  }

  static removeUnnecessaryFiles() {
    console.log('Removing unnecessary files');

    execSync('npx rimraf ./.git');
  }

  static createAppFolder(projectPath: string) {
    if (fs.existsSync(projectPath)) {
      console.log(`Folder ${projectPath} already exists.`);
      return false;
    }

    try {
      fs.mkdirSync(projectPath);
    } catch(err) {
      console.log(`Error creating folder ${projectPath}: ${err}`);
      return false;
    }

    return true;
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

    const templateAppName = '{{app_name}}';
    packageJson.name = projectName;
    packageJson.main = packageJson.main.replace(templateAppName, projectName);
    
    const bin = packageJson.bin;

    bin[projectName] = bin[templateAppName].replace(templateAppName, projectName);
    delete bin[templateAppName];

    fs.writeFileSync(path.join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));
  }
}
