var thinky = require('thinky')({db:'inventory'})
var type = thinky.type
const r = require('rethinkdb')
const date = new Date(Date.now())
const config = require('../config')
const connection = require('../connect')
const tablename = "bill"

let bill = thinky.createModel("bill", {
    userid: type.string(),
    products: type.array(),
    TotalPrice: type.number(),
    generatedDate: type.date().default(date.toUTCString())
})

createIndex = async () =>{
    const conn = await connection
    const indexlist = await r.db(config.dbname).table(tablename).indexList().run(conn)
    if(!indexlist.includes('finduserid')){
        await r.db(config.dbname).table(tablename).indexCreate('finduserid', function(doc) {
            return doc('userid')
          }).run(conn)
        await r.db(config.dbname).table(tablename).indexWait('finduserid').run(conn)    
    }
    
}

createIndex()


module.exports = bill