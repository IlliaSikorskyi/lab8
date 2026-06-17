const http = require('http');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/count') {
    let bytes = 0;
    let chunks = 0;

    // Слухаємо подію 'data' для кожного отриманого шматка (chunk)
    req.on('data', (chunk) => {
      chunks += 1;
      bytes += chunk.length;
    });

    // Коли потік завершено, відправляємо JSON-відповідь
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ bytes, chunks }));
    });

    // Обробка помилок
    req.on('error', (err) => {
      console.error(err);
      res.statusCode = 500;
      res.end();
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});