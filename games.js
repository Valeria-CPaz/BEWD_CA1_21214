//requesting mongoose and Schema for the class to be defined
const mongoose = require('mongoose');
const {Schema} = mongoose;

//setting up the rules for our class using schema
const gamesSchema = new Schema({

    year: Number,
    name: String,
    studio: String,
    isAvailable: Boolean
    
});

//defining the name of the constructor for our class
const Games = mongoose.model('Games', gamesSchema);

//export the class, also called a model or a document, to use in different files
module.exports = Games;