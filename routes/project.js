var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

var nBids = 0;

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/postProject', function(req, res){
   var getProjectId="select max(project_id) as maxCnt from project";
    var errors;
    var d = new Date(req.param("endDate"));
    var finDate = d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
    var projectId;
    var userID = req.session.userID;
    console.log("SQL : :"+getProjectId);
    mysql.fetchData(function (error,results) {
        if(error){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else{
            if(results.length > 0){
                projectId = results[0].maxCnt+1;
                //endDate = changeToDate(req.param("endDate"));

                var addProject="insert into project (project_id,employer_id,title,description, files, skills, budget, avg_bid, status, project_completion_date) values ('"+projectId+"','"+userID+"','" + req.param("projectName") +"','" + req.param("description") +"','" + req.param("projectFiles") +"','"+ req.param("skills") +"','" + req.param("budget")+"','0','Open','"+finDate+"')";
                console.log("insert SQL : :"+addProject);
                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to add project at this time."
                        res.status(400).json({errors});
                    }
                    else{
                        if(results.affectedRows > 0){
                            console.log("SQL insert" +JSON.stringify(results));
                            res.send("Project Posted Successfully")
                        }
                    }
                },addProject);
            }
        }
    },getProjectId);
});


router.get('/userAsFreelancerProjects', function(req, res){
    var list= [];
    var data = {
        projectsList: []
    };
    var user_id= req.session.userID;
    var getProjectList  = "select p.project_id, p.description, u.name, p.employer_id, p.title, p.avg_bid, p.project_completion_date, p.status, p.skills ";
    getProjectList = getProjectList + "from project p, user u where p.status = '"+"Open"+"'";
    getProjectList = getProjectList + " and p.employer_id <>  "+user_id+" and p.employer_id=u.user_id";

    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    project_id: results[i].project_id,
                    description: results[i].description,
                    employer_name : results[i].name,
                    employer_id: results[i].employer_id,
                    title: results[i].title,
                    avg_bid: results[i].avg_bid,
                    skills:results[i].skills,
                    project_completion_date: results[i].project_completion_date,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.projectsList = list;
            res.send(data);
        }
    },getProjectList);
});

//get List of all projects posted by employer
router.get('/listOfAllProjectsPostedByEmployer', function(req, res){
    var list= [];
    var data = {
        bList: []
    };
    console.log("/listOfAllProjectsPostedByEmployer-----------------------------------------------",req.session.userID);
    var user_id= req.session.userID;
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
            data.bList = list;
            res.send(data);
        }
    },getProjectList);
});


function getBidsCount(project_id){
    var getBids="select count(*) as numberOfBids from bid b where b.project_id=" +project_id;
    var bids = 0;
    mysql.fetchData(function(err,results){
        console.log("Bids function result", results[0].numberOfBids);
        if(results.length > 0) {
            nBids = results[0].numberOfBids;
        }
    },getBids);
    return bids;
}

router.get('/getBids', function(req, res){
    var list= [];
    var data = {
        bidsList: []
    };
    var project_id= req.param("project_id");
    var getProjectList="select u.user_id, b.project_id,  u.name, b.bid_price, b.period_in_days";
    getProjectList= getProjectList + " from user u, bid b ";
    getProjectList= getProjectList + " where b.user_id = u.user_id and b.project_id = "+project_id;

    console.log(getProjectList);
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    userId : results[i].user_id,
                    project_id : results[i].project_id,
                    name: results[i].name,
                    bid_price: results[i].bid_price,
                    period_in_days: results[i].period_in_days
                }
                list.push(project);
                i++;
            }
            data.bidsList = list;
            res.send(data);
        }
    },getProjectList);
});

router.post('/bidProjectNow', function(req, res){
    var bid_id;
    var user_id = req.session.userID;
    var bidProject="insert into bid(user_id,project_id,bid_price,period_in_days) values";
    bidProject= bidProject + " ('"+user_id+"','"+req.param("project_id")+"','"+req.param("bid_price")+"','"+req.param("period_in_days")+"' )";
    console.log("insert SQL : :"+bidProject);
    var errors;
    mysql.fetchData(function (error,results) {
        if(error){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else{
            if(results.affectedRows > 0){
                var update_bid_count="update project set avg_bid = avg_bid+1 where project_id = "+req.param("project_id");
                console.log("insert SQL : :"+update_bid_count);

                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to add project at this time."
                        res.status(400).json({errors});
                    }
                    else{
                        if(results.affectedRows > 0){
                            console.log("SQL insert" +JSON.stringify(results));
                            res.send("Bid Done Successfully");
                        }
                    }
                },update_bid_count);
            }
        }
    },bidProject);
});

router.get('/getProjectDetails', function(req, res){
    console.log("Inside Project details");
    var project_id= req.param("project_id");
    getBidsCount(project_id);
    
    var getProject="select * from project where project_id="+project_id;
    console.log("SQL :"+getProject);

    var data = {
        projectName: "",
        description: "",
        files: "",
        skills: "",
        budgetRange: "",
        averageBid: "",
        numberOfBids: ""
    };
    mysql.fetchData(function(error,results){
        if(results.length > 0) {
            data = {
                projectName: results[0].title,
                description: results[0].description,
                files: results[0].files,
                skills: results[0].skills,
                budget: results[0].budget,
                averageBid:  results[0].avg_bid,
                numberOfBids: nBids
            };
            res.send(data);
        }
    },getProject);
});

router.post('/hireFreelancer', function(req, res){
    //var addFreelancerDetails = "insert into project (user_id) values ('" + req.param("user_id") +"') where project_id = "+req.param("project_id");
    var addFreelancerDetails = "update project set user_id ='" + req.param("user_id") +"' where project_id = "+req.param("project_id");
    var error = "";
    var data = {};
    mysql.fetchData(function(err,results){
        console.log(JSON.stringify(results));
        if(err){
            error = "Unable to process your request";
            res.status(400).json({error});
        }
        else if(results.affectedRows > 0) {
            data.message = "Freelancer Hired Successfully";
            res.send(data);
        }
    },addFreelancerDetails);
});

function changeToDate(date){
    if (date instanceof Date)
        return date.toLocaleFormat("%Y-%m-%d %H:%M:%S")
}

module.exports = router;