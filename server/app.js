var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var connectionSting = 'postgres://localhost:5432/rho-weekend-4';
var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('Listening on port ', port);
});

app.get('/', function(req,res){
console.log('The index has been requested');
res.sendFile(path.resolve('public/index.html'));
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/allTasks', function(req, res){
  console.log('In all tasks! Hooray!');
  pg.connect(connectionSting, function(err, client, done){
    if(err){
      console.log('Error connecting to the database');
      res.sendStatus(500);
    }else{
      client.query('SELECT * FROM tasks ORDER BY is_complete;', function(err, results){
        done();
        if(err){
          console.log('Error SELECTING allTasks: ', err);
          res.sendStatus(500);
        } else {
          console.log(results.rows);
          res.send(results.rows);
        }
      });
    }
  });
});

app.post('/addTask', function(req, res){
  console.log('Adding a new task');
  var name = req.body.name;
  pg.connect(connectionSting, function(err, client, done){
    if(err){
      console.log('Error connecting to the database');
      res.sendStatus(500);
    }else{
      client.query('INSERT INTO tasks(name) VALUES ($1) RETURNING *;', [name], function(err, results){
        done();
        if(err){
          console.log('Error INSERTING addTask: ', err);
          res.sendStatus(500);
        } else {
          console.log(results.rows);
          res.send(results.rows);
        }
      });
    }
  });
});

app.put('/completeTask', function(req, res){
  console.log('Completing a task');
  var id = req.body.id;
  pg.connect(connectionSting, function(err, client, done){
    if(err){
      console.log('Error connecting to the database');
      res.sendStatus(500);
    }else{
      client.query('UPDATE tasks SET is_complete=$2 WHERE id=$1 RETURNING *;', [id, true], function(err, results){
        done();
        if(err){
          console.log('Error Completing completeTask: ', err);
          res.sendStatus(500);
        } else {
          console.log(results.rows);
          res.send(results.rows);
        }
      });
    }
  });
});

app.delete('/deleteTask', function(req, res){
  console.log('Deleting a task');
  var id = req.body.id;
  pg.connect(connectionSting, function(err, client, done){
    if(err){
      console.log('Error connecting to the database');
      res.sendStatus(500);
    }else{
      client.query('DELETE FROM tasks WHERE id=$1;', [id], function(err){
        done();
        if(err){
          console.log('Error Deleting deleteTask: ', err);
          res.sendStatus(500);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});




app.use(express.static('public'));
