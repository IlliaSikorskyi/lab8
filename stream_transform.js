const http = require('http');
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  if (url.pathname === '/upper' && req.method === 'GET') {
    const fileName = url.searchParams.get('fileName');

    if (!fileName) {
      res.statusCode = 400;
      return res.end();
    }

    const filePath = path.join(process.cwd(), fileName);

    // Перевірка існування файлу
    if (!fs.existsSync(filePath)) {
      res.statusCode = 400;
      return res.end();
    }

    // Створюємо Transform stream для перетворення тексту у верхній регістр
    const upperCaseTransform = new Transform({
      transform(chunk, encoding, callback) {
        this.push(chunk.toString().toUpperCase());
        callback();
      }
    });

    res.statusCode = 200;
    
    // Ланцюжок: Читання -> Трансформація -> Відповідь
    fs.createReadStream(filePath)
      .pipe(upperCaseTransform)
      .pipe(res);

  } else {
    res.statusCode = 404;
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port);