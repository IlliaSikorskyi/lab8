const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  // Обробка маршруту /upload
  if (req.method === 'POST' && req.url === '/upload') {
    const filePath = path.join(process.cwd(), 'upload.txt');
    const writeStream = fs.createWriteStream(filePath);

    // Передаємо дані з запиту (req) у файл (writeStream)
    req.pipe(writeStream);

    // Коли запис завершено, відправляємо відповідь клієнту
    writeStream.on('finish', () => {
      res.statusCode = 200;
      res.end('File uploaded successfully');
    });

    // Обробка помилок під час запису
    writeStream.on('error', (err) => {
      console.error(err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    });
  } else {
    // Будь-який інший маршрут повертає 404
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});