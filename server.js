const restify = require('restify')
const config = require('./config')
const r = require('rethinkdb')
const connection = require('./connect')

const server = restify.createServer()

//Middleware
server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.queryParser())

//Routes
const productRoutes = require('./routes/product')
const userRoutes = require('./routes/user')
const billRoutes = require('./routes/bill')

productRoutes(server)
userRoutes(server)
billRoutes(server)

server.listen(config.PORT, () => {
    console.info(`api is running on port ${config.PORT}`);
})
