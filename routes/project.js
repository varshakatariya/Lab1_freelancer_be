var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

router.post('/project', function(req, res){
    console.log("Inside Project");
    var getUser="select * from project";
    console.log("Query is:"+getUser);
    var data={};

    mysql.fetchData(function(err,results){
        console.log("result",results);
    },getUser);
});

module.exports = router;
