var express = require('express');
var app = express();
var cors = require('cors');
var mysql = require('./routes/mysql');
var users = require('./routes/users');
var project = require('./routes/project');
var bid = require('./routes/bid');

app.use(cors());
app.use(users);
app.use(project);
app.use(bid);

app.get('/', function (req, res) {
    var response = {
        result:"Hello World",
        tdata:"test data"
    };
    console.log(response.result +"  "+response.tdata);
    res.send(response);
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;