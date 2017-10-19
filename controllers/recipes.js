const Recipe = require('../models/recipe');

module.exports = function (app) {
    //GET new recipe form
    app.get('/recipes/new', function (req, res) {
        var currentUser = req.user
        res.render('recipes-new', { currentUser: currentUser });
    });

    //GET individual recipe
    app.get('/recipes/:id', function (req, res) {
        Recipe.findById(req.params.id).populate('comments.author').then((recipe) => {
            var currentUser = req.user
            res.render('recipes-show', { recipe: recipe, currentUser: currentUser });
        });
    });

    //GET recipe edit form
    app.get('/recipes/:id/edit', function (req, res) {
        Recipe.findById(req.params.id).then((recipe) => {
            var currentUser = req.user
            res.render('recipes-edit', { recipe: recipe, currentUser: currentUser });
        });
    });

    //POST new recipe
    app.post('/recipes', function (req, res) {
        Recipe.create(req.body, function (err, recipe) {
            console.log(recipe);
            res.redirect('/');
        });
    });

    //PUT(edit) recipe
    app.put('/recipes/:id', function (req, res) {
        Recipe.findByIdAndUpdate(req.params.id, req.body).then((recipe) => {
            console.log(recipe);
            res.redirect('/recipes/' + recipe._id);
        });
    });

    //DELETE recipe
    app.delete('/recipes/:id', function (req, res) {
        Recipe.findByIdAndRemove(req.params.id, function (err) {
            res.redirect('/');
        });
    });
}
