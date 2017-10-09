var express = require('express')
var exphbs = require('express-handlebars')
var request = require('request')
var yelp = require('yelp-fusion')
var nutritionix = require('nutritionix')
require('dotenv').config()
var app = express()

const yelpId = process.env.yelpId
const yelpKey = process.env.yelpKey
const edamamId = process.env.edamamId
const edamamKey = process.env.edamamKey
const nutritionixId = process.env.nutritionixId
const nutritionixKey = process.env.nutritionixKey

// APIS
// nutritionix - nutrient
// yelp - restaunts
// edamam - recipes
//
// Custom function
// meal planning "rotation"
// grocery list generation
// reasons to be vegan?

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.get('/', function (req, res) {
    res.render('home', { msg: 'Hello World' })
})

request('https://api.edamam.com/search?q=chicken&app_id=' + edamamId + '&app_key=' + edamamKey, function (error, response, body) {
    console.log('error:', error)
    console.log('statusCode:', response && response.statusCode)
    console.log('body:', body)
})

app.listen(3000, function () {
    console.log('Easy Vegan listening on port 3000')
})
