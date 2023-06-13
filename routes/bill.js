const controller = require('../controllers/bill')

module.exports = server =>{
    server.post('/generate-bill/:id', [controller.generatebill])

    server.get('/getbillhistory/:id', [controller.getbill])
}
