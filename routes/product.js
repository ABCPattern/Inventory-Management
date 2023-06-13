const controller = require('../controllers/product')

module.exports = server =>{
    server.post('/addproduct', [controller.addproduct])

    server.get('/getproduct', [controller.getproduct])

    server.del('/delproduct/:id', [controller.delproduct])

    server.put('/updateproduct/:id', [controller.updateproduct])
}