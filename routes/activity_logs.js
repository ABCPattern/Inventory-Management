const controller = require('../controllers/activity_logs')
// const auth = require('../authentication')


module.exports = server => {
    server.get('/activity', controller.getlogs)
}