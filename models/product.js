var thinky = require('thinky')({db:'inventory'})
var type = thinky.type
const r = require('rethinkdb')
const date = new Date(Date.now())

let product = thinky.createModel("product", {
    name : type.string(),
    description: type.string().default(""),
    stock : type.number(),
    price: type.number(),
    dateCreated:type.date().default(date.toUTCString())
})

module.exports = product

