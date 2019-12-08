var sqlite3 = require('sqlite3').verbose();
function connect (){
    var db = new sqlite3.Database('muestras.db',function (err){
	if (err) {
	    console.error(err.message);
	}
	console.log('Connected to the database.');
    });
    return db;
}
function close(db){
    db.close(function (err){
	if (err) {
	    console.error(err.message);
	}
	console.log('Close the database connection.');
    });
}
module.exports  = {
    create: function(){
	var db = connect();
	db.serialize(function() {
	    db.run('CREATE TABLE if not exists samples (device NUMERIC,info TEXT,sync NUMERIC)');
	    close(db);
	});

    },
    insert: function(json,callbackI){
	var db = connect();
	db.serialize(function() {
	    db.run('INSERT INTO samples VALUES ($device,json($info),0)',{
		$device: json.device,
		$info: JSON.stringify(json.info)
	    }, function(){
		close(db);
		callbackI();
	    });
	   
	});
    },
    select: function(where,value,callbackF){
	var sql = "select rowid,* from samples ";
	if(where!==false){
	    sql +=where;
	}
	var db = connect();
	db.parallelize(function() {
	    if(where!==false){
		db.all(sql,[value],function(err,allRows){
		    if(err != null){
			console.log(err);
		    }else{
			callbackF(allRows);
		    }
		});
	    }else{
		db.all(sql,function(err,allRows){
		    if(err != null){
			console.log(err);
		    }else{
			callbackF(allRows);
		    }
		});
	    }
	    
	    close(db);
	});
    },
    syncRow: function(rowid){
	var db = connect();
	db.parallelize(function() {
	    db.run("UPDATE samples set sync=1 where rowid=$id and sync=0",
		   {
		       $id:rowid
		   },function(){
		       close(db);
		   });
	});

    }
};
/*
  db.serialize(function() {
  
  let stmt = db.prepare('INSERT INTO lorem VALUES(json(?))');
  for (let i=0; i<10; i++) {
  stmt.run(JSON.stringify({ a: i, valor: 'ejemplo' }));
  }
  stmt.finalize();

  db.each('SELECT rowid AS id, info AS info FROM lorem', function(err, row) {
  console.log(row.id + ": " + row.info);
  });
  });
*/
