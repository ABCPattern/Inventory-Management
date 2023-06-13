const r = require('rethinkdb')
const connection = r.connect({host:'localhost',port:28015, db:'inventory'},function(err, conn){
    if(err){
        console.log(err)
    }
    else{
        console.log('Connected successfully to rethinkdb!')
    }   
}
)

module.exports = connection