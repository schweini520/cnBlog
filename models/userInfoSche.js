// models/users.js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
 
var userInfoSchema = new Schema({
    name: String,
    password: String,
}, { collection: 'blog' });
 
module.exports = mongoose.model('blog', userInfoSchema);