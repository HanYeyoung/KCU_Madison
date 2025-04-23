require('dotenv').config({ path: '.env.local' });

const express = require('express');
const app = express();
const port = 3001; // 기존 프론트와 겹치지 않게

// 테스트용 프론트 HTML
app.get('/', (req, res) => {
  const testKey = process.env.TEST_KEY; // 🔁 테스트할 Key로 바꿔줘
  const html = `
    <html>
      <head><title>프록시 이미지 테스트</title></head>
      <body>
        <h2>아래에 이미지가 보이면 성공 ✅</h2>
        <img src="http://localhost:3000/api/image-proxy?key=${encodeURIComponent(testKey)}" style="max-width:400px;" />
      </body>
    </html>
  `;
  res.send(html);
});

app.listen(port, () => {
  console.log(`✅ 이미지 테스트 페이지: http://localhost:${port}`);
});
