const controller = require('../controllers/bill')
const auth = require('../authentication')

module.exports = server =>{
    server.post('/generate-bill/:id', [
        auth.validJWTNeeded,
        controller.generatebill])

    server.get('/bill/history/:id', [
        auth.validJWTNeeded,
        controller.getbill])
}
