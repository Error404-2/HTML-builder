const fs = require('fs');
const path = require('path');

fs.writeFile(
  path.resolve(__dirname, 'mynotes.txt'), "",
  (err) => {
    if (err) throw err;
    console.log('Файл был создан');
  }
)

const { stdin, stdout } = process;

stdout.write('Напиши мне что-нибудь приятное =)\n');
stdin.on('data', data => {
  const dataStringified = data.toString().slice(0, 4);
  if (dataStringified === "exit") {
    process.exit();
  }

  fs.appendFile(
    path.resolve(__dirname, 'mynotes.txt'),
    data,
    err => {
      if (err) throw err;
      console.log("записано, что-нибудь ещё? ");
    }
  )

});
process.on('SIGINT', () => {
  process.exit();
});
process.on('exit', () => stdout.write('Спасибо, все записи сохранены. Удачи в изучении Node.js!'));