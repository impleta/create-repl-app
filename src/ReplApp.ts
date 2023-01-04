import * as repl  from 'repl';
import * as vm from 'vm';
import * as fs from 'fs';
import * as Url from 'url';
import * as Path from 'path';
import {findUp} from 'find-up';
import { createRequire } from 'module';

interface LooseObject {
  [key:string]:any
}

interface ReplAppConfig {
  libs: string[]
}

export class ReplApp {
  
  static async start() {
 
    const currentFile = await createRequire(import.meta.url).resolve('.');
    const startPath = Path.dirname(currentFile);
    const configFileName = 'ReplApp.config.js';
    const configFile = await this.findFile(configFileName, startPath);

    let replicantContext = {};
    if (configFile) {
      const configUrl = Url.pathToFileURL(configFile);

      replicantContext = await import(configUrl.href);
    } else {
      console.log(`Did not find ${configFileName} in ${startPath} or its ancestor folders.`)
    }
    
    ReplApp.loadContext(replicantContext);
  }

  static loadContext(replicantContext: LooseObject) {
    const args = process.argv.slice(2);

    if (args.length <= 0) {
      Object.keys(replicantContext).forEach(k => {
        (global as any)[k] = replicantContext[k];  
      });

      repl.start({});
    } else {
      const text = fs.readFileSync(args[0], 'utf-8');    
      vm.runInNewContext(text, replicantContext);
    }
  }
  
  static async findFile(filename: string, startPath = '.') {
    try {
      let filePath = await findUp(filename, {cwd: startPath});
      return filePath;
    } catch(err) {
      console.error(err);
      return null;
    }
  }
  
}
