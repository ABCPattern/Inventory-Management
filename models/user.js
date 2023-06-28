var thinky = require('thinky')({db:'inventory'})
var type = thinky.type
const r = require('rethinkdb')
const config = require('../config')
const connection = require('../connect')
const tablename = "user"

function validateoptions(value, options){
    return options.includes(value)
}

let user = thinky.createModel("user", {
    name : type.string(),
    username: type.string(),
    password: type.string(),
    role: type.string(),
    cart: type.array().default([]),
    cart_state: type.string().default("empty").validator(validateoptions, ['empty', 'pending', 'ordered'])
})

createIndex = async () =>{
    const conn = await connection
    const indexlist = await r.db(config.dbname).table(tablename).indexList().run(conn)
    if(!indexlist.includes('findcartstate')){
        await r.db(config.dbname).table(tablename).indexCreate('findcartstate', function(doc) {
            return doc('cart_state')
          }).run(conn)
        await r.db(config.dbname).table(tablename).indexWait('findcartstate').run(conn)    
    }
    if(!indexlist.includes('byusername')){
        await r.db(config.dbname).table(tablename).indexCreate('byusername', function(doc) {
            return doc('username')
          }).run(conn)
        await r.db(config.dbname).table(tablename).indexWait('byusername').run(conn) 
    }
    
}

createIndex()

module.exports = user
