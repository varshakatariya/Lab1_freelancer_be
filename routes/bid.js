var express = require('express');
var router = express.Router();
var mysql = require('./mysql');

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});


//get List of all bids for project
router.get('/listOfAllBidsForProject', function(req, res){
    var list= [];
    var data = {
        bList: []
    };
    var project_id= req.param("project_id");
    console.log("Request param Project ID ---------------------- "+project_id);

    var getProjectList="select u.user_id, b.project_id, u.profile_image, u.name, b.bid_price, b.period_in_days";
    getProjectList= getProjectList + " from freelancer_prototype_db.user u, freelancer_prototype_db.bid b ";
    getProjectList= getProjectList + " where b.user_id = u.user_id and b.project_id = "+project_id;

    console.log(getProjectList);
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    user_id : results[i].user_id,
                    project_id : results[i].project_id,
                    profile_image: results[i].profile_image,
                    name: results[i].name,
                    bid_price: results[i].bid_price,
                    period_in_days: results[i].period_in_days
                }
                list.push(project);
                i++;
            }
            data.bList = list;
            console.log("inside listOfAllBidsForProject inside bid",list);
            console.log("inside listOfAllBidsForProject inside bid",list.length)
            res.send(data);
        }
    },getProjectList);
});



//get List of all open projects except user posted project
router.get('/listOfAllProjectUserHasBidOn', function(req, res){
    var list= [];
    var data = {
        bList: []
    };
    var user_id= req.param("user_id");
    console.log("Request param user ID "+user_id);

    var getProjectList = "select p.project_id, u.user_id, p.title, u.name, p.avg_bid, b.bid_price,p.status ";
    getProjectList = getProjectList + " from freelancer_prototype_db.bid b, freelancer_prototype_db.project p, freelancer_prototype_db.user u ";
    getProjectList = getProjectList + " where b.project_id = p.project_id and p.status = '"+"Open"+"' and u.user_id = b.user_id and b.user_id = "+user_id;
    mysql.fetchData(function(err,results){
        if(results.length > 0) {
            var i = 0;
            while(i<results.length) {
                var project = {
                    project_id : results[i].project_id,
                    user_id : results[i].user_id,
                    ProjectName: results[i].name,
                    EmpName: results[i].name,
                    avg_bid: results[i].avg_bid,
                    bid_price: results[i].bid_price,
                    status: results[i].status
                }
                list.push(project);
                i++;
            }
            data.bList = list;
            console.log("inside listOfAllProjectUserHasBidOn inside bid",list);
            console.log("inside listOfAllProjectUserHasBidOn inside bid",list.length)
            res.send(data);
        }
    },getProjectList);
});

module.exports = router;
