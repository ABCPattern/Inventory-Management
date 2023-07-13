module.exports = {
    ENV: process.env.NODE_ENV || 'developement',
    PORT: process.env.PORT || 5000,
    URL: process.env.BASE_URL || 'http://localhost:5000',
    secret: "ABCDQWERTYUIOP",
    dbname: "inventory",
    secret_refresh: "qwertyuiopasdfghklzxcvbmn"
}