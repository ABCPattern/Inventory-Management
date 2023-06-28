const controller = require('../controllers/product')
const auth = require('../authentication')


module.exports = server => {
    server.post('/product', [
        auth.validJWTNeeded,
        controller.addproduct])

    server.get('/product', [controller.getproduct])

    server.del('/product/:id', [
        auth.validJWTNeeded,
        controller.delproduct])

    server.put('/product/:id', [
        auth.validJWTNeeded,
        controller.updateproduct])

    
}