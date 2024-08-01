const mongoose = require('mongoose'); 

const Schema = mongoose.Schema;

const feedbackSchema = new Schema({

    productId:{
        type : String,
        required:true
    },
    userId:{
        type : String,
        required:true
    },
    date:{
        type : String,
        required:true
    },
    name:{
        type : String,
        required:true
    },
    email:{
        type : String,
        required:true
    },
    rating:{
        type : Number,
        required:true
    },
    feedbackType:{
        type : String,
        required:true
    },
    descript:{
        type : String,
        required:true
    }

})

const Feedback = mongoose.model("Feedback",feedbackSchema);

module.exports = Feedback;