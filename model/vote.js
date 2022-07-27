const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const voteSchema = new Schema({
    pid : {
        required : true,
        type : String      
    },
    op : {
        required : true,
        type : String      
    },
    voter : {
        required : true,
        type : String      
    },

});

const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;