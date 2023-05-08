// 3. Собирает в единый файл стили из папки **styles** и помещает их в файл **project-dist/style.css**.
// 4. Копирует папку **assets** в **project-dist/assets**
// - [ ] После завершения работы скрипта должна быть создана папка **project-dist**
// - [ ] В папке **project-dist** должны находиться файлы **index.html** и **style.css** 
// - [ ] В папке **project-dist** должна находиться папка **assets** являющаяся точной копией папки **assets** находящейся в **06-build-page**
// - [ ] Запрещается использование fsPromises.cp()
// - [ ] Файл **index.html** должен содержать разметку являющуюся результатом замены шаблонных тегов в файле **template.html**
// - [ ] Файл **style.css** должен содержать стили собранные из файлов папки **styles** 
// - [ ] При добавлении компонента в папку и соответствующего тега в исходный файл **template.html** повторное выполнение скрипта приведёт файл **index.html** в папке **project-dist** в актуальное состояние перезаписав его. Файл **style.css** и папка **assets** так же должны поддерживать актуальное состояние 
// - [ ] При записи двух и более шаблонных тегов подряд в файле **template.html**, разделенных между собой только пробелами **без переноса строки**, не должно возникать ошибок выполнения кода. Например, `{{about}} {{articles}}` должно расцениваться как 2 отдельных компонента
// - [ ] Исходный файл **template.html** не должен быть изменён в ходе выполнения скрипта
// - [ ] Запись в шаблон содержимого любых файлов кроме файлов с расширением **.html** является ошибкой  
// Один из возможных порядков выполнения задачи:
// 1. Импорт всех требуемых модулей
// 2. Прочтение и сохранение в переменной файла-шаблона
// 3. Нахождение всех имён тегов в файле шаблона
// 4. Замена шаблонных тегов содержимым файлов-компонентов
// 5. Запись изменённого шаблона в файл **index.html** в папке **project-dist**
// 6. Использовать скрипт написанный в задании **05-merge-styles** для создания файла **style.css**
// 7. Использовать скрипт из задания **04-copy-directory** для переноса папки **assets** в папку project-dist 
const fs = require('fs');
const path = require('path');
const projectPath = path.resolve(__dirname, 'project-dist');
const outputPath = path.resolve(__dirname, 'project-dist', 'index.html');
const templatePath = path.resolve(__dirname, 'template.html');
const componentsPath = path.resolve(__dirname, 'components');
const outputStyles = path.resolve(__dirname, 'project-dist', 'style.css');
const styles = path.resolve(__dirname, 'styles');
const inputAssets = path.resolve(__dirname, 'assets');
const outputAssets = path.resolve(__dirname, 'project-dist', 'assets');

fs.access(projectPath, (error) => {
  if (!error) {
    fs.rm(projectPath, { recursive: true }, () => {
      fs.mkdir(projectPath, { recursive: true }, (err) => {
        if (err) {
          throw err
        } else {
          fs.copyFile(templatePath, outputPath, (err) => {
            if (err) { throw err } else {
              findInsert();
            }
          });
          fs.access(outputAssets, function (error) {
            if (!error) {
              fs.rm(outputAssets, { recursive: true }, () => {
                copyFolder(inputAssets, outputAssets);
              }
              );
            } else {
              copyFolder(inputAssets, outputAssets);
            }
          });
        }
      });
    }
    );
  } else {
    fs.mkdir(projectPath, { recursive: true }, (err) => {
      if (err) {
        throw err
      } else {
        fs.copyFile(templatePath, outputPath, (err) => {
          if (err) { throw err } else {
            findInsert();
          }
        });
        fs.access(outputAssets, function (error) {
          if (!error) {
            fs.rm(outputAssets, { recursive: true }, () => {
              copyFolder(inputAssets, outputAssets);
            }
            );
          } else {
            copyFolder(inputAssets, outputAssets);
          }
        });
      }
    });
  }
})

function findInsert() {
  fs.readFile(outputPath, 'utf-8', (err, data) => {
    if (err) {
      throw err
    } else {
      let copyData = data;
      if (copyData.includes('{{')) {
        let startPosition = copyData.indexOf('{{');
        let endPosition = copyData.indexOf('}}');
        let insert = copyData.slice(startPosition + 2, endPosition);
        injectHtml(insert);
      }
    }
  });
}

function injectHtml(tag) {
  fs.readFile(outputPath, 'utf-8', (err, data) => {
    if (err) { throw err } else {
      let replaceData = data;
      if (replaceData.includes(`{{${tag}}}`)) {
        fs.readFile(path.resolve(componentsPath, `${tag}.html`), 'utf-8', (err, insertHtml) => {
          let startIndex = replaceData.indexOf("{{");
          let beforeInsert = replaceData.slice(0, startIndex);
          let afterInsert = replaceData.slice(startIndex + 2 + tag.length + 2);
          replaceData = beforeInsert + insertHtml + afterInsert;
          fs.writeFile(outputPath, replaceData, (err) => { if (err) { throw err } });
        })
      }
    }
  });
  readCss();
  findInsert();
}

function readCss() {
  fs.writeFile(outputStyles, 'utf-8', (err) => { if (err) { throw err } });
  fs.promises.readdir(styles, { withFileTypes: true })
    .then(dirList => {
      dirList.forEach((content) => {
        const contentPath = path.resolve(styles, content.name);
        if ((content.isFile()) && (path.extname(contentPath) === '.css')) {
          fs.readFile(contentPath, 'utf-8', appendToFile)
        };
      });
    })
    .catch(err => { console.log(err) });

  function appendToFile(error, data) {
    if (error) throw error;
    else {
      fs.appendFile(outputStyles, data, (err) => { if (err) { throw err } });
    }
  }
}

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