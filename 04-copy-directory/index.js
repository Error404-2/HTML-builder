const fs = require('fs');
const path = require('path');
const fromFolder = path.resolve(__dirname, 'files');
const copyDir = path.resolve(__dirname, 'files-copy');

fs.access(copyDir, function (error) {
  if (!error) {
    fs.rm(copyDir, { recursive: true }, () => {
      copyFolder(fromFolder, copyDir);
    }
    );
  } else {
    copyFolder(fromFolder, copyDir);
  }
})

function copyFolder(from, target) {
  fs.mkdir(target, { recursive: true }, (err) => { if (err) throw err });
  fs.readdir(from, { withFileTypes: true }, (error, dirList) => {
    if (!error) {
      dirList.forEach((content) => {
        if (content.isDirectory()) {
          copyFolder(path.resolve(from, content.name), path.resolve(target, content.name));
        }
        if (content.isFile()) {
          fs.copyFile(path.resolve(from, content.name), path.resolve(target, content.name), (err) => { if (err) throw err });
        }
      });
    } else {
      console.log(error);
    }
  });
}
