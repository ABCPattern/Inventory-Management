const controller = require('../controllers/product')

module.exports = server =>{
    server.post('/product', [controller.addproduct])

    server.get('/product', [controller.getproduct])

    server.del('/product/:id', [controller.delproduct])

    server.put('/product/:id', [controller.updateproduct])
}