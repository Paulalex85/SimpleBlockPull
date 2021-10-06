const http = require('http');

http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' }); // http header
    res.write('<h1>Hello World!<h1>'); //write a response
    res.end(); //end the response
}).listen(3000, function() {
    console.log('server start at port 3000'); //the server object listens on port 3000
});