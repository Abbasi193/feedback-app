const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pollSchema = new Schema({
    name : {
        required : true,
        type : String      
    },
    c1 : {
        required : true,
        type : String      
    },
    c2 : {
        required : true,
        type : String      
    },
    creator : {
        required : true,
        type : String      
    },

});

const Poll = mongoose.model('Poll', pollSchema);
module.exports = Poll;