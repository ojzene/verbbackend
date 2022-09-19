const mongoose = require('mongoose')
const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors());
const bodyParser = require('body-parser')
const config = require('./config/index')

mongoose.connect(config.dbConnection, { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true })

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsConfig = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    next()
}

app.use(corsConfig);

const apiUserRoutes = require('./routes/api');

require('./config/passportuser')

app.use('/api', apiUserRoutes);

app.get('/', (req, res) => {
    res.json({"apis":"Welcome to verb api"})
});

const server = app.listen(process.env.PORT || 5001, () => {
  const port = server.address().port;
  console.log(`App listening on port ${port}`);
});

