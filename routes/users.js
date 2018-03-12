var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

//get particular user details
app.get('/user', function(req, res){
    var userEmail= req.param("email");
    console.log("Request param email "+userEmail);
    user.emailId = userEmail;
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
        res.send(user);
    },getUser);
}

module.exports = router;
