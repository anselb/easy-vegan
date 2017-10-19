const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

var RecipeSchema = new Schema({
    name            : { type: String, required: true },
    description     : { type: String, required: true },
    ingredients     : { type: String, required: true },
    instructions    : { type: String, required: true },
    comments        : [ Comment.schema ]
});

module.exports = mongoose.model('Recipe', RecipeSchema);
