const http = require('http');
http.createServer(function(req, res) {
    res.write("i am here")
    res.end()
}).listen(8080);