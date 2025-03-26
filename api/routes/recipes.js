import app from '../utils/app'

const express = require('express')
const router = express.Router()
const recipeController = require('../controllers/recipes')

router.get('/', recipeController.getAllRecipes)

module.exports = router