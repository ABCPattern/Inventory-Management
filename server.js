const restify = require('restify')
const config = require('./config')
const r = require('rethinkdb')
const connection = require('./connect')
const logger = require('./logger')

const server = restify.createServer()

//Middleware
server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.queryParser())

//Routes
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const billRoutes = require('./routes/bill')
const logsRoutes = require('./routes/activity_logs')
const mailsRoutes = require('./routes/mail')

productRoutes(server)
userRoutes(server)
billRoutes(server)
logsRoutes(server)
mailsRoutes(server)

server.listen(config.PORT, () => {
    console.log(JSON.stringify(`api is running on port ${config.PORT}`));
})
