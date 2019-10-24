// models/articles.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var articlesSchema = new Schema({
    articleID: Number,
    articleTitle: String,
    articleAuthor: String,
    articleContent: String,
    articleTime: String,
    articleClick: Number,
}, { collection: 'articles' });
 
module.exports = mongoose.model('articles', articlesSchema);