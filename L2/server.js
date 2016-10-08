var express = require('express'),
      path = require('path'),
      app = express();
      
app.engine('html', require('ejs').renderFile);

app.use(express.static(__dirname + '/app'));

app.get('/', function(req, res) {
  res.sendFile(path.resolve('app/index.html'));
});

app.listen(5000);
