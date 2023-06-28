const Product = require('../models/product')
const r = require('rethinkdb')
const connection = require('../connect')
const config = require('../config')
const tablename = "product"
const logger = require('../logger')
const Activity = require('../models/activity')
const { Console } = require('winston/lib/winston/transports')


exports.addproduct = async (req, res) => {
    const conn = await connection
    const username = req.decodetoken.username
    const userinfo = await r.db(config.dbname).table('user').getAll(username, {index:'byusername'}).coerceTo('array').run(conn)
    if(userinfo[0].role != 'Admin'){
        res.status(401)
        res.json({
            success:false,
            message:`only admin can add`
        })
        return
    }
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
            const loginfo = {
                "Product_Name": req.body.name,
                "Username": username,
                "old_value": null,
                "new_value": newprod,
                "action": "Product Created"
            }

            logger.info(JSON.stringify(loginfo))
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
    const message = await r.db(config.dbname).table('hello').get("c84d1d1f-1f39-4095-92b4-611e988da268").pluck("message").run(conn)
    console.log(message.message.Product_Name)
    // const action = JSON.parse(message)


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
    const username = req.decodetoken.username
    const userinfo = await r.db(config.dbname).table('user').getAll(username, {index:'byusername'}).coerceTo('array').run(conn)
    if(userinfo[0].role != 'Admin'){
        res.status(401)
        res.json({
            success:false,
            message:`only admin can delete`
        })
        return
    }
    const prod = await r.db(config.dbname).table(tablename).get(id).run(conn)
    if (!prod) {
        res.status(404)
        res.json({
            success: false,
            message: "Product does not exist"
        })
        return
    }
    else {
        const result = await r.db(config.dbname).table(tablename).get(id).delete().run(conn)

        if (result) {
            const loginfo = {
                "Product_Name": prod.name,
                "Username": username,
                "old_value": prod,
                "new_value": null,
                "action": "Product Deleted"
            }

            logger.info(JSON.stringify(loginfo))
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
    const username = req.decodetoken.username
    const userinfo = await r.db(config.dbname).table('user').getAll(username, {index:'byusername'}).coerceTo('array').run(conn)
    if(userinfo[0].role != 'Admin'){
        res.status(401)
        res.json({
            success:false,
            message:`only admin can update`
        })
        return
    }
    const prod = await r.db('inventory').table(tablename).get(id).run(conn)
    if (!prod) {
        res.status(404)
        res.json({
            success: false,
            message: "Product does not exist"
        })
        return
    }
    else {
        const result = await r.table(tablename).get(id).update(req.body).run(conn)
        if (result) {
            const newprod = await r.table(tablename).get(id).run(conn)
            const loginfo = {
                "Product_Name": prod.name,
                "Username": username,
                "old_value": prod,
                "new_value": newprod,
                "action": "Product Updated"
            }

            logger.info(JSON.stringify(loginfo))
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


