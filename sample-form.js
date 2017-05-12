'use strict';

const Express = require('express');
const Webtask = require('webtask-tools');
const app = Express();
const bodyParser = require('body-parser');
const querystring = require('querystring');
const crypto = require('crypto');

const urlencodedParser = bodyParser.urlencoded({ extended: true });
const textParser = bodyParser.text({ type: '*/*' });

const view = (function view() {/*
  <html>
    <body>
      <form action="process" method="post">
        <input name="redirectUrl" type="hidden" value="<%= redirectUrl %>"/>
        <div>Series Title: <input name="series-title" type="text"/></div>
        <div>Episode Title: <input name="Episode-title" type="text"/></div>
        <button type="submit">Submit</button>
      </form>
    </body>
  </html>
*/}).toString().match(/[^]*\/\*([^]*)\*\/\s*\}$/)[1];

const registrationKey = '<Insert Metadata Registration Key>';

const generateSignedUrl = (requestUrl, requestBody, registrationKey) => {
    const requestTimestamp = new Date().toISOString();

    // Generate canonical query string
    const algorithmParam = 'X-Sig-Algorithm=SIG1-HMAC-SHA256';
    const dateParam = `X-Sig-Date=${requestTimestamp}`;
    const canonicalQueryString = `${querystring.escape(algorithmParam)}&${querystring.escape(dateParam)}`;

    // Generate the string to sign
    const requestBodyHash = crypto.createHash('sha256').update(requestBody).digest('hex');
    const stringToSign = `${requestTimestamp}\n${requestUrl}\n${canonicalQueryString}\n${requestBodyHash}`;

    // Generate the signing key
    let hmac = crypto.createHmac('sha256', registrationKey);
    const signingKey = hmac.update(requestTimestamp).digest();

    // Generate request signature
    hmac = crypto.createHmac('sha256', signingKey);
    const signature = hmac.update(stringToSign).digest('hex');

    // Generate the signed URL
    const signatureParam = `X-Sig-Signature=${signature}`;
    return `${requestUrl}?${algorithmParam}&${dateParam}&${signatureParam}`;
};

app.use('/form', urlencodedParser, function (req, res) {
  res.send(require('ejs').render(view, {
    redirectUrl: req.body.redirectUrl 
  }));
});

app.post('/process', textParser, function (req, res) {
  const form = querystring.parse(req.body);
  const signedUrl = generateSignedUrl(form.redirectUrl, req.body, registrationKey);
  res.set('Location', signedUrl);
  res.status(307).end();
});

module.exports = Webtask.fromExpress(app);
