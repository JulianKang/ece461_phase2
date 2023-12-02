import * as fs from 'fs-extra';
import * as path from 'path';
const currentDirectory = __dirname;
const directoryPath = path.join(currentDirectory, 'cloned_repositories');
console.log(fs.existsSync(directoryPath))
if (fs.existsSync(directoryPath)) {
    try {
      // Remove the directory
      fs.removeSync(directoryPath);
      console.log(`Directory ${directoryPath} removed successfully.`);
    } catch (err) {
      console.log(`Error removing directory ${directoryPath}: ${err}`);
    }
  }