var express = require('express') ;
var bodyParser = require('body-parser') ;
var http = require('http') ;
var path = require('path') ;
var fs = require('fs') ;
var request = require('request') ;

var app = express() ;
var server = http.createServer(app) ;
app.use(bodyParser.urlencoded({ extended: true})) ;

var remain_data = 'n' ;
var login = false ;

app.use('/script', express.static(__dirname + "/node_modules")) ;
app.use(express.static(__dirname + '/love')) ;

app.post('/login', function(req, res) {
  if (req.body.day == '20151225') {
    login = true ;
    res.redirect('/html/letter') ;
  }
  else {
    res.redirect('http://warning.or.kr') ;
  }
}) ;

app.get('/style.css', function (req, res) {
  res.sendfile('love/style.css', {root : __dirname}) ;
}) ;

app.get('/photo/:link/:number', function (req, res) {
  var jpg_name = 'photo/' + req.params.link + '/' + req.params.number + '.jpg' ;
  //console.log(jpg_name) ;
  fs.exists(jpg_name, function (exists) {
    if (exists) {
      remain_data = 'y';
      if (login) {
        res.sendfile(jpg_name) ;
      }
    }
    else {
      remain_data = 'n' ;
    }
  }) ;
}) ;

app.post('/remain', function(req, res) {
  //console.log("get remain " + req.body) ;
  res.send(remain_data) ;
}) ;

app.get('/', function (req, res) {
  console.log('html') ;
  res.sendfile('html_source/front.html', {root : __dirname}) ;
}) ;

app.get('/css', function (req, res) {
  res.sendfile('html_source/style.css') ;
}) ;

app.get('/html/:tagId', function (req, res) {
  if (login) {
    res.sendfile('html_source/' + req.params.tagId + '.html', {root: __dirname});
  }
  else {
    res.redirect('/relogin') ;
  }
}) ;

server.listen(80, function() {
  console.log('start on port ' + server.address().port) ;  
}) ;

app.get('/relogin', function(req, res) {
  login = false ;
  res.send('<script type="text/javascript">alert("다시 로그인 해 주세요") ;window.location.href = "/"</script>') ;
}) ;

setInterval(function() {
  console.log("time out") ;
  login = false ;
}, 60 * 60 * 3 * 1000) ;