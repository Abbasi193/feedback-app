const mongoose = require('mongoose');
const schema2 = new mongoose.Schema({
    array: [{
        type: String
    }],
    voter : {
        required : true,
        type : String      
    }
})
const Model2 = new mongoose.model("2ndTable",schema2)
module.exports = Model2;