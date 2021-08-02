const functions = require("firebase-functions");
const fetch = require('node-fetch');

exports.proxy = functions.https.onRequest(async (request, response) => {
  console.log(request.url);
  const isFixMode = request.url.includes('?fix=on');
  const fetchURL = `http://morinooto.jp${request.url}`;
  const res = await fetch(fetchURL);
  const blob = await res.blob();
  response.type(blob.type);
  if(blob.type.includes('text/html')) {
    let html = await blob.text();
    // keep http://donate.morinooto.jp, http://applique.morinooto.jp/
    // http://localmedia.morinooto.jp as is
    html = html.replace(/\/\/morinooto\.jp/g, '//morinoototest.net');
    if (isFixMode) {
      // Need to fix data-src / data-srcset manually
      html = html.replace(/(data-)?src(set)?=["|'].?http:.+?["|']/g, (...arg) => {
        return arg[0].replace(/http:/g, "https:");
      });
      // Need to fix GA snippet manually
      html = html.replace(
        'http://www.google-analytics.com',
        'https://www.google-analytics.com');
      // Need to fix popular posts
      // Caveat: the XHR response includes multiple links that have
      // http:// schema. Should also research how they are used.
      html = html.replace(
        /("ajax_url":")http:.+morinooto.jp/g,
        '$1https://morinoototest.net');
    }
    response.send(html);
    return;
  }
  const buffer = await blob.arrayBuffer();
  response.send(Buffer.from(buffer));
});
