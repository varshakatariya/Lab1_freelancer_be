var express = require('express');
var app = express();
var cors = require('cors');
var mysql = require('./routes/mysql');

app.use(cors());

app.get('/', function (req, res) {
    var response = {
        result:"Hello World",
        tdata:"test data"
    };
    console.log(response.result +"  "+response.tdata);
    res.send(response);
});

var check = 0;

app.get('/project', function(req, res){
    console.log("Inside Project");
    var getUser="select * from project";
    console.log("Query is:"+getUser);
    var data = {
        projectName: "",
        description: "",
        files: "",
        skills: "",
        budgetRange: 0.0,
        averageBid: 0,
        numberOfBids: 0
    };

    getNumberOfBids();
    console.log("Number of Bids : "+check);
    mysql.fetchData(function(err,results){
        console.log("result",results);
        if(results.length > 0) {
            data = {
                projectName: results[0].title,
                description: results[0].description,
                files: results[0].files,
                skills: results[0].skills,
                budgetRange: results[0].budgetRange,
                averageBid:  results[0].averageBid,
                numberOfBids: check
            };

            console.log(data.numberOfBids);
            res.send(data);
        }
    },getUser);
});

function getNumberOfBids(){
    var getBids="select count(*) as numberOfBids from freelancer_prototype_db.bid b where b.project_id = 1";
    var bids = 0;
    mysql.fetchData(function(err,results){
        console.log("Bids function result", results[0].numberOfBids);
        if(results.length > 0) {
            check = results[0].numberOfBids;
        }
    },getBids);
    console.log("Bids inside function : ",check);
    return bids;
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;