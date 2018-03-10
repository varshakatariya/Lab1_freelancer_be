var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
/*

router.post('/signup', function(req, res) {
    var name= req.param("name");
    var email = req.param("email");
    var userId=0;
    var getUser="select * from user where email='"+req.param("email")+"' and password='" + req.param("password") +"'";
    console.log("Query is:"+getUser);
    var errors;
    var data={};
    data = {name:name,email:email};
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
                var getUserId="select max(userId) as maxCnt from user";
                console.log("max Query is:"+getUserId);
                mysql.fetchData(function (error,results) {
                    if(error){
                        errors="Unable to process request"
                        res.status(400).json(errors);
                    }
                    else{
                        if(results.length > 0){
                            userId = results[0].maxCnt+1;

                            var setUser="insert into user (userId,name,email,password) values ("+userId+",'"+req.param("name")+"','" + req.param("email") +"','" + req.param("password")+"')";
                            console.log("insert Query is:"+setUser);
                            mysql.fetchData(function (error,results) {
                                if(error){
                                    errors="You have already registered, kindly login."
                                    res.status(400).json({errors});
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
    var getUser="select * from user where email='"+req.param("email")+"' and password='" + req.param("password") +"'";
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
                data = {
                    name:results[0].name,
                    email:results[0].email
                };
                console.log("valid Login");
                res.send(data);
            }
            else {
                errors="Incorrect Username and Password, Please correct";
                console.log("Login unsuccessful");
                res.status(400).json(errors);
            }
        }
    },getUser);
});
*/

module.exports = router;
