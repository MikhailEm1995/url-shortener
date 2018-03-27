require('./init');

const express = require('express');
const app = express();

const router = require('./modules/router/index');

const PORT = 3000;

app.use(router(express));

app.listen(PORT, () => {
    console.log('Server started at port: ', PORT);
});
