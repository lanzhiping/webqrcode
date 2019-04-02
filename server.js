const express = require('express');

express()
    .use('/', express.static('./src'))
    .listen(5000, () => console.log('server started at http://localhost:5000/'))
