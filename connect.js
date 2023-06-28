const r = require('rethinkdb')
const logger = require('./logger')
const connection = r.connect({host:'localhost',port:28015, db:'inventory'},function(err, conn){
    if(err){
        console.log(JSON.stringify(err))
    }
    else{
        console.log(JSON.stringify('Connected successfully to rethinkdb!'))
    }   
}
)

module.exports = connection