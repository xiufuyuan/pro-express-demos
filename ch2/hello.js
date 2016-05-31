const express = require('express');

const app = express();
const port = 3000;

app.get('/name/:user_name', function (req, resp) {
	resp.status(200);
	resp.set('Content-Type', 'text/html');
	resp.send(`<html><body><h1>Hello ${req.params.user_name}</h1></body></html>`)
});

app.get('*', function (req, resp) {
	resp.end('Hello World');
});

app.listen(port, function () {
	console.log(`The server is running an http://localhost:${port}`);
});

