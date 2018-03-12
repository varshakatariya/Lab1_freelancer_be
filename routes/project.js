var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

var nBids = 0;

// details of particular single project
router.get('/project', function(req, res){
    console.log("Inside Project details")
    var project_id= req.param("project_id");
    console.log("Request param project id "+project_id);

    var getProject="select * from freelancer_prototype_db.project p where p.project_id="+project_id;
    console.log("Query is:"+getProject);
    var data = {
        projectName: "",
        description: "",
        files: "",
        skills: "",
        budgetRange: 0.0,
        averageBid: 0,
        numberOfBids: 0
    };

    getNumberOfBids(project_id);
    console.log("Number of Bids inside project function  : "+nBids);
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
                numberOfBids: nBids
            };
            res.send(data);
        }
    },getProject);
});

//get Number of Bids for particular project
function getNumberOfBids(project_id){
    var getBids="select count(*) as numberOfBids from freelancer_prototype_db.bid b where b.project_id=" +project_id;
    var bids = 0;
    mysql.fetchData(function(err,results){
        console.log("Bids function result", results[0].numberOfBids);
        if(results.length > 0) {
            nBids = results[0].numberOfBids;
        }
    },getBids);
    console.log("Bids inside function : ",nBids);
    return bids;
}

//get List of all open projects except user posted project
router.get('/listOfAllOpenProjectsForUserExceptPosted', function(req, res){
    var list= [];
    var data = {
        pList: []
    };
    var user_id= req.param("user_id");
    console.log("Request param user ID "+user_id);
    var getProjectList  = "select p.employer_id, p.title, p.avg_bid, p.project_completion_date, p.status ";
    getProjectList = getProjectList + "from freelancer_prototype_db.project p where p.status = '"+"Open"+"'";
    getProjectList = getProjectList + " and p.employer_id <>  "+user_id;

    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    employer_id: results[i].employer_id,
                    title: results[i].title,
                    avg_bid: results[i].avg_bid,
                    project_completion_date: results[i].project_completion_date,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.pList = list;
            console.log("inside listOfAllOpenProjectsForUserExceptPosted inside project",list);
            console.log("inside listOfAllOpenProjectsForUserExceptPosted inside project",list.length)
            res.send(data);
        }
    },getProjectList);
});



//get List of all projects posted by employer
router.get('/listOfAllProjectsPostedByEmployer', function(req, res){
    var list= [];
    var data = {
        eList: []
    };
    var user_id= req.param("user_id");
    console.log("Request param user ID "+user_id);
    var getProjectList = "select p.project_id, u.user_id, p.title, p.avg_bid, u.name, p.project_completion_date, p.status";
    getProjectList = getProjectList + " from freelancer_prototype_db.project p, freelancer_prototype_db.user u";
    getProjectList = getProjectList + " where u.user_id = p.employer_id and p.status = '"+"Open"+"' and u.user_id = "+user_id;
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while (i < results.length) {
                var project = {
                    project_id: results[i].project_id,
                    user_id: results[i].user_id,
                    projectName: results[i].title,
                    avg_bid: results[i].avg_bid,
                    userName: results[i].name,
                    project_completion_date: results[i].project_completion_date,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.eList = list;
            console.log("inside listOfAllProjectsPostedByEmployer inside project", list);
            console.log("inside listOfAllProjectsPostedByEmployer inside project", list.length)
            res.send(data);
        }
    },getProjectList);
});

module.exports = router;
