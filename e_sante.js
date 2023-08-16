const config = require('config');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const app = express();
const cmsRouter = require('./routes/cmsRoutes');
const mongoose = require("mongoose");
const debug = require("debug")('dev');
const Fawn = require("fawn");
const Joi = require('joi');
Joi.objectId = require("joi-objectid")(Joi);
const winston = require("winston")
const wdb = require("winston-mongodb")
const cors = require('cors');

const mongoUrl = `${config.get('mongodb_host')}/${config.get('dbName')}`

const logger = winston.createLogger({
    transports: [
        new winston.transports.File({ filename: 'errors.log' }),
        new winston.transports.MongoDB({ db: mongoUrl, level: 'error' })
    ]
})

process.on('uncaughtException', (exception) => {
    logger.error(exception);
    // process.exit(1)
})
process.on('unhandledRejection', (exception) => {
    logger.error(exception)
    // process.exit(1)
})

mongoose.connect(mongoUrl)
    .then(onfulfilled => { debug("Connected to mongodb.") })
    .catch(onrejected => debug(onrejected))

Fawn.init(mongoUrl)

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions))
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
console.log(`Application name: ${config.get('appName')}`)
console.log(`Application secret: ${config.get('secret')}`)
console.log(`Listening on port: ${config.get('port')}`)
console.log(`Environment: ${process.env.NODE_ENV}`)

app.use('/api/v1', express.static('public'));
app.use('/api/v1/cms', cmsRouter);

app.listen(config.get('port'), '0.0.0.0', () => {
    debug('Listening on port ' + config.get('port'));
});
