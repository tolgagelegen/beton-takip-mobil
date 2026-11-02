const https = require('https');

https.get('https://beton-takip-mobil.vercel.app', (res) => {
  let b = '';
  res.on('data', c => b += c);
  res.on('end', () => {
    console.log('INDEX HTML CONTENT:\n', b);
  });
});
