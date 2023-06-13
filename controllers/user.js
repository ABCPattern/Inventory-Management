const User = require('../models/user')
const Product = require('../models/product')
const getcart = require('../models/cart')
const r = require('rethinkdb')
const connection = require('../connect')
const config = require('../config')
const tablename = "user"


exports.adduser = async (req, res) => {
    const conn = await connection
    const details = {
        "name": req.body.name,
        "username": req.body.username,
        "password": req.body.password
    }

    const newuser = new User(details)
    try {
        const result = await r.db(config.dbname).table(tablename).insert(
            newuser
        )
            .run(conn)
        if (result) {
            res.status(201)
            res.json({
                success: true,
                message: "User created successfully"
            })
            return
        }
        else {
            res.status(500)
            res.json({
                success: false,
                message: `Error occured while inserting user ${err}`
            })
            return
        }
    }
    catch (err) {
        res.status(500)
        res.json({
            success: false,
            message: `Error occured while inserting user ${err}`
        })
        return
    }
}

exports.getuser = async (req, res) => {
    const conn = await connection
    const data = await r.db(config.dbname).table(tablename).map(function(doc){
        return doc.without('password')
    }).coerceTo('array').run(conn)
    if (data) {
        res.status(200)
        res.json({
            success: true,
            "data": data
        })
        return
    }
    else {
        res.status(500)
        res.json({
            success: false,
            message: "Error occured while retreiving the data"
        })
        return
    }
}

exports.getinfo = async (req, res) => {
    const conn = await connection
    const id = req.params.id
    const userinfo = await r.db(config.dbname).table(tablename).get(id).run(conn)
    if (userinfo) {
        res.status(200)
        res.json({
            success: true,
            "data": userinfo
        })
        return
    }
    else {
        res.status(500)
        res.json({
            success: false,
            message: "Error occured while retreiving the data"
        })
        return
    }
}

exports.add_to_cart = async (req, res) => {
    const conn = await connection
    const id = req.params.id
    const productid = req.query.productid
    const quantity = req.query.quantity
    const user = await r.db(config.dbname).table(tablename).get(id).run(conn)
    if (!user) {
        res.status(403)
        res.json({
            success: false,
            message: "User not found"
        })
        return
    }
    const prod = await r.db(config.dbname).table('product').get(productid).run(conn)
    // console.log(prod.price)
    if (!prod) {
        res.status(403)
        res.json({
            success: false,
            message: "Product not found"
        })
        return
    }
    else {
        if (quantity > prod.stock) {
            res.status(403)
            res.json({
                success: false,
                message: "Not available in stock"
            })
            return
        }
        else {
            const price = prod.price
            const newstock = prod.stock - quantity
            const newcartitem = getcart(productid, quantity, price)
            const updateproduct = await r.db(config.dbname)
                .table('product')
                .get(productid)
                .update({
                    stock: newstock
                })
                .run(conn)
            if (updateproduct) {
                const updateuser = await r.db(config.dbname)
                    .table(tablename)
                    .get(id)
                    .update({
                        cart: r.row('cart').append(newcartitem),
                        cart_state: 'pending'
                    })
                    .run(conn)
                if (updateuser) {
                    res.status(200)
                    res.json({
                        success: true,
                        message: "Product added to cart successfully!"
                    })
                    return
                }
                else {
                    res.status(500)
                    res.json({
                        success: false,
                        message: "Error occured while adding product to cart"
                    })
                    return
                }
            }
            else {
                res.status(500)
                res.json({
                    success: false,
                    message: "Error occured while updating product stock"
                })
                return
            }

        }

    }
}

exports.getcartstate = async (req, res) => {
    const conn = await connection
    const data = await r.db(config.dbname).table(tablename).getAll(req.params.state, { index: 'findcartstate' }).map(function(doc){
        return doc.without('password')
    }).coerceTo('array').run(conn)
    if (data) {
        res.status(200)
        res.json({
            success: false,
            "data": data
        })
        return
    }
    else {
        res.status(500)
        res.josn({
            success: false,
            message: "Error occured while retrieving data"
        })
        return
    }
}