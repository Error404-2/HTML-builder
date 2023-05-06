const fs = require('fs');
const path = require('path');

const folderPath = path.resolve(__dirname, 'secret-folder');
fs.readdir(folderPath, { withFileTypes: true }, (error, dirList) => {
  if (!error) {
    dirList.forEach((file) => {
      if (file.isFile()) {
        let fileName = file.name;
        let fileExt = path.extname(fileName);
        let fileShortName = path.basename(fileName, fileExt);
        fs.stat(path.resolve(folderPath, fileName), (err, stats) => {
          if (err) {
            return console.log(err);
          }
          fileExt = fileExt.slice(1);
          console.log(`${fileShortName} - ${fileExt} - ${stats.size}`);
        })
      }

    });
  } else {
    console.error(error);
  }
})