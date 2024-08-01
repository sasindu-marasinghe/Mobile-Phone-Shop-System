const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({

    name : {
        type : String,
        required : true
    },

    image :{
        type : [Object],
        
    },

    category :{
        type : String,
        
    },

    brand :{
        type : String,
        
    },
    price :{
        type : Number,
        required : true
    },
    
    countInStock :{
        type : Number,
        required : true
    },


    description :{
        type : String
    }

})

const Product = mongoose.model("Product",productSchema);
module.exports = Product;