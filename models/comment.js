const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CommentSchema = new Schema({
    content: { type: String, required: true },
    replies: [ this ],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe', required: true }
})

module.exports = mongoose.model('Comment', CommentSchema)
