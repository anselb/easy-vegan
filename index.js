const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const request = require('request');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const yelp = require('yelp-fusion');
const NutritionixClient = require('nutritionix');
const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/easy-vegan', { useMongoClient: true });
app.use(bodyParser.urlencoded({ extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

require('dotenv').config();

app.use((req, res, next) => {
    if (typeof req.cookies.nToken === 'undefined' || req.cookies.nToken === null) {
        req.user = null;
    } else {
        const token = req.cookies.nToken;
        const decodedToken = jwt.decode(token, { complete: true }) || {};
        req.user = decodedToken.payload;
    }
    next();
});

require('./controllers/recipes')(app);
//require('./controllers/behaviors')(app);

var Recipe = require('./models/recipe');

const yelpId = process.env.yelpId;
const yelpKey = process.env.yelpKey;
const edamamId = process.env.edamamId;
const edamamKey = process.env.edamamKey;
const nutritionixId = process.env.nutritionixId;
const nutritionixKey = process.env.nutritionixKey;

var nutritionix = new NutritionixClient ({
    appId: nutritionixId,
    appKey: nutritionixKey
});

// APIS
// nutritionix - nutrient
// yelp - restaunts
// edamam - recipes
//
// Custom function
// meal planning "rotation"
// grocery list generation
// reasons to be vegan?

app.get('/', function (req, res) {
    Recipe.find(function (err, recipes) {
        res.render('recipes-index', { recipes: recipes });
    });
});

// request('https://api.edamam.com/search?q=chicken&app_id=' + edamamId + '&app_key=' + edamamKey, function (error, response, body) {
//     console.log('error:', error);
//     console.log('statusCode:', response && response.statusCode);
//     console.log('body:', body);
// });

function successHandler (searchResults) {
    var result = searchResults.results[0];
    var id = result.resource_id;

    var name = [
        id,
        result.brand_name,
        result.item_name
    ].join(' - ');

    console.log(('search successful retrieving' +
                  'record for item: %s').green, name);

    return nutritionix.item({
        id: id
    });
}
//
// nutritionix.search ({
//     q:'salad',
//     limit: 10,
//     offset: 0,
//     search_nutrient: 'calories'
// }).then(successHandler);

const searchRequest = {
    term: 'Four Barrel Coffee',
    location: 'san francisco, ca'
};

// yelp.accessToken(yelpId, yelpKey).then(response => {
//     const client = yelp.client(response.jsonBody.access_token);
//
//     client.search(searchRequest).then(response => {
//         const firstResult = response.jsonBody.businesses[0];
//         const prettyJson = JSON.stringify(firstResult, null, 4);
//         console.log(prettyJson);
//     });
// });

app.listen(3000, function () {
    console.log('Easy Vegan listening on port 3000');
});
