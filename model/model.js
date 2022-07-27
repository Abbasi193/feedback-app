const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    Survey_name : {
        type: String,
        required: true
    },
    Question : {
        type: String,
        required: true
    },
    Option1 : String,
    Option2 : String,
    Option3 : String,
    Option4 : String
})

const Model = new mongoose.model("Table",schema)
module.exports = Model;