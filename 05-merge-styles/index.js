const fs = require('fs');
const path = require('path');
const projectDist = path.resolve(__dirname, 'project-dist');
const inputDir = path.resolve(__dirname, 'styles');
const outputFile = path.join(__dirname, 'project-dist', 'bundle.css');
const writeStream = fs.createWriteStream(outputFile);

function readCss(from) {
  fs.readdir(from, { withFileTypes: true }, (error, dirList) => {
    if (!error) {
      dirList.forEach((content) => {
        const contentPath = path.resolve(from, content.name)
        if ((content.isFile()) && (path.extname(contentPath) === '.css')) {
          const readStream = fs.createReadStream(contentPath);
          readStream.on('data', data => {
            writeStream.write(data.toString() + '\n');
          });
        }
      });
    } else {
      console.log(error);
    }
  });
}

readCss(inputDir);
