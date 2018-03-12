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

var nBids = 0;
var user = {
    userId: 0,
    name: "",
    emailId: "",
    contact: 0,
    aboutMe: "",
    skills: "",
    profileImage: "",
    designation: ""
};

var bid = {
    bidId: 0,
    userId: 0,
    projectId: 0,
    bidPrice: 0,
    periodInDays: 0
};

var project = {
    projectId: 0,
    userId: 0,
    title: "",
    description: "",
    files: "",
    skills: "",
    budget: 0,
    avg_bid: 0,
    status: "",
    project_completion_date: ""
};


var list= [];


// details of particular single user
app.get('/user', function(req, res){
    var userEmail= req.param("email");
    console.log("Request param email "+userEmail);
    user.emailId = userEmail;
    getUserDetails(user);
    res.send(user);
});

//get particular user details
function getUserDetails(emailId){
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
        }
    },getUser);
    console.log("User inside function : ",user);
    return user;
}



app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

module.exports = app;