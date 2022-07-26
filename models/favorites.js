const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var favoriteSchema = new Schema({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    dishes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
 }]  

});

var Favorites = mongoose.model('Favorite', favoriteSchema);
module.exports = Favorites; 
