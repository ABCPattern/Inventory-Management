const controller = require('../controllers/user')

module.exports = server => {
    server.post('/adduser', [controller.adduser])

    server.get('/getuser', [controller.getuser])

    server.get('/getinfo/:id', [controller.getinfo])

    server.post('/add-to-cart/:id', [controller.add_to_cart])

    server.get('/getcartstate/:state', [controller.getcartstate])
}