const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const PORT = process.env.PORT || 3001;

app.use('/', express.static(__dirname + '/public'));
app.use('/secret/eecs349_project', express.static(__dirname + '/secret/eecs349_project'));

// Routes
require('./routes/eecs349_project')(app);

const server = require('http').Server(app);
server.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
