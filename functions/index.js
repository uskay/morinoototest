const functions = require("firebase-functions");
const fetch = require('node-fetch');

exports.proxy = functions.https.onRequest(async (request, response) => {
  const fetchURL = `http://morinooto.jp${request.url}`;
  const res = await fetch(fetchURL);
  const blob = await res.blob();
  response.type(blob.type);
  if(blob.type.includes('text/html')) {
    let html = await blob.text();
    html = html.replace(/morinooto\.jp/g, 'morinoototest.net');
    response.send(html);
    return;
  }
  const buffer = await blob.arrayBuffer();
  response.send(Buffer.from(buffer));
});
