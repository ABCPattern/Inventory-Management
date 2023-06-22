const controller = require('../controllers/user')
const auth = require('../authentication')

module.exports = server => {
    server.post('/registration', [controller.adduser])

    server.get('/user', [controller.getuser])

    server.post('/login', [
        auth.isPasswordMatch,
        auth.login
    ])
    server.get('/user/:id', [controller.getinfo])

    server.post('/add-to-cart/user/:id', [controller.add_to_cart])

    server.get('/cart/state/:state', [controller.getcartstate])

    server.put('/remove-from-cart/user/:id', [controller.removefromcart])

    server.put('/update-quantity/:id', [controller.updateQuantity])
}