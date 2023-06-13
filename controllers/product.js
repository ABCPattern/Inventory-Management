const Product = require('../models/product')
const r = require('rethinkdb')
const connection = require('../connect')
const config = require('../config')
const tablename = "product"

exports.addproduct = async (req, res) => {
    const conn = await connection
    const details = {
        "name": req.body.name,
        "description": req.body.description,
        "stock": req.body.stock,
        "price": req.body.price,
    }

    const newprod = new Product(details)
    try {
        const result = await r.db(config.dbname).table(tablename).insert(
            newprod
        )
            .run(conn)
        if (result) {
            res.status(201)
            res.json({
                success: true,
                message: "Product inserted successfully"
            })
            return
        }
        else {
            res.status(500)
            res.json({
                success: false,
                message: `Error occured while inserting data ${err}`
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

exports.getproduct = async (req, res) => {
    const conn = await connection
    const data = await r.db(config.dbname).table(tablename).coerceTo('array').run(conn)
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

exports.delproduct = async (req, res) => {
    const conn = await connection
    const id = req.params.id
    const prod = await r.db(config.dbname).table(tablename).get(id).run(conn)
    if (!prod) {
        res.status(403)
        res.json({
            success: false,
            message: "Product not found"
        })
        return
    }
    else {
        const result = await r.db(config.dbname).table(tablename).get(id).delete().run(conn)

        if (result) {
            res.status(200)
            res.json({
                success: true,
                message: `Product deleted successfully ${result}`
            })
            return
        }
        else {
            res.status(500)
            res.json({
                success: false,
                message: "Error occured while deleting data"
            })
            return
        }
    }

}

exports.updateproduct = async (req, res) => {
    const conn = await connection
    const id = req.params.id
    const prod = await r.db('inventory').table(tablename).get(id).run(conn)
    if (!prod) {
        res.status(403)
        res.json({
            success: false,
            message: "Product not found"
        })
        return
    }
    else {
        const result = await r.table(tablename).get(id).update(req.body).run(conn)
        if (result) {
            res.status(200)
            res.json({
                success: true,
                message: "Product updated successfully"
            })
            return
        }
        else {
            res.status(500)
            res.json({
                success: false,
                message: "Error occured while updating the product"
            })
            return
            
        }
    }

}