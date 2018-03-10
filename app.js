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
var user = {
    userId: 0,
    name: "",
    emailId: "",
    contact: 0,
    aboutMe: "",
    skills: "",
    profileImage: "",
    designation: "",
    postProjectId: 0
}
var listOfProject = {
    projects: []
};


// details of particular project
app.get('/project', function(req, res){
    var userEmail= req.param("email");
    console.log("Request param email "+userEmail);
    user.emailId = userEmail;

    getUserDetails(user);
    console.log("User",JSON.stringify(user));
    console.log("Inside Project");
    var getProject="select * from freelancer_prototype_db.project p where p.project_id=1";
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
    },getProject);
});

//get Number of Bids for particular project
function getNumberOfBids(){
    var getBids="select count(*) as numberOfBids from freelancer_prototype_db.bid b where b.project_id=1";
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

//get particular user details
function getUserDetails(user){
    var getUser="select * from freelancer_prototype_db.user u where u.email_id ='"+user.emailId+"'";
    mysql.fetchData(function(err,results){
       if(results.length > 0) {
            user.userId =  results[0].user_id;
            user.name =  results[0].name;
            user.emailId =  results[0].email_id;
            user.contact =  results[0].contact;
            user.aboutMe =  results[0].about_me;
            user.skills =  results[0].skills;
            user.profileImage =  results[0].profile_image;
            user.designation =  results[0].designation;
            user.postProjectId =  results[0].post_project_id;
        }
    },getUser);
    console.log("User inside function : ",user);
    return user;
}

//get List of all open projects except employer posted project
function getListOfAllOpenProjects(){
    var getProjectList  = "select p.employer_id, p.title, p.avg_bid, p.project_completion_date, p.status ";
    getProjectList = getProjectList + "from freelancer_prototype_db.project p where p.status = '"+"Open"+"'";
    getProjectList = getProjectList + " and p.employer_id <>  "+user_id;

    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = results.length;
            while(i>0) {
                var project = {
                    projectName: results[i].projectName,
                    description: results[i].description,
                    files: results[i].files,
                    skills: results[i].skills,
                    budgetRange: results[i].skills,
                    averageBid: results[i].averageBid,
                    numberOfBids: results[i].numberOfBids
                }
                listOfProject.push(project);
                i--;
            }
        }
        console.log("List of Projects : ",listOfProject);
    },getProjectList);
    console.log("User inside function : ",user);
    return user;
}

//get list of all bids for the projects
function getListAllBids(){
    var getProjectList="select u.profile_image, u.name, b.bid_price, b.period_in_days";
    getProjectList=" from freelancer_prototype_db.user u, freelancer_prototype_db.bid b ";
    getProjectList=" where b.user_id = u.user_id ";
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = results.length;
            while(i>0) {
                var project = {
                    projectName: results[i].projectName,
                    description: results[i].description,
                    files: results[i].files,
                    skills: results[i].skills,
                    budgetRange: results[i].skills,
                    averageBid: results[i].averageBid,
                    numberOfBids: results[i].numberOfBids
                }
                listOfProject.push(project);
                i--;
            }
        }
        console.log("List of Projects : ",listOfProject);
    },getProjectList);
    console.log("User inside function : ",user);
    return user;
}

// get List of all projects user has bid on
function getListOfProjectsUserHasBidOn(){
    var getProjectList = "select p.name, u.name, p.avg_bid, b.bid_price,p.status ";
    getProjectList = getProjectList + " from freelancer_prototype_db.bid b, freelancer_prototype_db.project p, freelancer_prototype_db.user u ";
    getProjectList = getProjectList + " where b.project_id = p.project_id and p.status = '"+"Open"+"'and u.user_id = b.user_id and b.user_id = "+user_id;
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = results.length;
            while(i>0) {
                var project = {
                    projectName: results[i].projectName,
                    description: results[i].description,
                    files: results[i].files,
                    skills: results[i].skills,
                    budgetRange: results[i].skills,
                    averageBid: results[i].averageBid,
                    numberOfBids: results[i].numberOfBids
                }
                listOfProject.push(project);
                i--;
            }
        }
        console.log("List of Projects : ",listOfProject);
    },getProjectList);
    console.log("User inside function : ",user);
    return user;
}

//get List of all projects posted by employer
function getListOfEpmloyerProjects(){
    var getProjectList = "select p.title, p.avg_bid, u.name, p.project_completion_date, p.status";
    getProjectList = getProjectList + " from freelancer_prototype_db.project p, freelancer_prototype_db.user u";
    getProjectList = getProjectList + " where u.user_id = p.employer_id and p.status = '"+"Open"+"' and u.user_id = "+user.user_id;
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = results.length;
            while(i>0) {
                var project = {
                    projectName: results[i].projectName,
                    description: results[i].description,
                    files: results[i].files,
                    skills: results[i].skills,
                    budgetRange: results[i].skills,
                    averageBid: results[i].averageBid,
                    numberOfBids: results[i].numberOfBids
                }
                listOfProject.push(project);
                i--;
            }
        }
        console.log("List of Projects : ",listOfProject);
    },getProjectList);
    console.log("User inside function : ",user);
    return user;
}

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;