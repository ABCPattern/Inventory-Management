const winston = require('winston');
const r = require('rethinkdb');
const os = require('os');
const { format } = require('winston')
// const Activity = require('./models/activity')
require('winston-syslog');
const localhost = os.hostname()

// Create a custom Winston transport for RethinkDB
const rethinkDBTransport = new winston.Transport({
    name: 'rethinkdb',
    log: (info, callback) => {
        r.connect({ host: 'localhost', port: 28015 }, (err, conn) => {
            if (err) {
                console.error('Failed to connect to RethinkDB:', err);
                return callback(err);
            }
            // console.log(JSON.parse(info.message))
            let logEntry
            if (JSON.parse(info.message)) {
                logEntry = {
                    "timestamp": info.timestamp,
                    "level": info.level,
                    "message": JSON.parse(info.message),
                }
            }
            else{
                logEntry = {
                    "timestamp": info.timestamp,
                    "level": info.level,
                    "message": info.message,
                }
            }

            // const activitylog = new Activity(logEntry)
            r.db('inventory').table('hello')
                .insert(logEntry)
                .run(conn, (err, result) => {
                    if (err) {
                        console.error('Failed to insert log into RethinkDB:', err);
                        return callback(err);
                    }
                    callback(null, true);
                })
        });
    }
});


const options = {
    host: 'logs3.papertrailapp.com',
    port: 28271,
    app_name: "medium",
    localhost: localhost
}

const logger = winston.createLogger({
    format: format.combine(
        format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
        winston.format.json()
    ),
    transports: [
        // new winston.transports.Console(),
        rethinkDBTransport
    ]
});

logger.add(new winston.transports.Syslog(options))

module.exports = logger