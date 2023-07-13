const jwt = require('jsonwebtoken')
const config = require('./config')
const lodash = require('lodash')
const User = require('./models/user')
const connection = require('./rethinkdbconnect')
const bcrypt = require('bcryptjs')
const r = require('rethinkdb')
const tablename = "user"
const logger = require('./logger')
const { re } = require('mathjs')

exports.isPasswordMatch = async (req, res) => {
    const conn = await connection
    const enteredpassword = req.body.password
    const username = req.body.username
    const user = await r.db(config.dbname).table(tablename).getAll(username, { index: 'byusername' }).coerceTo('array').run(conn)
    if (!user[0]) {
        res.status(401)
        res.json({
            message: "User does not exist"
        })
        return
    }
    else {
        const result = await bcrypt.compare(enteredpassword, user[0].password)
        if (result) {
            return
        }
        else {
            res.status(401)
            res.send("Incorrect password")
            return
        } 
    }
        
}



exports.login = async (req, res) => {
    try {

        const token = jwt.sign(req.body, config.secret, { expiresIn: '1h' })
        if (!token) {
            res.status(500)
            res.json({
                success: false,
                message: "Token is not generated"
            })
            return
        }
        const refresh_token = jwt.sign(req.body, config.secret_refresh, { expiresIn: '1y' })
        if (!refresh_token) {
            res.json(500)
            res.json({
                success: false,
                message: "Refresh token is not generated"
            })
            return
        }
        logger.info(JSON.stringify(`${req.body.username} logged in successfully!`))
        res.status(200)

        res.json({ success: true, accessToken: token, refreshToken: refresh_token })
        return
    } catch (error) {
        res.status(500)
        res.json({ errors: error })
        return
    }
}

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'].split(' ');

            if (authorization[0] !== 'Bearer') {
                console.log(authorization[0])
                return res.status(401).send();
            } else {
                console.log(authorization[1])
                req.decodetoken = jwt.verify(authorization[1], config.secret)
                console.log(req.decodetoken.username)
                next()
            }
        } catch (err) {
            if (!req.header('refreshtoken')) {
                res.status(400)
                res.json({
                    success: false,
                    message: "Your session has expired or token is not valid"
                })
                return
            }
            else if (req.header('refreshtoken')) {
                const decodedrefreshtoken = jwt.verify(req.header('refreshtoken'), config.secret_refresh)
                const details = {
                    "username": decodedrefreshtoken.username,
                    "password": decodedrefreshtoken.password
                }
                const newaccesstoken = jwt.sign(details, config.secret, { expiresIn: '1h' })
                const newrefreshtoken = jwt.sign(details, config.secret_refresh, { expiresIn: '7d' })
                res.json({
                    message: `Your session has expired`,
                    accessToken: newaccesstoken,
                    refreshToken: newrefreshtoken
                })
                return
            }
            res.status(403)
            res.send("Invalid token")
            return
        }
    } else {
        res.status(401)
        res.send("Invalid token")
        return
    }
} 
