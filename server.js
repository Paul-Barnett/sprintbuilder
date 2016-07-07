/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var mysql = require('mysql');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

//Register the static pages
app.use('/', express.static(path.join(__dirname, 'app')));

//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

//Get all posts from the database
app.get('/api/posts', function(req, res) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'admin',
    password : 'St45js7tb0',
    database : 'address_book'
  });

  connection.connect();

  connection.query('SELECT * FROM posts', function(err, rows, fields) {
    if (!err){
      res.json( rows );
    }else{
      console.log('Error while performing Query.');
    }
  });

  connection.end();
});

//Updates the sort order of posts
app.post('/api/posts/order', function(req, res) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'admin',
    password : 'St45js7tb0',
    database : 'address_book'
  });

  connection.connect();

  var data = req.body;
  var sql = 'UPDATE posts SET posts.`order` = CASE id';

  console.log( data.length );

  for (var i = 0; i < data.length; i++) {

    sql += " WHEN "+data[i].id+" THEN "+data[i].order;    
  };

  sql += " END";

  console.log( sql ); 

  connection.query( sql, function(err, rows, fields) {
    if (!err){
      res.json( rows );
    }else{
      console.log('Error while updating order.');
    }
  });

  connection.end();
});

//Insert a new post into the database
app.post('/api/posts/add', function(req, res) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'admin',
    password : 'St45js7tb0',
    database : 'address_book'
  });

  connection.connect();

  var title = req.body.title;
  var content = req.body.content;
  var order = Number(req.body.order);
  var author = req.body.author;

  var sql = "INSERT INTO posts (posts.title, posts.content, posts.`order`, posts.author)" +
  " VALUES ('"+title+"', '"+content+"', "+order+", '"+author+"')";

  connection.query( sql, function(err, rows, fields) {

    if (!err){
      res.json( rows );
    }else{
      console.log('Error while inserting data.');
      console.log(err);
    }

  });

  connection.end();
});

//Update an existing post
app.post('/api/posts/update', function(req, res) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'admin',
    password : 'St45js7tb0',
    database : 'address_book'
  });

  connection.connect();

  var id = Number(req.body.id);
  var title = req.body.title;
  var content = req.body.content;
  var order = Number(req.body.order);
  var author = req.body.author;

  var sql = "UPDATE posts SET title = '"+title+"', content = '"+content+"' WHERE id = "+id; 

  connection.query( sql, function(err, rows, fields) {

    if (!err){
      res.json( rows );
    }else{
      console.log('Error while updating data.');
      console.log(err);
    }

  });

  connection.end();

});

//Delete an existing post
app.post('/api/posts/delete', function(req, res) {

  var connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : 3306,
    user     : 'admin',
    password : 'St45js7tb0',
    database : 'address_book'
  });

  connection.connect();

  var id = Number(req.body.id);
  var sql = "DELETE FROM posts WHERE id = "+id;

  connection.query( sql, function(err, rows, fields) {

    if (!err){
      res.json( rows );
    }else{
      console.log('Error while deleting data.');
      console.log(err);
    }

  });

  connection.end();

});

app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});