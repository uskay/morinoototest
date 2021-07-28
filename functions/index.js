const functions = require("firebase-functions");
const fetch = require('node-fetch');


exports.proxy = functions.https.onRequest(async (request, response) => {
  const fetchURL = `http://morinooto.jp${request.url}`;
  const res = await fetch(fetchURL);
  const html = await res.text();
  response.send(html);
});
