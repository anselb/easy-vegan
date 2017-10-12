const Recipe = require('../models/recipe')

module.exports = function (app) {
    //GET new recipe form
    app.get('/recipes/new', function (req, res) {
        res.render('recipes-new', {})
    })

    //GET individual recipe
    app.get('/recipes/:id', function (req, res) {
        Recipe.findById(req.params.id).then((recipe) => {
            res.render('recipes-show', { recipe: recipe })
        })
    })

    //GET recipe edit form
    app.get('/recipes/:id/edit', function (req, res) {
        Recipe.findById(req.params.id).then((recipe) => {
            res.render('recipes-edit', { recipe: recipe })
        })
    })

    //POST new recipe
    app.post('/recipes', function (req, res) {
        Recipe.create(req.body, function (err, recipe) {
            console.log(recipe)
            res.redirect('/')
        })
    })

    //PUT(edit) recipe
    app.put('/recipes/:id', function (req, res) {
        Recipe.findByIdAndUpdate(req.params.id, req.body).then((recipe) => {
            console.log(recipe)
            res.redirect('/recipes/' + recipe._id)
        })
    })

    //DELETE recipe
    app.delete('/recipes/:id', function (req, res) {
        Recipe.findByIdAndRemove(req.params.id, function (err) {
            res.redirect('/')
        })
    })
}
