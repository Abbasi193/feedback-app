const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const feedbackSchema = new Schema({
    user : {
        required : true,
        type : String ,     
    },
    feedback : {
        required : true,
        type : String ,
    }

});
const Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports = Feedback;