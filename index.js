var express = require('express');
var cors = require('cors');
var app = express();
app.use(cors());
var PORT = process.env.PORT || 3000;
var apiController = require('./controllers/apiController');
apiController(app);
app.listen(PORT);