const Recipe = require('../models/recipe');
const Comment = require('../models/comment');

module.exports = function (app) {
    app.post('/recipe/:recipeId/comments', function (req, res) {
        const currentUser = req.user;
        if (currentUser === null) {
            return res.redirect('/login');
        }

        const recipeId = req.params.recipeId;
        const author = currentUser._id;
        const content = req.body.content;
        const comment = new Comment({
            content: content,
            author: author,
            recipeId: recipeId
        });

        Recipe.findById(recipeId).then((recipe) => {
            recipe.comments.unshift(comment);
            recipe.save();
            return res.redirect('/recipes/' + recipeId)
        }).catch((err) => {
            console.log(err);
        });
    });
}
