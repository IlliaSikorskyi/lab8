const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const fileName = parsedUrl.query.fileName;

  // Перевірка наявності параметра fileName
  if (!fileName) {
    res.statusCode = 400;
    return res.end('Missing fileName parameter');
  }

  const filePath = path.join(process.cwd(), fileName);

  // Перевірка існування файлу
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.statusCode = 400;
      return res.end('File not found');
    }

    // Встановлення заголовків
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.statusCode = 200;

    // Створення потоку читання та передача в відповідь
    const readStream = fs.createReadStream(filePath);
    readStream.pipe(res);

    // Обробка помилок потоку
    readStream.on('error', (streamErr) => {
      console.error(streamErr);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  });
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});