const express = require('express');
const https = require('https');
const fs = require('fs');
const app = express().use('/', express.static('./src'));

https.createServer({
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cer')
}, app)
    .listen(5000, () => console.log('server started at https://localhost:5000/'))
