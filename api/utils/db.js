const mysql = require ('mysql2')

const connection = mysql.createConnection({
    host: '192.168.35.105',
    user: 'dbuser',
    password: 'qwerty',
    database: 'minitoit'
})

connection.connect((err) => {
    if(err) throw err
    console.log('MySQL server connected')
})

module.exports = connection
