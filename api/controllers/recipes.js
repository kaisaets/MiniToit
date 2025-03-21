const db = require('../utils/db')

const getAllRecipes = (req, res) =>{
    let sql = 'SELECT * FROM retseptid'
    db.query(sql, (error, result) => {
        res.json(result)
        //res.render('index', {
        //    retseptid: result
        //} )
    })
} 

module.exports = { getAllRecipes } 