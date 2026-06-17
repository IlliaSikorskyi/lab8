const http = require('http');
const fs = require('fs');
const path = require('path');
const { pipeline } = require('stream');

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  if (url.pathname === '/missing-file' && req.method === 'GET') {
    const fileName = url.searchParams.get('fileName');

    if (!fileName) {
      res.statusCode = 400;
      return res.end('Missing fileName parameter');
    }

    const filePath = path.join(process.cwd(), fileName);

    try {
      // Перевіряємо доступність файлу перед створенням потоку
      await fs.promises.access(filePath, fs.constants.F_OK);
      
      const readStream = fs.createReadStream(filePath);
      
      // Використовуємо pipeline для надійної передачі даних
      pipeline(readStream, res, (err) => {
        if (err) {
          console.error('Помилка в pipeline:', err.message);
          // Ми не відправляємо тут відповідь, якщо потік уже почав передачу,
          // але pipeline закриє потоки і не "вб'є" процес сервера.
        }
      });

    } catch (err) {
      // Якщо файл не знайдено, відповідаємо статусом 500
      console.error('Файл не знайдено:', err.message);
      res.statusCode = 500;
      res.end('Internal Server Error: Could not read file');
    }

  } else {
    res.statusCode = 404;
    res.end('Not Found');
  }
});

const port = process.argv[2] || 3000;
server.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});