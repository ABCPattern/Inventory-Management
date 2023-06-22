const User = require('../models/user')
const Product = require('../models/product')
const Bill = require('../models/bill')
const r = require('rethinkdb')
const connection = require('../connect')
const config = require('../config')
const tablename = "bill"

exports.generatebill = async (req, res) => {
    const conn = await connection
    const id = req.params.id
    const user = await r.db(config.dbname).table('user').get(id).run(conn)
    if (!user) {
        res.status(404)
        res.json({
            success: false,
            message: "User not found"
        })
        return
    }
    else {

        let sum = 0
        console.log(user.cart[0].Price)
        for (let i = 0; i < user.cart.length; i++) {
            sum += user.cart[i].Price
        }
        const details = {
            "userid": id,
            "products": user.cart,
            "TotalPrice": sum
        }
        const newbill = new Bill(details)
        try {
            const result = await r.db(config.dbname).table(tablename).insert(
                newbill
            )
                .run(conn)
            if (result) {
                const updatecart = await r.db(config.dbname)
                    .table('user')
                    .get(id)
                    .update({
                        cart: [],
                        cart_state: "empty"
                    })
                    .run(conn)
                if (updatecart) {
                    res.status(201)
                    res.json({
                        success: true,
                        message: "Bill generated successfully"
                    })
                    return
                }
                else {
                    res.status(500)
                    res.json({
                        success: false,
                        message: "Error occured while generating bill"
                    })
                    return
                }

            }
            else {
                res.status(500)
                res.json({
                    success: false,
                    message: `Error occured while inserting data`
                })
                return
            }
        }
        catch (err) {
            res.status(500)
            res.json({
                success: false,
                message: `Error occured while inserting data ${err}`
            })
            return
        }
    }

}

exports.getbill = async (req, res) => {
    const conn = await connection
    const id = req.params.id
    const userinfo = await r.db(config.dbname).table('user').get(id).run(conn)
    if (!userinfo) {
        res.status(404)
        res.json({
            success: false,
            message: "User not found"
        })
        return
    }
    else {
        const data = await r.db(config.dbname).table(tablename).getAll(req.params.id, { index: 'finduserid' }).coerceTo('array').run(conn)
        if (data) {
            res.status(200)
            res.json({
                success: true,
                "data": data
            })
            return
        }
        else {
            res.status(404)
            res.json({
                success: false,
                message: "User has not purchased yet!"
            })
            return
        }
    }

}