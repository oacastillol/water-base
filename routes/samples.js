var express = require('express');
var router = express.Router();
var db = require('../models/sqlite');
var request = require('request');

function answerUpload(error,response,body){
    if (!error && response.statusCode == 201) {
	if(Number.isInteger(body)){
	    db.syncRow(body);
	}else{
	    console.log("Respuesta inesperada");
	}
    }
    if (error || !response) {
	console.log("warning");
	console.log(error);
    }

}

function uploadCloud(data){
    data.forEach(
	function(element){
	    element.base = 1;
	    var options ={
		uri:"http://127.0.0.1:2000/samples",
		method: 'POST',
		json:element
	    };
	    request(options,answerUpload);
	}
    );
    
}

function prepareUpload(){
    db.select('where sync=? order by rowid',0,uploadCloud);
}



/* GET insert data samples */
router.get('/', function(req, res, next) {
    var device =req.query.node; 
    var body= req.query;
    // body.create_date = new Date().toLocaleString("en-GB", {timeZone: "America/Bogota"});
    body.create_date = new Date().toISOString();
    db.insert({device:device,info:body},prepareUpload);
    console.log(body);
    console.log('device:'+device);
    res.sendStatus(201);
});

module.exports = router;
