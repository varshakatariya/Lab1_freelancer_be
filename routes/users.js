var express = require('express');
var router = express.Router();
var mysql = require('./mysql');
var bcrypt = require('bcrypt');

var salt = bcrypt.genSaltSync(10);

/*
var fs = require('fs-extra');
var url = require('url');*//*

var http = require('http');
var exec = require('child_process').exec;*//*
var multer = require('multer');*/
/*
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())

    }
});

var upload = multer({ storage: storage });

*/

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

router.post('/signup', function(req, res) {
    var name= req.param("name");
    var email = req.param("email");
    console.log("email : ",email);
    var userId=0;
    var getUser="select * from user where email_id='"+req.param("email")+"' and password='" + req.param("password") +"'";
    console.log("Query is:"+getUser);
    var errors;
    var data={};
    var epassword = null;
    data = {name:name,email:email};

    bcrypt.hash(req.param("password"), salt, function(err, password) {

        if (err) {
            console.log("Error : ", err);
        } else {
            epassword = password;
            console.log("Encryptedc:      ===============", password);
        }
    })
    console.log("Encryptedc:      ===============", epassword);
    mysql.fetchData(function(err,results){
        if(err){
            errors="Unable to process request";
            res.status(400).json(errors);
        }
        else
        {
            if(results.length > 0){
                console.log("valid Login");
            }
            else {
                var getUserId="select max(user_id) as maxCnt from user";
                console.log("max Query is:"+getUserId);
                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to process request"
                        res.status(400).json(errors);
                    }
                    else{
                        if(results.length > 0){
                            userId = results[0].maxCnt+1;

                            var setUser="insert into user (user_id,name,email_id,password) values ("+userId+",'"+req.param("name")+"','" + req.param("email") +"','" + epassword+"')";
                            console.log("insert Query is:"+setUser);
                            mysql.fetchData(function (error,results) {
                                if(error){
                                    errors="User already registered"
                                    res.status(400).json({error});
                                }
                                else{
                                    if(results.affectedRows > 0){
                                        console.log("inserted"+JSON.stringify(results));

                                        //data = {name:results[0].name,email:results[0].email};
                                        res.send(data);
                                    }
                                }
                            },setUser)
                        }
                    }
                },getUserId);
            }
        }
    },getUser);
});

router.post('/login', function(req, res){
    var getUser="select * from user where email_id='"+req.param("email")+"'";
    console.log("Query is:"+getUser);
    var data={};

    mysql.fetchData(function(err,results){
        if(err){
            throw err;
        }
        else
        {
            console.log(JSON.stringify(results));
            if(results.length > 0){
                console.log("db password : "+results[0].password);
                bcrypt.compare(req.param("password"), results[0].password, function(err, doesMatch){
                    console.log("doesmatch : ",doesMatch);
                    if(doesMatch){

                        console.log("inside login");
                        data = {
                            name:results[0].name,
                            email:results[0].email_id
                        };
                        req.session.name = results[0].name;
                        req.session.email = results[0].email_id;
                        req.session.userID = results[0].user_id;
                        console.log("valid Login");
                        res.send(data);
                    }
                    else {
                        errors="Invalid login Credentials";
                        console.log("Login unsuccessful");
                        res.status(400).json(errors);
                    }
                });
            }
            else {
                errors="Invalid login Credentials";
                console.log("Login unsuccessful");
                res.status(400).json(errors);
            }
        }
    },getUser);
});


router.get('/getUserData', function(req, res){
    console.log(req.session.name);
    var errors = "";
    if(req.session.email !== undefined && req.session.email !== '') {
        var getUser = "select * from user where email_id='" + req.session.email + "'";// and password='" + req.param("password") +"'";
        //console.log("Query is:" + getUser);
        var data = {};

        mysql.fetchData(function (err, results) {
            if (err) {
                throw err;
            }
            else {
                if (results.length > 0) {
                    data = {
                        name: results[0].name,
                        email: results[0].email_id,
                        skills: results[0].skills,
                        about: results[0].about_me,
                        phone: results[0].contact,
                        profileImage: results[0].profile_image/*.toString('base64')*/,
                        userFiles: results[0].files/*.toString('base64')*/
                    };
                    res.send(data);
                }
                else {
                    errors = "Please Login";
                    res.status(400).json(errors);
                }
            }
        }, getUser);
    }
    else{
        errors = "Please Login";
        res.status(400).json(errors);
    }
});

router.post('/updateUserData', function(req, res) {
    console.log("Profile Image: ", req.param("profileImage"));
    console.log("docs ",req.param("docs"));

    var updateUser="update user set name='"+req.param("name")+"', contact='" + req.param("phone") +"', about_me='"+ req.param("about")+"', skills='"+req.param("skills")+"', profile_image='"+req.param("profileImage")+"', files='"+req.param("docs")+"' where email_id='"+req.param("email")+"'";
    console.log(updateUser);
    var data={};

    mysql.fetchData(function(err,results){        if(err){

            throw err;
        }
        else
        {
            console.log(JSON.stringify(results));
            if(results.affectedRows > 0){
                var getUser="select * from user where email_id='" + req.param("email") + "'";
                console.log("Query is:"+getUser);

                mysql.fetchData(function(err,results){
                    if(err){
                        throw err;
                    }
                    else
                    {
                        console.log(JSON.stringify(results));
                        if (results.length > 0) {
                            data = {
                                name: results[0].name,
                                phone: results[0].contact,
                                skills: results[0].skills,
                                about: results[0].about_me,
                                email:results[0].email_id,
                                profileImage: results[0].profile_image/*.toString('base64')*/,
                                userFiles: results[0].files/*.toString('base64')*/
                            };
                            res.send(data);
                        }
                        else {
                            errors="Cant update this data";
                            console.log("Login unsuccessful");
                            res.status(400).json(errors);
                        }
                    }
                },getUser);
            }
            else {
                errors="Cant update this data";
                console.log("Login unsuccessful");
                res.status(400).json(errors);
            }
        }
    },updateUser);
});


router.get('/logout', function(req, res){
    console.log("email:------  "+ req.session.email);
    req.session.destroy();
    var logoutStat = {};
    logoutStat.logout = true;
    res.send(logoutStat);
});

router.get('/checkSession', function(req, res){
    console.log("Session Email: --"+req.session.email);
    var sessionStat = {};
    if(req.session.email !== undefined && req.session.email !== '') {
        sessionStat.sessionActive = true;
    }else{
        sessionStat.sessionActive = false;
    }
    res.send(sessionStat);
});


module.exports = router;
